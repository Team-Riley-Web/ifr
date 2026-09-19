import type { APIRoute } from 'astro';
import { getPlaybackPositions, setPlaybackPosition } from '../../lib/data';

export const GET: APIRoute = async ({ locals, url }) => {
  const user = locals.user!;
  const courseId = url.searchParams.get('courseId');
  const positions = await getPlaybackPositions(user.id);

  if (courseId) {
    return new Response(JSON.stringify(positions[courseId] ?? {}), { headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify(positions), { headers: { 'Content-Type': 'application/json' } });
};

export const POST: APIRoute = async ({ locals, request }) => {
  const user = locals.user!;
  let body: { courseId?: string; mediaKey?: string; position?: number };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }

  const { courseId, mediaKey, position } = body;
  if (!courseId || !mediaKey || typeof position !== 'number' || !Number.isFinite(position)) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }

  await setPlaybackPosition(user.id, courseId, mediaKey, Math.max(0, position));

  return new Response(JSON.stringify({ ok: true }));
};
