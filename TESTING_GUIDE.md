# Testing Guide - Taste Of Odisha

Comprehensive testing guide for the Taste Of Odisha e-commerce platform.

## Prerequisites

- Node.js 18+
- Local MongoDB (or MongoDB Atlas connection)
- Razorpay account with test keys

## Setting Up Test Environment

### 1. Create .env.local with Test Keys

```env
MONGODB_URI=mongodb://localhost:27017/odisha-store-test
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxx
ADMIN_KEY=test-admin-key-12345
```

### 2. Start Local MongoDB (Optional)

If running MongoDB locally:

```bash
mongod
```

Or use MongoDB Atlas test connection string.

### 3. Start Development Server

```bash
pnpm dev
```

The app should start without errors. If there are missing env var errors, check .env.local.

## Manual Testing

### A. Product Management

#### A1. Create a Product

1. Go to `http://localhost:3000/admin/dashboard`
2. Enter admin key: `test-admin-key-12345`
3. Click "Products" → "Add Product"
4. Fill in details:
   - Name: "Odisha Wheat Puri"
   - Category: "food"
   - Price: 200
   - Stock: 50
   - Description: "Traditional wheat puri from Odisha region"
5. Click "Create Product"
6. Should see product added to list

#### A2. Verify Slug Generation

- Product slug should be auto-generated: "odisha-wheat-puri"
- Try creating another product with same name
- Second should get slug: "odisha-wheat-puri-1"

#### A3. Edit Product

1. Click "Edit" on a product
2. Change price or stock
3. Click "Update"
4. Verify changes reflected in listing

#### A4. Delete Product

1. Click "Delete" on a product
2. Confirm deletion
3. Product should be removed from list

### B. Shopping & Checkout

#### B1. Browse Products

1. Go to `http://localhost:3000/products`
2. Should see all products listed
3. Click on a product to see details
4. Verify images, price, description displayed

#### B2. Add to Cart

1. On product detail page, enter quantity
2. Click "Add to Cart"
3. Go to `/cart`
4. Verify product appears in cart
5. Try changing quantity
6. Verify total updates correctly

#### B3. Checkout Flow

1. From cart, click "Proceed to Checkout"
2. Fill in shipping details:
   - Name: "John Doe"
   - Phone: "9876543210"
   - Pincode: "110001"
   - City: "Delhi"
   - State: "Delhi"
   - Address: "123 Main St"
3. Click "Continue to Payment"
4. Review order summary
5. Click "Pay with Razorpay"

### C. Payment Testing

#### C1. Successful Payment

Using Razorpay test card:
- Card Number: `4111 1111 1111 1111`
- Expiry: Any future date (e.g., 12/25)
- CVV: `123`
- Name: Any name

1. Enter card details
2. Click "Pay"
3. On success page, verify:
   - Order ID displayed
   - Order status shows "processing"
   - Payment status shows "paid"

#### C2. Failed Payment

Using test card that fails:
- Card Number: `4000 0000 0000 0002`
- Follow same steps
- Should see error message
- Order should have paymentStatus: "failed"

#### C3. Test Stock Deduction

1. Create product with limited stock (e.g., 2 units)
2. Add 2 units to cart and complete payment
3. Go back to admin products
4. Verify stock is now 0
5. Try adding to cart again - should show "Insufficient stock"

#### C4. Test Duplicate Payment Prevention

1. Note the Razorpay Order ID from successful payment
2. Try to manually call `/api/verify-payment` with same data
3. Should return: "Order already processed"
4. Stock should NOT be deducted twice

### D. Admin Dashboard Testing

#### D1. Dashboard Metrics

1. Go to `/admin/dashboard`
2. Verify displayed metrics:
   - Total Products
   - Total Orders
   - Total Revenue
   - Pending Orders

#### D2. Order Management

1. Go to `/admin/orders`
2. Should see orders created during testing
3. Click on order to expand details
4. Verify all order info displayed:
   - Order ID, customer phone, total amount
   - Payment status (paid/failed/pending)
   - Shipping address
   - Items list
   - Timestamps

#### D3. Update Order Status

1. Select an order with payment status "paid"
2. Use dropdown to change status:
   - pending → processing
   - processing → shipped
   - shipped → delivered
3. Verify status updates in real-time
4. Refresh page and verify change persists

### E. Rate Limiting Testing

#### E1. Create-Order Rate Limit

1. Open browser console
2. Run this script:
```javascript
for (let i = 0; i < 15; i++) {
  fetch('/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ productId: 'test', quantity: 1 }],
      shippingInfo: { name: 'test', mobile: '9876543210', pincode: '110001', city: 'Delhi', state: 'Delhi', addressLine: '123' },
      phoneNumber: '9876543210'
    })
  }).then(r => r.json()).then(d => console.log(`Req ${i}:`, d));
  
  // Wait 100ms between requests
  await new Promise(r => setTimeout(r, 100));
}
```

3. After 10 requests, should see 429 error: "Too many requests"

#### E2. Verify Rate Limit Resets

1. Wait 60 seconds
2. Can make 10 more requests

### F. Error Handling Testing

#### F1. Missing Required Fields

