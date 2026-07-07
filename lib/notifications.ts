/**
 * notifications.ts
 * Handles order confirmation notifications:
 *  - Email via Nodemailer (Gmail SMTP)
 *  - WhatsApp via Twilio WhatsApp API
 *
 * Both channels are optional — if env vars are missing, they silently skip.
 */

import nodemailer from 'nodemailer';

export interface OrderNotificationPayload {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  subtotal?: number;
  deliveryCharge?: number;
  discount?: number;
  advancePaid?: number;
  balanceDue?: number;
  paymentMethod: string;
  shippingAddress: {
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
  };
}

// ─────────────────────────────────────────────
// EMAIL — Gmail SMTP via Nodemailer
// ─────────────────────────────────────────────
function buildEmailHtml(order: OrderNotificationPayload): string {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0ece4;font-size:14px;color:#3d2c1e">${item.name}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0ece4;font-size:14px;color:#3d2c1e;text-align:center">${item.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0ece4;font-size:14px;color:#3d2c1e;text-align:right">₹${(item.price * item.quantity).toFixed(0)}</td>
      </tr>`
    )
    .join('');

  const isCod = order.paymentMethod === 'cod';

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Order Confirmed – Taste Of Odisha</title></head>
<body style="margin:0;padding:0;background:#f8f5f0;font-family:Georgia,serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f5f0;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        
        <!-- Header -->
        <tr><td style="background:#3d2c1e;padding:32px 40px;text-align:center">
          <p style="margin:0;color:#c9a96e;font-size:11px;letter-spacing:0.3em;text-transform:uppercase">Taste Of Odisha</p>
          <h1 style="margin:12px 0 0;color:#fff;font-size:28px;font-style:italic">Order Confirmed ✓</h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px">
          <p style="margin:0 0 8px;font-size:14px;color:#888;font-family:Arial,sans-serif">Order ID</p>
          <p style="margin:0 0 24px;font-size:18px;font-weight:bold;color:#3d2c1e;letter-spacing:0.05em">${order.orderId}</p>

          <p style="margin:0 0 24px;font-size:16px;color:#3d2c1e;font-family:Arial,sans-serif">
            Dear <strong>${order.customerName}</strong>,<br><br>
            Thank you for your order! We have received it and it is currently being prepared by our artisan collective.
          </p>

          <!-- Items table -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
            <thead>
              <tr style="background:#f8f5f0">
                <th style="padding:10px 8px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#888;font-family:Arial,sans-serif">Product</th>
                <th style="padding:10px 8px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#888;font-family:Arial,sans-serif">Qty</th>
                <th style="padding:10px 8px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#888;font-family:Arial,sans-serif">Amount</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>

          <!-- Totals -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px">
            <tr>
              <td style="font-size:14px;color:#888;font-family:Arial,sans-serif;padding:6px 0">Subtotal</td>
              <td style="font-size:14px;color:#3d2c1e;font-family:Arial,sans-serif;padding:6px 0;text-align:right">₹${(order.subtotal || order.total).toFixed(0)}</td>
            </tr>
            ${order.discount ? `
            <tr>
              <td style="font-size:14px;color:#25D366;font-family:Arial,sans-serif;padding:6px 0">Discount Applied</td>
              <td style="font-size:14px;color:#25D366;font-family:Arial,sans-serif;padding:6px 0;text-align:right">-₹${order.discount.toFixed(0)}</td>
            </tr>` : ''}
            <tr>
              <td style="font-size:14px;color:#888;font-family:Arial,sans-serif;padding:6px 0">Shipping</td>
              <td style="font-size:14px;color:#3d2c1e;font-family:Arial,sans-serif;padding:6px 0;text-align:right">${order.deliveryCharge ? `₹${order.deliveryCharge.toFixed(0)}` : 'FREE'}</td>
            </tr>
            <tr style="border-top:1px solid #f0ece4">
              <td style="font-size:16px;font-weight:bold;color:#3d2c1e;font-family:Arial,sans-serif;padding:12px 0 6px">Order Total</td>
              <td style="font-size:16px;font-weight:bold;color:#3d2c1e;font-family:Arial,sans-serif;padding:12px 0 6px;text-align:right">₹${order.total.toFixed(0)}</td>
            </tr>
            ${isCod && order.advancePaid ? `
            <tr>
              <td style="font-size:14px;color:#c9a96e;font-family:Arial,sans-serif;padding:4px 0">Advance Paid (Online)</td>
              <td style="font-size:14px;color:#c9a96e;font-family:Arial,sans-serif;padding:4px 0;text-align:right">₹${order.advancePaid.toFixed(0)}</td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#888;font-family:Arial,sans-serif;padding:4px 0">Balance Due (Cash on Delivery)</td>
              <td style="font-size:14px;color:#3d2c1e;font-family:Arial,sans-serif;padding:4px 0;text-align:right">₹${(order.balanceDue ?? 0).toFixed(0)}</td>
            </tr>` : ''}
          </table>

          <!-- Shipping address -->
          <div style="background:#f8f5f0;border-radius:8px;padding:20px;margin-bottom:32px">
            <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#888;font-family:Arial,sans-serif">Delivering To</p>
            <p style="margin:0;font-size:14px;color:#3d2c1e;font-family:Arial,sans-serif;line-height:1.7">
              ${order.shippingAddress.addressLine1}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} – ${order.shippingAddress.pincode}
            </p>
          </div>

          <p style="margin:0;font-size:13px;color:#888;font-family:Arial,sans-serif;line-height:1.7">
            Your order will be dispatched within <strong>48 hours</strong> and you'll receive tracking information via SMS/Email shortly.
            For any queries, reach us at <a href="mailto:tasteofodisha1996@gmail.com" style="color:#c9a96e">tasteofodisha1996@gmail.com</a>.
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f8f5f0;padding:24px 40px;text-align:center">
          <p style="margin:0;font-size:11px;color:#bbb;font-family:Arial,sans-serif;letter-spacing:0.1em">© 2024 Taste Of Odisha International · Authentic Flavours of Odisha</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendOrderConfirmationEmail(order: OrderNotificationPayload): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.warn('[Notifications] GMAIL_USER or GMAIL_APP_PASSWORD not set — skipping email.');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    // Send to customer ONLY if they provided an email address
    if (order.customerEmail && order.customerEmail.includes('@')) {
      await transporter.sendMail({
        from: `"Taste Of Odisha" <${user}>`,
        to: order.customerEmail,
        subject: `Order Confirmed – ${order.orderId} | Taste Of Odisha`,
        html: buildEmailHtml(order),
      });
    }

    // Always send admin copy to tasteofodisha1996@gmail.com
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || user;
    const isCod = order.paymentMethod === 'cod';
    await transporter.sendMail({
      from: `"Taste Of Odisha Orders" <${user}>`,
      to: adminEmail,
      subject: `[NEW ORDER] ${order.orderId} – ₹${order.total} – ${isCod ? 'COD' : 'Online'}`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Order ID:</strong> ${order.orderId}</p>
        <p><strong>Customer:</strong> ${order.customerName} | ${order.customerEmail || 'No email provided'} | ${order.customerPhone}</p>
        <p><strong>Total:</strong> ₹${order.total} (${isCod ? `COD – Advance ₹${order.advancePaid}, Balance ₹${order.balanceDue}` : 'Fully Paid Online'})</p>
        <p><strong>Address:</strong> ${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.state} – ${order.shippingAddress.pincode}</p>
        <h3>Items:</h3>
        <ul>${order.items.map(i => `<li>${i.name} × ${i.quantity} – ₹${(i.price * i.quantity).toFixed(0)}</li>`).join('')}</ul>
      `,
    });

    console.log(`[Notifications] Email sent for order ${order.orderId}`);
  } catch (err) {
    console.error('[Notifications] Email send failed:', err);
  }
}

// ─────────────────────────────────────────────
// WHATSAPP — Twilio WhatsApp API
// ─────────────────────────────────────────────
export async function sendOrderWhatsApp(order: OrderNotificationPayload): Promise<void> {
  // Bypassed in favor of Option 1 (100% Free Client-side Click-to-Chat Button on the Order Confirmation page)
  console.log(`[Notifications] Free client-side WhatsApp link generated for order ${order.orderId}`);
}
