import { NextRequest, NextResponse } from 'next/server';

// In-memory store for payment status
// In production, use Redis or a database
const paymentStatusStore: Map<string, string> = new Map();

/**
 * GET /api/v1/payment/status?order_id=xxx
 * Poll payment status (called by frontend)
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

  const status = paymentStatusStore.get(orderId) || 'pending';

  return NextResponse.json({
    status,
    order_id: orderId,
  });
}

/**
 * POST /api/v1/payment/status
 * Set payment status (called by n8n after Midtrans callback)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, status } = body;

    if (!order_id || !status) {
      return NextResponse.json(
        { success: false, message: 'Missing order_id or status' },
        { status: 400 }
      );
    }

    paymentStatusStore.set(order_id, status);

    return NextResponse.json({
      success: true,
      order_id,
      status,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request body' },
      { status: 400 }
    );
  }
}
