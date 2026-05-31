# API Documentation

## Product Endpoints

### GET /api/products
Fetch all products with optional filtering

**Query Parameters:**
- `category` (optional): Filter by category (Food, Clothing, Craft, Festive)
- `search` (optional): Search product name
- `skip` (optional): Pagination skip (default: 0)
- `limit` (optional): Pagination limit (default: 20)

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "_id": "123",
      "productId": "P001",
      "name": "Odisha Painting",
      "slug": "odisha-painting",
      "category": "Craft",
      "price": 99900,
      "discountPercentage": 10,
      "finalPrice": 89910,
      "stock": 50,
      "images": ["url1", "url2"],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100
}
```

### GET /api/products/[slug]
Fetch single product by slug

**Response:**
```json
{
  "success": true,
  "product": {
    "_id": "123",
    "productId": "P001",
    "name": "Odisha Painting",
    "slug": "odisha-painting",
    "category": "Craft",
    "description": "...",
    "price": 99900,
    "discountPercentage": 10,
    "finalPrice": 89910,
    "stock": 50,
    "images": ["url1", "url2"],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### POST /api/products (Admin Only)
Create new product

**Headers:**
```
X-Admin-Key: your-admin-key
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": "P001",
  "name": "Odisha Painting",
  "slug": "odisha-painting",
  "category": "Craft",
  "description": "Beautiful handmade Odisha painting",
  "price": 99900,
  "discountPercentage": 10,
  "stock": 50,
  "images": ["url1", "url2"]
}
```

**Response:**
```json
{
  "success": true,
  "product": { ... }
}
```

### PATCH /api/products/[slug] (Admin Only)
Update product

**Headers:**
```
X-Admin-Key: your-admin-key
```

**Request Body:**
```json
{
  "price": 89900,
  "stock": 45,
  "discountPercentage": 15
}
```

**Response:**
```json
{
  "success": true,
  "product": { ... }
}
```

### DELETE /api/products/[slug] (Admin Only)
Delete product

**Headers:**
```
X-Admin-Key: your-admin-key
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Order & Payment Endpoints

### POST /api/create-order
Create Razorpay order and order record

**Rate Limit:** 10 requests/minute per IP

**Request Body:**
```json
{
  "items": [
    {
      "productId": "P001",
      "quantity": 2,
      "priceAtPurchase": 99900
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "address": "123 Main St",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110001"
  },
  "customerId": "CUST001"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "ORD-2024-001",
  "razorpayOrderId": "order_abc123",
  "totalAmount": 189820,
  "shippingCharge": 100,
  "discountAmount": 19980
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Insufficient stock for product P001"
}
```

### POST /api/verify-payment
Verify Razorpay payment signature

**Rate Limit:** 10 requests/minute per IP

**Request Body:**
```json
{
  "orderId": "ORD-2024-001",
  "razorpayOrderId": "order_abc123",
  "razorpayPaymentId": "pay_abc123",
  "razorpaySignature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "orderId": "ORD-2024-001",
  "status": "confirmed"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid payment signature"
}
```

### POST /api/razorpay-webhook
Webhook endpoint for Razorpay events

**Rate Limit:** 50 requests/minute per IP

**Headers:**
```
X-Razorpay-Signature: signature
Content-Type: application/json
```

**Request Body:**
```json
{
  "event": "payment.authorized",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_abc123",
        "order_id": "order_abc123",
        "status": "captured",
        "amount": 189820
      }
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Webhook processed"
}
```

---

## Admin Order Endpoints

### GET /api/admin/orders
Fetch orders (with filtering)

**Headers:**
```
X-Admin-Key: your-admin-key
```

**Query Parameters:**
- `status` (optional): Filter by order status
- `skip` (optional): Pagination skip
- `limit` (optional): Pagination limit

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "123",
      "orderId": "ORD-2024-001",
      "customerId": "CUST001",
      "items": [...],
      "totalAmount": 189820,
      "orderStatus": "Confirmed",
      "paymentInfo": {
        "status": "confirmed",
        "razorpayPaymentId": "pay_abc123"
      },
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 50
}
```

### PATCH /api/admin/orders
Update order status

**Headers:**
```
X-Admin-Key: your-admin-key
```

**Request Body:**
```json
{
  "orderId": "ORD-2024-001",
  "status": "Shipped"
}
```

**Response:**
```json
{
  "success": true,
  "order": { ... }
}
```

---

## Admin Product Endpoints

### POST /api/admin/products
Admin product operations (same as public endpoints but with auth)

**Headers:**
```
X-Admin-Key: your-admin-key
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad request / validation error |
| 401 | Unauthorized / invalid admin key |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Server error |

---

## Rate Limiting

```
Order Creation: 10 requests/minute per IP
Payment Verification: 10 requests/minute per IP
Webhook: 50 requests/minute per IP
```

When rate limit is exceeded, response:
```json
{
  "error": "Rate limit exceeded"
}
```

---

## Authentication

Admin endpoints require the `X-Admin-Key` header:
```
X-Admin-Key: your-strong-admin-key
```

The key should be kept secret and stored securely in environment variables.

---

## Data Types

### Price
All prices are in **paise** (1 rupee = 100 paise)
- `price: 99900` = ₹999.00
- `price: 50` = ₹0.50

### Categories
- Food
- Clothing
- Craft
- Festive

### Order Status
- Pending
- Confirmed
- Shipped
- Delivered
- Cancelled

### Payment Status
- pending
- confirmed
- failed
- refunded

---

## Example: Complete Order Flow

### 1. Create Order
```bash
POST /api/create-order
{
  "items": [{
    "productId": "P001",
    "quantity": 1,
    "priceAtPurchase": 99900
  }],
  "shippingAddress": { ... },
  "customerId": "CUST001"
}
```

Response:
```json
{
  "orderId": "ORD-2024-001",
  "razorpayOrderId": "order_abc123",
  "totalAmount": 100000
}
```

### 2. Initialize Razorpay
```javascript
const options = {
  key: 'RAZORPAY_KEY_ID',
  amount: 100000,
  order_id: 'order_abc123',
  handler: function(response) {
    // Verify payment
  }
};
```

### 3. Verify Payment
```bash
POST /api/verify-payment
{
  "orderId": "ORD-2024-001",
  "razorpayOrderId": "order_abc123",
  "razorpayPaymentId": "pay_abc123",
  "razorpaySignature": "signature..."
}
```

Response:
```json
{
  "success": true,
  "status": "confirmed"
}
```

### 4. Webhook Confirmation (Backup)
Razorpay sends webhook to `/api/razorpay-webhook` with payment details.

---

## Best Practices

1. **Always verify signatures** - Never trust payment status without signature verification
2. **Use Idempotency** - Prevent duplicate orders with Razorpay order ID tracking
3. **Validate prices** - Always recalculate prices on backend
4. **Check stock** - Validate stock availability before order creation
5. **Log everything** - Maintain audit trail for payments
6. **Handle webhooks** - Implement webhook handler as backup
7. **Rate limit** - Protect endpoints with rate limiting
8. **Use HTTPS** - Always use HTTPS in production
9. **Secure keys** - Store API keys in environment variables
10. **Error handling** - Provide clear error messages to users
