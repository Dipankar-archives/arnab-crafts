import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

const schema = z.object({ items: z.array(z.object({ productId: z.string(), quantity: z.number().int().min(1) })).min(1), paymentMethod: z.enum(['RAZORPAY', 'UPI', 'CARD', 'NET_BANKING', 'WALLET', 'COD']), shippingName: z.string().min(2), shippingPhone: z.string().min(10), shippingAddress: z.string().min(10) });
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Please register or log in before ordering' }, { status: 401 });
  const data = schema.parse(await request.json());
  const products = await prisma.product.findMany({ where: { id: { in: data.items.map((i) => i.productId) }, active: true } });
  const total = data.items.reduce((sum, item) => sum + (products.find((p) => p.id === item.productId)?.price || 0) * item.quantity, 0);
  if (!total) return NextResponse.json({ error: 'No valid products in order' }, { status: 400 });
  const order = await prisma.order.create({ data: { userId: session.id, total, paymentMethod: data.paymentMethod, shippingName: data.shippingName, shippingPhone: data.shippingPhone, shippingAddress: data.shippingAddress, items: { create: data.items.map((item) => ({ productId: item.productId, quantity: item.quantity, price: products.find((p) => p.id === item.productId)!.price })) } } });
  return NextResponse.json({ orderId: order.id, total, message: data.paymentMethod === 'COD' ? 'Order received. Pay on delivery.' : 'Order received. Complete payment through the configured gateway.' }, { status: 201 });
}
