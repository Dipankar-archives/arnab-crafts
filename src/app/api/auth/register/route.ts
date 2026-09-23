import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { createSession } from '@/lib/auth';

const schema = z.object({ name: z.string().min(2), email: z.string().email(), phone: z.string().min(10), password: z.string().min(8) });

export async function POST(request: Request) {
  const data = schema.parse(await request.json());
  const email = data.email.toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: 'An account already exists' }, { status: 409 });
  const user = await prisma.user.create({ data: { ...data, email, passwordHash: await bcrypt.hash(data.password, 12) } });
  await createSession(user);
  return NextResponse.json({ user: { id: user.id, name: user.name, role: user.role } }, { status: 201 });
}
