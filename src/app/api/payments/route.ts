import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Admin authentication required' }, { status: 403 });
  const body = await request.json();
  if (!['RAZORPAY', 'UPI', 'CARD', 'NET_BANKING', 'WALLET'].includes(body.method)) return NextResponse.json({ error: 'Unsupported online payment method' }, { status: 400 });
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return NextResponse.json({ error: 'Configure Razorpay keys in environment variables before accepting live online payments.' }, { status: 503 });
  return NextResponse.json({ error: 'Payment gateway adapter is ready for Razorpay credentials but must be connected to your merchant account.' }, { status: 501 });
}
