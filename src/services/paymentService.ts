import axios from 'axios';

const PAYMENT_WEBHOOK_URL = process.env.NEXT_PUBLIC_PAYMENT_WEBHOOK_URL || '';

export interface PaymentWebhookPayload {
  user_id: string;
  email: string;
  plan_code: 'PRO_M';
  charge: string;
  harga: string;
  order_suffix: string;
  source: 'frontend';
}

export interface PaymentWebhookResponse {
  success: boolean;
  payment_url?: string;
  redirect_url?: string;
  order_id?: string;
  message?: string;
}

export interface PaymentStatusResponse {
  status: 'pending' | 'settlement' | 'expire' | 'cancel' | 'deny' | 'unknown';
  order_id?: string;
}

/**
 * Generate unique order suffix for Midtrans
 */
export const generateOrderSuffix = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
};

/**
 * Notify payment webhook (n8n) to create Midtrans order
 */
export const notifyPaymentWebhook = async (
  payload: PaymentWebhookPayload
): Promise<PaymentWebhookResponse> => {
  try {
    const response = await axios.post<PaymentWebhookResponse>(
      PAYMENT_WEBHOOK_URL,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Payment webhook failed');
    }
    throw error;
  }
};

/**
 * Get payment status from internal API (polling)
 */
export const getPaymentStatus = async (
  orderId: string
): Promise<PaymentStatusResponse> => {
  try {
    const response = await axios.get<PaymentStatusResponse>(
      `/api/v1/payment/status?order_id=${orderId}`
    );
    return response.data;
  } catch {
    return { status: 'unknown' };
  }
};

export const paymentService = {
  generateOrderSuffix,
  notifyPaymentWebhook,
  getPaymentStatus,
};