1. Try POST `/api/create-order` with missing phoneNumber:
```json
{
  "items": [{ "productId": "test", "quantity": 1 }],
  "shippingInfo": { "name": "test" }
}
```

2. Should get error: "Missing shipping information"

#### F2. Invalid Product

1. Try creating order with non-existent productId
2. Should get error: "Product not found"

#### F3. Insufficient Stock

1. Create product with 5 units
2. Try ordering 10 units
3. Should get error: "Insufficient stock. Only 5 available."

#### F4. Invalid Admin Key

1. Go to `/admin/dashboard`
2. Enter wrong key
3. Should see error or redirect
4. Refresh page - should prompt for key again

### G. Environment Variable Validation

#### G1. Missing ENV Variables

1. Remove a required env var from .env.local (e.g., MONGODB_URI)
2. Restart dev server
3. Should see console error: "Missing required environment variables"
4. Server should not start properly

#### G2. Restore Variables

1. Re-add the env var
2. Restart server
3. Should start successfully

## Automated Testing (Optional)

### Jest Unit Tests

Create `/tests/unit/pricing.test.ts`:

```typescript
import { getEffectivePrice, getDeliveryCharge } from '@/lib/helpers';

describe('Pricing Functions', () => {
  describe('getEffectivePrice', () => {
    it('should return base price with no discount', () => {
      const price = getEffectivePrice(100);
      expect(price).toBe(100);
    });

    it('should apply percentage discount', () => {
      const price = getEffectivePrice(100, {
        type: 'percentage',
        value: 10,
      });
      expect(price).toBe(90);
    });

    it('should apply fixed discount', () => {
      const price = getEffectivePrice(100, {
        type: 'fixed',
        value: 20,
      });
      expect(price).toBe(80);
    });
  });

  describe('getDeliveryCharge', () => {
    it('should be free for order >= 499', () => {
      const charge = getDeliveryCharge(500);
      expect(charge).toBe(0);
    });

    it('should charge 60 for order < 499', () => {
      const charge = getDeliveryCharge(400);
      expect(charge).toBe(60);
    });
  });
});
```

Run tests:
```bash
pnpm test
```

## Performance Testing

### Load Testing Products

1. Create many products via admin:
```bash
for i in {1..100}; do
  # Create product via API
done
```

2. Go to `/products` page
3. Verify page loads in < 2 seconds
4. Check Vercel Analytics for performance

### Database Query Performance

1. Go to MongoDB Atlas dashboard
2. Check query performance in Analytics
3. Verify indexes are being used (look for `COLLSCAN` warnings)

## Security Testing

### A. XSS Prevention

1. Try creating product with XSS payload in name:
```
<img src=x onerror=alert('XSS')>
```

2. Verify it's sanitized (not executed as script)

### B. SQL Injection (NoSQL)

1. Try MongoDB injection in product search:
```
{"$ne": null}
```

2. Should not execute as query operator (only matches literal string)

### C. Price Validation

1. Modify cart item price in browser console:
```javascript
localStorage.setItem('cart', JSON.stringify([{
  productId: 'abc123',
  quantity: 1,
  price: 1  // Try to change price to 1
}]));
```

2. Complete checkout
3. Backend should recalculate from DB
4. Verify actual product price used (not 1)

## Webhook Testing

### Using Razorpay Dashboard

1. Go to Razorpay Dashboard → Webhooks
2. Find your webhook
3. Click "Test" → Select an event
4. Send test webhook
5. Check Vercel logs for webhook processing
6. Verify order status updated

### Using ngrok (Local Testing)

```bash
ngrok http 3000
```

Get public URL, add to Razorpay webhook settings as:
```
https://xxx.ngrok.io/api/razorpay-webhook
```

Trigger webhook from Razorpay dashboard and verify processing.

## Checklist

Before going to production:

- [ ] All products can be created, read, updated, deleted
- [ ] Cart calculations are accurate
- [ ] Checkout flow works end-to-end
- [ ] Successful payments update order and deduct stock
- [ ] Failed payments don't deduct stock
- [ ] Duplicate payments are prevented
- [ ] Rate limiting works
- [ ] Admin authentication works
- [ ] Error messages are user-friendly
- [ ] Stock validation prevents overselling
- [ ] Order status updates propagate correctly
- [ ] Webhook receives and processes events
- [ ] Environment variables validated on startup
- [ ] No XSS or injection vulnerabilities
- [ ] Prices not manipulated from frontend
- [ ] All timestamps are correct (UTC)
- [ ] Mobile responsive on all pages
- [ ] Page load times < 3 seconds

## Troubleshooting Test Issues

### "Cannot connect to MongoDB"
- Verify MONGODB_URI in .env.local
- Check MongoDB is running
- If using Atlas, verify IP whitelist

### "Razorpay order creation fails"
- Check test keys are correct
- Verify internet connection
- Check Razorpay account is active

### "Admin key not working"
- Clear browser localStorage: `localStorage.clear()`
- Verify ADMIN_KEY in .env.local
- Restart server

### "Rate limit errors too early"
- Check test isn't sending duplicate requests
- Verify 60-second window limit (10 req/min)
- Wait before retesting

### "Stock not deducting"
- Verify payment status changed to "paid"
- Check MongoDB documents directly
- Look at Vercel logs for errors
