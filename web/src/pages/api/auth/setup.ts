import type { APIRoute } from 'astro';
import { hasUsers, createUser, findUserByUsername, createSession, COOKIE_NAME, COOKIE_OPTIONS } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  if (await hasUsers()) {
    return new Response(JSON.stringify({ error: 'Setup already complete' }), { status: 403 });
  }

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }

  const { username, password } = body;
  if (!username?.trim() || !password || password.length < 8) {
    return new Response(JSON.stringify({ error: 'Username required and password must be at least 8 characters' }), { status: 400 });
  }

  await createUser(username.trim(), password, true);

  const user = await findUserByUsername(username.trim());
  if (user) {
    const token = await createSession(user.id);
    cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
  }

  return new Response(JSON.stringify({ ok: true }));
};
