# Taste Of Odisha E-Commerce Platform

A full-stack e-commerce platform for authentic Odisha heritage products including food, clothing, handicrafts, and festival packs.

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + Tailwind CSS + React 19
- **Backend**: Next.js API Routes (Node.js)
- **Database**: MongoDB with Mongoose
- **Payment**: Razorpay (India-friendly)
- **Hosting**: Vercel

## Features

### Customer Features
- Browse products by category (food, clothing, craft, festive)
- Shopping cart with real-time calculations
- Multi-step checkout with address validation
- Razorpay payment gateway integration
- Order confirmation and tracking

### Admin Features
- Product management (CRUD operations)
- Product categorization and inventory
- Order management with status tracking
- Admin dashboard with analytics

### Technical Features
- Stock safety (prevents overselling)
- Backend price validation
- Duplicate payment prevention
- Rate limiting on payment endpoints
- Razorpay webhook support
- Database indexing for performance
- Automatic timestamps on all documents

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/pnpm
- MongoDB Atlas account
- Razorpay business account

### 1. Environment Setup

```bash
cp .env.example .env.local
```

Fill in the values:
```env
MONGODB_URI=mongodb+srv://...
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
ADMIN_KEY=your-secret-key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=google-site-verification-token
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Admin Access

Go to `/admin/dashboard` and enter your `ADMIN_KEY`

## Deployment to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in project settings
4. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` for Google Analytics and `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` for Search Console verification
5. Deploy

## API Endpoints

### Public
- `GET /api/products` - List products
- `GET /api/products/[slug]` - Get product
- `POST /api/create-order` - Create order
- `POST /api/verify-payment` - Verify payment

### Admin (require ADMIN_KEY)
- `GET /api/admin/products` - List products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products` - Update product
- `DELETE /api/admin/products/[slug]` - Delete product
- `GET /api/admin/orders` - List orders
- `PUT /api/admin/orders` - Update order status

### Webhook
- `POST /api/razorpay-webhook` - Razorpay webhook

## Security

- Environment variable validation at startup
- Backend price recalculation (never trust frontend)
- Pre-payment stock validation
- Post-payment stock deduction
- Duplicate payment prevention (idempotency)
- Rate limiting (10 req/min on payment, 50 req/min on webhooks)
- Admin key authentication
- Webhook signature verification
- MongoDB indexes for performance

## Database Schema

**Product**
- name, slug (unique), category, price, discount, images, inStock, stockQuantity, origin, artisanName, description, createdAt, updatedAt

**Order**
- orderId (unique), phoneNumber, items[], total, deliveryCharge, status, paymentStatus, razorpayOrderId (indexed), razorpayPaymentId, shippingAddress, createdAt, updatedAt

## Payment Flow

1. Customer adds items to cart
2. Checkout collects shipping info
3. POST /api/create-order validates stock and creates Razorpay order
4. Customer enters payment details
5. POST /api/verify-payment confirms payment and deducts stock
6. Webhook /api/razorpay-webhook acts as backup if step 5 fails

## Testing

Use Razorpay test credentials:
- Card: 4111 1111 1111 1111
- CVV: 123
- Date: Any future date

Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to test keys from Razorpay dashboard.

## Common Issues

**Missing environment variables**: Copy .env.example to .env.local and fill values

**MongoDB connection failed**: Check MONGODB_URI and IP whitelist in MongoDB Atlas

**Razorpay order creation failed**: Verify API keys match your account

**Admin access denied**: Check ADMIN_KEY in .env.local matches the key you entered
