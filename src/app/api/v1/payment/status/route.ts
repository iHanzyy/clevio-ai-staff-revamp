import { NextRequest, NextResponse } from 'next/server';

// In-memory store for payment data (status + token)
// In production, use Redis or a database
interface PaymentData {
  status: string;
  access_token?: string;
  plan_code?: string;
}
const paymentDataStore: Map<string, PaymentData> = new Map();

/**
 * GET /api/v1/payment/status?order_id=xxx
 * Poll payment status (called by frontend)
 * Returns status, and access_token if available (after N8N sets it)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('order_id');

  if (!orderId) {
    return NextResponse.json(
      { status: 'unknown', message: 'Missing order_id' },
      { status: 400 }
    );
  }

  const data = paymentDataStore.get(orderId);

  return NextResponse.json({
    status: data?.status || 'pending',
    order_id: orderId,
    access_token: data?.access_token,
    plan_code: data?.plan_code,
  });
}

/**
 * POST /api/v1/payment/status
 * Set payment status (called by n8n after Midtrans callback)
 * Receives: order_id, status, access_token, plan_code from N8N
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, status, access_token, plan_code } = body;

    if (!order_id || !status) {
      return NextResponse.json(
        { success: false, message: 'Missing order_id or status' },
        { status: 400 }
      );
    }

    // Store all payment data including access_token from N8N
    paymentDataStore.set(order_id, {
      status,
      access_token,
      plan_code,
    });

    return NextResponse.json({
      success: true,
      order_id,
      status,
      access_token: access_token ? 'received' : undefined,
      plan_code,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request body' },
      { status: 400 }
    );
  }
}
