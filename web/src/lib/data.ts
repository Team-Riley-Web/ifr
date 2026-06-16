import { getStore } from '@netlify/blobs';
import { getDb } from './db';

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  isAdmin: boolean;
}

interface Session {
  userId: number;
  expiresAt: number;
}

interface SessionUser {
  id: number;
  username: string;
  isAdmin: boolean;
}

type Progress = Record<string, Record<string, boolean>>;

// process.env.NETLIFY is only set during the build step, not at function
// runtime. NETLIFY_BLOBS_CONTEXT is what @netlify/blobs itself relies on to
// auto-configure, so it's the reliable signal for "Blobs is usable here".
const isNetlify = Boolean(process.env.NETLIFY_BLOBS_CONTEXT);
const SESSION_STORE = 'ifr-sessions';
const DATA_STORE = 'ifr-data';

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

async function getUsers(): Promise<User[]> {
  return (await getStore(DATA_STORE).get('users', { type: 'json', consistency: 'strong' }) as User[] | null) ?? [];
}

export async function hasUsers(): Promise<boolean> {
  if (isNetlify) return (await getUsers()).length > 0;
  const row = getDb().prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  return row.count > 0;
}

export async function createUser(username: string, passwordHash: string, isAdmin = false): Promise<void> {
  if (isNetlify) {
    const users = await getUsers();
    if (users.some(user => normalizeUsername(user.username) === normalizeUsername(username))) {
      throw new Error('Username already exists');
    }
    const nextId = users.reduce((max, user) => Math.max(max, user.id), 0) + 1;
    users.push({ id: nextId, username: username.trim(), passwordHash, isAdmin });
    await getStore(DATA_STORE).setJSON('users', users);
    return;
  }

  getDb().prepare('INSERT INTO users (username, password_hash, is_admin) VALUES (?, ?, ?)').run(
    username.trim(),
    passwordHash,
    isAdmin ? 1 : 0,
  );
}

export async function findUserByUsername(username: string): Promise<User | null> {
  if (isNetlify) {
    return (await getUsers()).find(user => normalizeUsername(user.username) === normalizeUsername(username)) ?? null;
  }

  const row = getDb().prepare(
    'SELECT id, username, password_hash, is_admin FROM users WHERE username = ?',
  ).get(username) as { id: number; username: string; password_hash: string; is_admin: number } | undefined;
  return row
    ? { id: row.id, username: row.username, passwordHash: row.password_hash, isAdmin: row.is_admin === 1 }
    : null;
}

export async function createSession(token: string, userId: number, expiresAt: number): Promise<void> {
  if (isNetlify) {
    await getStore(SESSION_STORE).setJSON(token, { userId, expiresAt });
    return;
  }
  const db = getDb();
  db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(token, userId, expiresAt);
  db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(Date.now());
}

export async function getSession(token: string): Promise<SessionUser | null> {
  if (isNetlify) {
    const session = await getStore(SESSION_STORE).get(token, { type: 'json', consistency: 'strong' }) as Session | null;
    if (!session || session.expiresAt <= Date.now()) return null;
    const user = (await getUsers()).find(candidate => candidate.id === session.userId);
    return user ? { id: user.id, username: user.username, isAdmin: user.isAdmin } : null;
  }

  const row = getDb().prepare(`
    SELECT u.id, u.username, u.is_admin
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token = ? AND s.expires_at > ?
  `).get(token, Date.now()) as { id: number; username: string; is_admin: number } | undefined;
  return row ? { id: row.id, username: row.username, isAdmin: row.is_admin === 1 } : null;
}

export async function deleteSession(token: string): Promise<void> {
  if (isNetlify) {
    await getStore(SESSION_STORE).delete(token);
    return;
  }
  getDb().prepare('DELETE FROM sessions WHERE token = ?').run(token);
}

export async function getProgress(userId: number): Promise<Progress> {
  if (isNetlify) {
    return (await getStore(DATA_STORE).get(`progress/${userId}`, { type: 'json', consistency: 'strong' }) as Progress | null) ?? {};
  }

  const rows = getDb().prepare(
    'SELECT course_id, lesson_id, completed FROM progress WHERE user_id = ?',
  ).all(userId) as { course_id: string; lesson_id: string; completed: number }[];
  const progress: Progress = {};
  for (const row of rows) {
    progress[row.course_id] ??= {};
    progress[row.course_id]![row.lesson_id] = row.completed === 1;
  }
  return progress;
}

export async function setLessonProgress(userId: number, courseId: string, lessonId: string, completed: boolean): Promise<void> {
  if (isNetlify) {
    const progress = await getProgress(userId);
    progress[courseId] ??= {};
    progress[courseId]![lessonId] = completed;
    await getStore(DATA_STORE).setJSON(`progress/${userId}`, progress);
    return;
  }

  getDb().prepare(`
    INSERT INTO progress (user_id, course_id, lesson_id, completed, completed_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id, course_id, lesson_id) DO UPDATE SET
      completed = excluded.completed,
      completed_at = excluded.completed_at
  `).run(userId, courseId, lessonId, completed ? 1 : 0, completed ? new Date().toISOString() : null);
}
