import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

const schema = z.object({ currentPassword: z.string(), newPassword: z.string().min(12) });
export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Admin authentication required' }, { status: 403 });
  const body = schema.parse(await request.json());
  const admin = await prisma.user.findUnique({ where: { id: session.id } });
  if (!admin || !(await bcrypt.compare(body.currentPassword, admin.passwordHash))) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
  await prisma.user.update({ where: { id: session.id }, data: { passwordHash: await bcrypt.hash(body.newPassword, 12) } });
  return NextResponse.json({ ok: true });
}
