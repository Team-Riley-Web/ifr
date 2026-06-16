import { defineMiddleware } from 'astro:middleware';
import { getSession, COOKIE_NAME } from './lib/auth';

const PUBLIC = ['/', '/setup', '/api/auth/login', '/api/auth/logout', '/api/auth/setup'];

export const onRequest = defineMiddleware(async (ctx, next) => {
  const { pathname } = ctx.url;
  ctx.locals.user = null;

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
