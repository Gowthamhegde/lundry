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

    if (!amount || amountPaise < 100) {
      return NextResponse.json({ error: 'Amount must be at least ₹1' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Payment service is not configured.' }, { status: 503 });
    }

    const razorpay = new Razorpay({
      key_id:     keyId,
      key_secret: keySecret,
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
    console.error('[create-order]', JSON.stringify(err));
    const message = err instanceof Error ? err.message
      : typeof err === 'object' && err !== null && 'error' in err
        ? JSON.stringify((err as { error: unknown }).error)
        : 'Failed to create payment order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
