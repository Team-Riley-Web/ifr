import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import {
  createSession as persistSession,
  createUser as persistUser,
  deleteSession as removeSession,
  findUserByUsername as findUser,
  getSession as findSession,
  hasUsers as usersExist,
} from './data';

const SESSION_DAYS = 7;

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export async function createSession(userId: number): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  await persistSession(token, userId, expiresAt);
  return token;
}

export async function getSession(token: string) {
  return findSession(token);
}

export async function deleteSession(token: string): Promise<void> {
  await removeSession(token);
}

export async function hasUsers(): Promise<boolean> {
  return usersExist();
}

export async function createUser(username: string, password: string, isAdmin = false): Promise<void> {
  const hash = hashPassword(password);
  await persistUser(username, hash, isAdmin);
}

export async function findUserByUsername(username: string) {
  return findUser(username);
}

export const COOKIE_NAME = 'ifr_session';
export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict' as const,
  path: '/',
  maxAge: SESSION_DAYS * 24 * 60 * 60,
};
