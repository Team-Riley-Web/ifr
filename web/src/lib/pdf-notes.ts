import fs from 'node:fs';
import { getPdfObjectKey, getPdfPath, courses } from './courses';
import { getObjectBytes, hasR2Config } from './r2';

type NotesMap = Record<string, string>; // lessonId -> note text
const cache = new Map<string, NotesMap>();

async function extractPdfText(data: Uint8Array): Promise<string> {
  // pdfjs-dist is installed as a dependency of pdf-parse
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore — no types for legacy build path
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await (pdfjs as any).getDocument({
    data,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
  }).promise;

  let text = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text += (content.items as any[])
      .filter((x) => 'str' in x)
      .map((x) => x.str)
      .join(' ') + '\n';
  }
  return text;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function titleSimilarity(a: string, b: string): number {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'in', 'of', 'to', 'for', 'as', 'at']);
  const wordsA = normalize(a).split(' ').filter(w => w.length > 1 && !stopWords.has(w));
  const normB = normalize(b);
  if (wordsA.length === 0) return 0;
  const matches = wordsA.filter(w => normB.includes(w)).length;
  return matches / wordsA.length;
}

function parseUnits(text: string): Array<{ title: string; body: string }> {
  const unitPattern = /Unit\s+\d+\s*:/gi;
  const parts = text.split(unitPattern);
  const matches = [...text.matchAll(unitPattern)];

  const units: Array<{ title: string; body: string }> = [];

  for (let i = 0; i < matches.length; i++) {
    const raw = (parts[i + 1] ?? '').trim();
    // Title ends at first double-space or first newline — whichever comes first
    const doubleSpace = raw.indexOf('  ');
    const newline = raw.indexOf('\n');
    const splitAt = [doubleSpace, newline].filter(n => n > 0).sort((a, b) => a - b)[0] ?? -1;

    const title = splitAt > 0 ? raw.slice(0, splitAt).trim() : raw.slice(0, 80).trim();
    const body = splitAt > 0 ? raw.slice(splitAt).trim() : '';
    if (title) units.push({ title, body: body || title });
  }

  return units;
}

export async function getCourseNotes(courseId: string): Promise<NotesMap> {
  if (cache.has(courseId)) return cache.get(courseId)!;

  const objectKey = getPdfObjectKey(courseId);
  if (!objectKey) {
    cache.set(courseId, {});
    return {};
  }

  let pdfBytes: Uint8Array | null = null;
  try {
    if (hasR2Config) {
      pdfBytes = await getObjectBytes(objectKey);
    } else {
      const pdfPath = getPdfPath(courseId);
      if (pdfPath && fs.existsSync(pdfPath)) {
        pdfBytes = fs.readFileSync(pdfPath);
      }
    }
  } catch (err) {
    console.error(`[pdf-notes] Failed to fetch ${objectKey}:`, err);
  }

  // Don't cache a fetch failure — it may be a transient R2 error, and we
  // want the next request to retry rather than be stuck empty until restart.
  if (!pdfBytes) {
    return {};
  }

  try {
    const text = await extractPdfText(pdfBytes);
    const units = parseUnits(text);
    const course = courses.find(c => c.id === courseId);
    if (!course || units.length === 0) {
      cache.set(courseId, {});
      return {};
    }

    const result: NotesMap = {};

    for (const lesson of course.lessons) {
      let bestScore = 0;
      let bestBody = '';

      for (const unit of units) {
        const score = titleSimilarity(lesson.title, unit.title);
        if (score > bestScore) {
          bestScore = score;
          bestBody = unit.body;
        }
      }

      // Only include if we have a decent match
      if (bestScore >= 0.4 && bestBody.trim().length > 20) {
        result[lesson.id] = bestBody.trim();
      }
    }

    cache.set(courseId, result);
    return result;
  } catch (err) {
    console.error(`[pdf-notes] Failed to parse ${objectKey}:`, err);
    // Don't cache — the fetched bytes may have been a partial/corrupted
    // transfer, so let the next request retry instead of staying empty.
    return {};
  }
}
