import fs from 'node:fs';
import type { Lesson } from './courses';
import { getPdfObjectKey, getPdfPath, courses } from './courses';
import { getObjectBytes, hasR2Config } from './r2';

type NotesMap = Record<string, string>; // lessonId -> note text
const cache = new Map<string, NotesMap>();

export interface CourseNotesDebug {
  courseId: string;
  objectKey: string | null;
  hasR2Config: boolean;
  fetched: boolean;
  bytesLength: number;
  textLength: number;
  textPreview: string;
  units: Array<{ title: string; bodyLength: number }>;
  titleMatches: Array<{ lessonId: string; title: string; matched: boolean; index: number | null }>;
  notes: NotesMap;
  error?: string;
}

async function extractPdfText(data: Uint8Array): Promise<string> {
  // pdfjs-dist is installed as a dependency of pdf-parse
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore — no types for legacy build path
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

  // pdfjs normally loads its worker via a dynamic `import(this.workerSrc)`
  // with a computed (non-literal) specifier, which Netlify's function
  // bundler can't statically trace — so pdf.worker.mjs never makes it into
  // the deployed function and the import fails silently at runtime. Import
  // it statically here and register it as the "main thread" worker so
  // pdfjs skips that dynamic import entirely.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore — no types for legacy build path
  const pdfjsWorker = await import('pdfjs-dist/legacy/build/pdf.worker.mjs');
  (globalThis as any).pdfjsWorker = pdfjsWorker;

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

function getSignificantWords(title: string): string[] {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'in', 'of', 'to', 'for', 'as', 'at']);
  return normalize(title).split(' ').filter(w => w.length > 1 && !stopWords.has(w));
}

function parseUnits(text: string): Array<{ title: string; body: string }> {
  const unitPattern = /\b(?:Unit|Lesson)\s+\d+\s*[:.-]?/gi;
  const parts = text.split(unitPattern);
  const matches = [...text.matchAll(unitPattern)];

  const units: Array<{ title: string; body: string }> = [];

  for (let i = 0; i < matches.length; i++) {
    const raw = (parts[i + 1] ?? '').trim();
    const splitAt = findTitleSplit(raw);

    const title = splitAt > 0 ? raw.slice(0, splitAt).trim() : raw.slice(0, 80).trim();
    const body = splitAt > 0 ? raw.slice(splitAt).trim() : '';
    if (title) units.push({ title, body: body || title });
  }

  return units;
}

function findTitleSplit(raw: string): number {
  // PDF extraction can flatten line breaks, so support both actual newlines
  // and the wider spacing that usually appears between a heading and body.
  const newline = raw.indexOf('\n');
  const doubleSpace = raw.search(/\s{2,}/);
  const sentence = raw.search(/[.!?]\s+[A-Z]/);
  return [newline, doubleSpace, sentence > 0 ? sentence + 1 : -1]
    .filter(n => n > 0)
    .sort((a, b) => a - b)[0] ?? -1;
}

function makeTitleRegex(title: string): RegExp | null {
  const words = getSignificantWords(title).slice(0, 5);
  if (words.length === 0) return null;
  const escaped = words.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(escaped.join('[\\s\\S]{0,80}?'), 'i');
}

function parseByLessonTitles(text: string, lessons: Lesson[]): NotesMap {
  const positions = lessons
    .map((lesson) => {
      const regex = makeTitleRegex(lesson.title);
      const match = regex?.exec(text);
      return match ? { lessonId: lesson.id, start: match.index, bodyStart: match.index + match[0].length } : null;
    })
    .filter((item): item is { lessonId: string; start: number; bodyStart: number } => item !== null)
    .sort((a, b) => a.start - b.start);

  const result: NotesMap = {};

  for (let i = 0; i < positions.length; i++) {
    const current = positions[i]!;
    const next = positions[i + 1];
    const body = text
      .slice(current.bodyStart, next ? next.start : undefined)
      .replace(/\s{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();

    if (body.length > 20) {
      result[current.lessonId] = body;
    }
  }

  return result;
}

async function getPdfBytes(courseId: string, objectKey: string): Promise<Uint8Array | null> {
  if (hasR2Config) {
    return getObjectBytes(objectKey);
  }

  const pdfPath = getPdfPath(courseId);
  if (pdfPath && fs.existsSync(pdfPath)) {
    return fs.readFileSync(pdfPath);
  }

  return null;
}

function parseNotesFromText(courseId: string, text: string): NotesMap {
  const course = courses.find(c => c.id === courseId);
  if (!course) {
    return {};
  }

  const units = parseUnits(text);
  const result: NotesMap = {};

  if (units.length > 0) {
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
  }

  const titleBasedNotes = parseByLessonTitles(text, course.lessons);
  return { ...titleBasedNotes, ...result };
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
    pdfBytes = await getPdfBytes(courseId, objectKey);
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
    const merged = parseNotesFromText(courseId, text);

    cache.set(courseId, merged);
    return merged;
  } catch (err) {
    console.error(`[pdf-notes] Failed to parse ${objectKey}:`, err);
    // Don't cache — the fetched bytes may have been a partial/corrupted
    // transfer, so let the next request retry instead of staying empty.
    return {};
  }
}

export async function getCourseNotesDebug(courseId: string): Promise<CourseNotesDebug> {
  const objectKey = getPdfObjectKey(courseId);
  const emptyDebug: CourseNotesDebug = {
    courseId,
    objectKey,
    hasR2Config,
    fetched: false,
    bytesLength: 0,
    textLength: 0,
    textPreview: '',
    units: [],
    titleMatches: [],
    notes: {},
  };

  if (!objectKey) {
    return { ...emptyDebug, error: 'No PDF object key for course' };
  }

  let pdfBytes: Uint8Array | null = null;
  try {
    pdfBytes = await getPdfBytes(courseId, objectKey);
  } catch (err) {
    return { ...emptyDebug, error: err instanceof Error ? err.message : String(err) };
  }

  if (!pdfBytes) {
    return { ...emptyDebug, error: 'PDF bytes not found' };
  }

  try {
    const text = await extractPdfText(pdfBytes);
    const course = courses.find(c => c.id === courseId);
    const units = parseUnits(text);
    const notes = parseNotesFromText(courseId, text);

    return {
      ...emptyDebug,
      fetched: true,
      bytesLength: pdfBytes.byteLength,
      textLength: text.length,
      textPreview: text.replace(/\s+/g, ' ').trim().slice(0, 1200),
      units: units.slice(0, 20).map(unit => ({
        title: unit.title.slice(0, 120),
        bodyLength: unit.body.length,
      })),
      titleMatches: (course?.lessons ?? []).map((lesson) => {
        const regex = makeTitleRegex(lesson.title);
        const match = regex?.exec(text);
        return {
          lessonId: lesson.id,
          title: lesson.title,
          matched: Boolean(match),
          index: match?.index ?? null,
        };
      }),
      notes,
    };
  } catch (err) {
    return {
      ...emptyDebug,
      fetched: true,
      bytesLength: pdfBytes.byteLength,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
