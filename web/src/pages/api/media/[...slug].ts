import type { APIRoute } from 'astro';
import fs from 'node:fs';
import { Readable } from 'node:stream';
import { getMediaFilePath, getMediaObjectKey } from '../../../lib/courses';
import { getSignedContentUrl, hasR2Config } from '../../../lib/r2';

const MIME: Record<string, string> = {
  mp4: 'video/mp4',
  mp3: 'audio/mpeg',
  m4a: 'audio/mp4',
  ogg: 'audio/ogg',
  webm: 'video/webm',
};

export const GET: APIRoute = async ({ params, request, locals }) => {
  if (!locals.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // slug format: courseId/lessonId/tabId/fileIndex
  const parts = (params.slug ?? '').split('/');
  if (parts.length < 4) {
    return new Response('Bad Request', { status: 400 });
  }

  const [courseId, lessonId, tabId, indexStr] = parts;
  const fileIndex = parseInt(indexStr, 10);
  if (isNaN(fileIndex)) {
    return new Response('Bad Request', { status: 400 });
  }

  const objectKey = getMediaObjectKey(courseId, lessonId, tabId, fileIndex);
  if (!objectKey) {
    return new Response('Not Found', { status: 404 });
  }

  if (hasR2Config) {
    return Response.redirect(await getSignedContentUrl(objectKey), 302);
  }

  const filePath = getMediaFilePath(courseId, lessonId, tabId, fileIndex)!;
  if (!fs.existsSync(filePath)) {
    return new Response('File Not Found', { status: 404 });
  }

  const ext = filePath.split('.').pop()?.toLowerCase() ?? '';
  const contentType = MIME[ext] ?? 'application/octet-stream';
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = request.headers.get('range');

  if (range) {
    const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const nodeStream = fs.createReadStream(filePath, { start, end });
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;

    return new Response(webStream, {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': String(chunkSize),
        'Content-Type': contentType,
      },
    });
  }

  const nodeStream = fs.createReadStream(filePath);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream;

  return new Response(webStream, {
    headers: {
      'Content-Length': String(fileSize),
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
    },
  });
};
