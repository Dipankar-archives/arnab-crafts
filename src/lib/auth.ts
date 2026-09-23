import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const COOKIE = 'arnab_session';
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'development-only-secret');

export async function createSession(user: { id: string; role: string }) {
  const token = await new SignJWT({ role: user.role }).setProtectedHeader({ alg: 'HS256' }).setSubject(user.id).setIssuedAt().setExpirationTime('7d').sign(secret);
  cookies().set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
}

export async function getSession() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return { id: String(payload.sub), role: String(payload.role) };
  } catch { return null; }
}

export function clearSession() { cookies().set(COOKIE, '', { httpOnly: true, expires: new Date(0), path: '/' }); }
