import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const RZP_KEY_ID     = process.env.RAZORPAY_KEY_ID     ?? 'rzp_test_Sqnq736i26gVbV';
const RZP_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? 'KS2VqKRVSQnoX8kGluBZi1bN';

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

    const razorpay = new Razorpay({
      key_id:     RZP_KEY_ID,
      key_secret: RZP_KEY_SECRET,
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
