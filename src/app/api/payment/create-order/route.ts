import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// POST /api/payment/create-order
// Creates a Razorpay order for the given amount
export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json() as {
      amount: number;   // in rupees
      orderId: string;  // our internal FW-XXXXXX id
    };

    if (!amount || !orderId) {
      return NextResponse.json({ error: 'amount and orderId are required' }, { status: 400 });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount:   Math.round(amount * 100), // Razorpay expects paise
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
