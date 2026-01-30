import { NextRequest, NextResponse } from 'next/server';

// In-memory store for payment data (status + token)
// In production, use Redis or a database
interface PaymentData {
  status: string;
  access_token?: string;
  plan_code?: string;
  timestamp: number; // For TTL cleanup
}
const paymentDataStore: Map<string, PaymentData> = new Map();

// Cleanup expired payments (older than 1 hour) every 10 minutes
// Prevents memory leak in long-running process
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, data] of paymentDataStore.entries()) {
      if (now - data.timestamp > 3600 * 1000) {
        paymentDataStore.delete(key);
      }
    }
  }, 600 * 1000);
}

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
 * Set payment status (called by n8n after Midtrans callback OR for trial activation)
 * 
 * For PAID: Receives order_id, status, access_token, plan_code from N8N
 * For TRIAL: Receives access_token, plan_code (no order_id/status needed)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, status, access_token, plan_code } = body;

    // GUEST flow: no order_id/status required, just return success with token info
    if (plan_code === 'GUEST') {
      console.log(`[PaymentStatus] GUEST activation - access_token received`);
      return NextResponse.json({
        success: true,
        plan_code: 'GUEST',
        access_token: access_token,
        message: 'GUEST activated successfully'
      });
    }

    // PAID flow: requires order_id and status
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
      timestamp: Date.now()
    });

    return NextResponse.json({
      success: true,
      order_id,
      status,
      access_token: access_token,
      plan_code,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request body' },
      { status: 400 }
    );
  }
}
