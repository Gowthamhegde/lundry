import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { serverClient } from '@/lib/supabaseServer';

const RZP_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? 'KS2VqKRVSQnoX8kGluBZi1bN';

// POST /api/payment/verify
// Verifies Razorpay signature, THEN saves the order to the database.
// Order only appears in admin dashboard after successful payment.
export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      razorpay_order_id:   string;
      razorpay_payment_id: string;
      razorpay_signature:  string;
      // Full order payload to save after payment
      orderPayload: {
        id: string;
        user_id?: string | null;
        customer_name: string;
        customer_phone: string;
        pickup_address: string;
        pickup_date?: string;
        pickup_time?: string;
        notes?: string;
        estimated_total: number;
        items: Array<{ service_id?: string; name: string; price: number; quantity: number }>;
      };
    };

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderPayload } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderPayload) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // ── Step 1: Verify HMAC-SHA256 signature ──
    const sigBody  = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac('sha256', RZP_KEY_SECRET)
      .update(sigBody)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // ── Step 2: Save order to database (only after payment verified) ──
    const supabase = serverClient();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        id:             orderPayload.id,
        user_id:        orderPayload.user_id ?? null,
        customer_name:  orderPayload.customer_name,
        customer_phone: orderPayload.customer_phone,
        pickup_address: orderPayload.pickup_address,
        pickup_date:    orderPayload.pickup_date ?? null,
        pickup_time:    orderPayload.pickup_time ?? null,
        notes:          `Payment ID: ${razorpay_payment_id}${orderPayload.notes ? ` | ${orderPayload.notes}` : ''}`,
        estimated_total: orderPayload.estimated_total,
        status:         'Order received',
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // ── Step 3: Save order items ──
    if (orderPayload.items?.length) {
      const { error: itemsError } = await supabase.from('order_items').insert(
        orderPayload.items.map(item => ({
          order_id:   orderPayload.id,
          service_id: item.service_id ?? null,
          name:       item.name,
          price:      item.price,
          quantity:   item.quantity ?? 1,
        })),
      );
      if (itemsError) {
        return NextResponse.json({ error: itemsError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, paymentId: razorpay_payment_id, order });
  } catch (err) {
    console.error('[verify-payment]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Verification failed' },
      { status: 500 },
    );
  }
}
