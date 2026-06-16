import type { APIRoute } from 'astro';
import { deleteSession, COOKIE_NAME, COOKIE_OPTIONS } from '../../../lib/auth';

export const POST: APIRoute = async ({ cookies }) => {
  const token = cookies.get(COOKIE_NAME)?.value;
  if (token) await deleteSession(token);
  cookies.set(COOKIE_NAME, '', { ...COOKIE_OPTIONS, maxAge: 0 });
  return new Response(JSON.stringify({ ok: true }));
};
