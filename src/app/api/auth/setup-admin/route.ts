import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { createSession } from '@/lib/auth';

const schema = z.object({ setupToken: z.string().min(1), name: z.string().min(2), email: z.string().email(), password: z.string().min(12) });
export async function POST(request: Request) {
  const data = schema.parse(await request.json());
  if (!process.env.ADMIN_SETUP_TOKEN || data.setupToken !== process.env.ADMIN_SETUP_TOKEN) return NextResponse.json({ error: 'Invalid setup token' }, { status: 403 });
  if (await prisma.user.count({ where: { role: 'ADMIN' } })) return NextResponse.json({ error: 'Admin has already been initialized' }, { status: 409 });
  const user = await prisma.user.create({ data: { name: data.name, email: data.email.toLowerCase(), passwordHash: await bcrypt.hash(data.password, 12), role: 'ADMIN' } });
  await createSession(user);
  return NextResponse.json({ ok: true }, { status: 201 });
}
