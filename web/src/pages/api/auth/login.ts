import type { APIRoute } from 'astro';
import { findUserByUsername, verifyPassword, createSession, COOKIE_NAME, COOKIE_OPTIONS } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }

  const { username, password } = body;
  if (!username || !password) {
    return new Response(JSON.stringify({ error: 'Username and password required' }), { status: 400 });
  }

  const user = await findUserByUsername(username.trim());
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return new Response(JSON.stringify({ error: 'Invalid username or password' }), { status: 401 });
  }

  const token = await createSession(user.id);
  cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
