import type { APIRoute } from 'astro';
import { randomBytes } from 'node:crypto';
import { createUser, findUserByUsername } from '../../../lib/auth';

function generatePassword(): string {
  return randomBytes(9).toString('base64url');
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user?.isAdmin) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  let body: { username?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }

  const username = body.username?.trim();
  if (!username) {
    return new Response(JSON.stringify({ error: 'Username required' }), { status: 400 });
  }

  if (await findUserByUsername(username)) {
    return new Response(JSON.stringify({ error: 'Username already exists' }), { status: 409 });
  }

  const password = generatePassword();
  await createUser(username, password, false);

  return new Response(JSON.stringify({ username, password }));
};
