import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { createSession, clearSession } from '@/lib/auth';

const credentials = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function POST(request: Request) {
  const body = credentials.parse(await request.json());
  const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  await createSession(user);
  return NextResponse.json({ user: { id: user.id, name: user.name, role: user.role } });
}

export async function DELETE() { clearSession(); return NextResponse.json({ ok: true }); }
