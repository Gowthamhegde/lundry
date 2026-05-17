import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { serverClient } from '@/lib/supabaseServer';

// POST /api/payment/verify
// Verifies Razorpay payment signature and updates order status
export async function POST(request: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = await request.json() as {
      razorpay_order_id:  string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      orderId: string;
    };

    // Verify signature
    const body      = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected  = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Update order status to "Order received" (payment confirmed)
    const supabase = serverClient();
    const { error } = await supabase
      .from('orders')
      .update({
        status:     'Order received',
        notes:      `Payment ID: ${razorpay_payment_id}`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, paymentId: razorpay_payment_id });
  } catch (err) {
    console.error('[verify-payment]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Verification failed' },
      { status: 500 },
    );
  }
}
