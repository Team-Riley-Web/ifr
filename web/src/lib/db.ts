import type { DatabaseSync } from 'node:sqlite';
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// node:sqlite needs the --experimental-sqlite flag, which Netlify's function
// runtime doesn't pass. Load it lazily so the import only happens for local
// dev (the isNetlify branch in lib/data.ts never calls getDb()).
const require = createRequire(import.meta.url);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../../data');
let db: DatabaseSync | undefined;

export function getDb(): DatabaseSync {
  if (db) return db;

  const { DatabaseSync } = require('node:sqlite') as typeof import('node:sqlite');
  fs.mkdirSync(DATA_DIR, { recursive: true });
  db = new DatabaseSync(path.join(DATA_DIR, 'ifr.db'));
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA foreign_keys = ON');
  db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS progress (
    user_id INTEGER NOT NULL,
    course_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    completed_at DATETIME,
    PRIMARY KEY (user_id, course_id, lesson_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS user_activity (
    user_id INTEGER PRIMARY KEY,
    course_id TEXT NOT NULL,
    lesson_id TEXT,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

  return db;
}
