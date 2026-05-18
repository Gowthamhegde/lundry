import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// POST /api/payment/create-order
export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json() as {
      amount: number;   // in rupees
      orderId: string;
    };

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    const amountPaise = Math.round(amount * 100);

    // Razorpay minimum is 100 paise (₹1)
    if (!amount || amountPaise < 100) {
      return NextResponse.json({ error: 'Amount must be at least ₹1' }, { status: 400 });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: 'Razorpay credentials not configured' }, { status: 500 });
    }

    // Instantiate inside handler — env vars not available at build time
    const razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount:   amountPaise,
      currency: 'INR',
      receipt:  orderId,
      notes:    { orderId },
    });

    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      amount:          razorpayOrder.amount,
      currency:        razorpayOrder.currency,
    });
  } catch (err) {
    console.error('[create-order]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create payment order' },
      { status: 500 },
    );
  }
}
