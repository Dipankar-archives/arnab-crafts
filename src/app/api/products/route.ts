import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const size = searchParams.get('size');
  const color = searchParams.get('color');
  const maxPrice = Number(searchParams.get('maxPrice') || 999999);
  const products = await prisma.product.findMany({ where: { active: true, price: { lte: maxPrice }, ...(size && size !== 'all' ? { size: size as any } : {}), ...(color && color !== 'all' ? { color: color as any } : {}) }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(products);
}
