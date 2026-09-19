import type { APIRoute } from 'astro';
import { setLastTab } from '../../lib/data';

export const POST: APIRoute = async ({ locals, request }) => {
  const user = locals.user!;
  let body: { courseId?: string; lessonId?: string; tabId?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }

  const { courseId, lessonId, tabId } = body;
  if (!courseId || !lessonId || !tabId) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }

  await setLastTab(user.id, courseId, lessonId, tabId);

  return new Response(JSON.stringify({ ok: true }));
};
