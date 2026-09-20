import { defineMiddleware } from 'astro:middleware';
import { getSession, COOKIE_NAME } from './lib/auth';
import { getDb } from './lib/db';

const PUBLIC = ['/', '/setup', '/api/auth/login', '/api/auth/logout', '/api/auth/setup'];

export const onRequest = defineMiddleware(async (ctx, next) => {
  const { pathname } = ctx.url;
  ctx.locals.user = null;

  // Only the development server on loopback gets a dedicated local identity.
  // Keep a real SQLite row so progress and activity foreign keys still work.
  if (import.meta.env.DEV && ['localhost', '127.0.0.1', '[::1]'].includes(ctx.url.hostname)) {
    const db = getDb();
    db.prepare('INSERT OR IGNORE INTO users (id, username, password_hash, is_admin) VALUES (?, ?, ?, ?)')
      .run(-1, 'Local Preview', '!local-preview-disabled-password', 0);
    ctx.locals.user = { id: -1, username: 'Local Preview', isAdmin: false };
    if (pathname === '/' || pathname === '/setup') return ctx.redirect('/dashboard');
    return next();
  }

  const token = ctx.cookies.get(COOKIE_NAME)?.value;
  if (token) {
    ctx.locals.user = await getSession(token);
  }

  if (PUBLIC.includes(pathname)) {
    // Redirect logged-in users away from login page
    if (pathname === '/' && ctx.locals.user) {
      return ctx.redirect('/dashboard');
    }
    return next();
  }

  if (!ctx.locals.user) {
    if (pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return ctx.redirect('/');
  }

  return next();
});
