import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Admin authentication required' }, { status: 403 });
  const body = await request.json();
  const product = await prisma.product.create({ data: { name: body.name, description: body.description || '', imageUrl: body.imageUrl, price: Number(body.price), size: body.size, color: body.color } });
  return NextResponse.json(product, { status: 201 });
}
