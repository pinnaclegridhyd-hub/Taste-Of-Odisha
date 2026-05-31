import Razorpay from 'razorpay';
import crypto from 'crypto';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  throw new Error(
    'Please define RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables'
  );
}

export const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay order
 */
export async function createRazorpayOrder(
  amount: number,
  orderId: string,
  customerEmail?: string,
  customerPhone?: string
) {
  // Heritage Test Mode: Bypass real API if placeholders or default keys are used
  const isMockKey = (key?: string) => 
    !key || key.includes('placeholder') || key.includes('your_key_id') || key.includes('your_razorpay_secret');

  if (isMockKey(RAZORPAY_KEY_ID) || isMockKey(RAZORPAY_KEY_SECRET)) {
    console.warn('[RAZORPAY] Operating in Heritage Simulation Mode (Test keys detected)');
    return {
       id: `mock_order_${crypto.randomBytes(8).toString('hex')}`,
       amount: Math.round(amount * 100),
       currency: 'INR',
       status: 'created'
    };
  }

  try {
    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency: 'INR',
      receipt: orderId,
      notes: {
        orderId,
        email: customerEmail,
        phone: customerPhone,
      },
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('[RAZORPAY] Error creating order:', error);
    throw error;
  }
}

/**
 * Verify Razorpay payment signature
 */
export function verifyPaymentSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean {
  try {
    const shasum = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET!);
    shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const digest = shasum.digest('hex');

    return digest === razorpaySignature;
  } catch (error) {
    console.error('[RAZORPAY] Error verifying signature:', error);
    return false;
  }
}

/**
 * Verify webhook signature from Razorpay
 */
export function verifyWebhookSignature(
  webhookBody: string,
  webhookSignature: string
): boolean {
  try {
    const shasum = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET!);
    shasum.update(webhookBody);
    const digest = shasum.digest('hex');

    return digest === webhookSignature;
  } catch (error) {
    console.error('[RAZORPAY] Error verifying webhook signature:', error);
    return false;
  }
}

/**
 * Fetch payment details from Razorpay
 */
export async function getPaymentDetails(paymentId: string) {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('[RAZORPAY] Error fetching payment:', error);
    throw error;
  }
}
