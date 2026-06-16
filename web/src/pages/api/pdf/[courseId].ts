import type { APIRoute } from 'astro';
import fs from 'node:fs';
import { Readable } from 'node:stream';
import { getPdfObjectKey, getPdfPath } from '../../../lib/courses';
import { getSignedContentUrl, hasR2Config } from '../../../lib/r2';

export const GET: APIRoute = async ({ params, locals }) => {
  if (!locals.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const objectKey = getPdfObjectKey(params.courseId ?? '');
  if (!objectKey) {
    return new Response('Not Found', { status: 404 });
  }

  if (hasR2Config) {
    return Response.redirect(await getSignedContentUrl(objectKey), 302);
  }

  const filePath = getPdfPath(params.courseId ?? '');
  if (!filePath || !fs.existsSync(filePath)) {
    return new Response('Not Found', { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const nodeStream = fs.createReadStream(filePath);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream;

  return new Response(webStream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Length': String(stat.size),
      'Content-Disposition': 'inline; filename="IFR.pdf"',
    },
  });
};
