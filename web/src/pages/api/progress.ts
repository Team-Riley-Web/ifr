import type { APIRoute } from 'astro';
import { getProgress, setLessonProgress } from '../../lib/data';

export const GET: APIRoute = async ({ locals, url }) => {
  const user = locals.user!;
  const courseId = url.searchParams.get('courseId');
  const progress = await getProgress(user.id);

  if (courseId) {
    return new Response(JSON.stringify(progress[courseId] ?? {}), { headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify(progress), { headers: { 'Content-Type': 'application/json' } });
};

export const POST: APIRoute = async ({ locals, request }) => {
  const user = locals.user!;
  let body: { courseId?: string; lessonId?: string; completed?: boolean };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }

  const { courseId, lessonId, completed } = body;
  if (!courseId || !lessonId || completed === undefined) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }

  await setLessonProgress(user.id, courseId, lessonId, completed);

  return new Response(JSON.stringify({ ok: true }));
};
