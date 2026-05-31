# Quick Start Guide - Taste Of Odisha

Get the e-commerce platform running in 5 minutes.

## 1. Clone & Setup (2 minutes)

```bash
# Clone the repository
git clone https://github.com/yourusername/odisha-heritage.git
cd odisha-heritage

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local
```

## 2. Configure Environment (2 minutes)

Edit `.env.local` and add your values:

```env
# MongoDB connection (get from MongoDB Atlas)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/odisha-store

# Razorpay test keys (get from https://dashboard.razorpay.com/app/keys)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Admin password (any strong string)
ADMIN_KEY=my-super-secret-key
```

## 3. Start Development Server (30 seconds)

```bash
pnpm dev
```

The app will start at `http://localhost:3000`

**If you get environment variable errors**: Double-check all 4 variables are in `.env.local`

## 4. Test the App (1 minute)

### Customer Flow
1. Visit `http://localhost:3000`
2. Click on a product (sample data can be added manually)
3. Add to cart
4. Go to checkout
5. Fill in shipping details
6. Make a test payment with card: `4111 1111 1111 1111`, CVV: `123`, Expiry: any future date

### Admin Flow
1. Visit `http://localhost:3000/admin/dashboard`
2. Enter admin key: the value from `ADMIN_KEY` in `.env.local`
3. Create a product
4. View orders
5. Update order statuses

## Quick Reference

| URL | Purpose |
|-----|---------|
| `/` | Home page |
| `/products` | Browse products |
| `/products/[slug]` | Product details |
| `/cart` | Shopping cart |
| `/checkout` | Checkout |
| `/admin/dashboard` | Admin dashboard |
| `/admin/products` | Manage products |
| `/admin/products/create` | Create product |
| `/admin/orders` | Manage orders |

## Common Issues & Solutions

### "Missing required environment variables: MONGODB_URI, ..."

**Solution**: Edit `.env.local` and add all 4 required variables.

### "Cannot connect to MongoDB"

**Solutions**:
1. Check MONGODB_URI is correct
2. If using MongoDB Atlas, add `0.0.0.0/0` to Network Access
3. Verify cluster is running
4. Test connection string locally

### "Razorpay order creation failed"

**Solutions**:
1. Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are correct
2. Make sure you're using TEST keys (rzp_test_)
3. Check internet connection

### "Admin key not working"

**Solutions**:
1. Clear browser storage: Open DevTools → Application → Local Storage → Clear All
2. Make sure ADMIN_KEY in `.env.local` matches what you entered
3. Restart dev server

### "Can't add products in admin"

**Solutions**:
1. Verify you're logged in (localStorage shows adminKey)
2. Check MongoDB is connected (check console for connection errors)
3. Check browser console for errors
4. Review terminal for API errors

## Setup MongoDB Atlas (if using cloud)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create account and new project
3. Create free cluster (M0 tier)
4. Create database user (remember password)
5. Get connection string (Database → Connect → Drivers)
6. Add IP `0.0.0.0/0` to Network Access
7. Replace in MONGODB_URI:
   - `<password>` with your password
   - `odisha-store` is your database name

## Setup Razorpay (if using production)

1. Go to [razorpay.com](https://razorpay.com)
2. Sign up as business
3. Complete KYC verification
4. Go to Dashboard → Settings → API Keys
5. Copy Live keys (not Test keys)
6. Add to RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET

## Deploy to Vercel

1. Push code to GitHub
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com)
3. Import GitHub repository
4. Add environment variables in project settings
5. Click Deploy

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## Next Steps

1. **Create sample products** via admin dashboard
2. **Test payment flow** with test card
3. **Review** `TESTING_GUIDE.md` for comprehensive testing
4. **Read** `FINAL_FIXES.md` to understand security features
5. **Deploy** to Vercel when ready

## File Structure

```
odisha-heritage/
├── .env.local              # Environment variables (CREATE THIS)
├── .env.example            # Template (copy to .env.local)
├── README.md               # Full documentation
├── QUICKSTART.md           # This file
├── DEPLOYMENT_GUIDE.md     # Vercel deployment steps
├── TESTING_GUIDE.md        # Testing procedures
├── FINAL_FIXES.md          # Security features explained
├── app/
│   ├── page.tsx            # Home page
│   ├── products/           # Product pages
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow
│   ├── admin/              # Admin dashboard
│   └── api/                # API routes
├── models/
│   ├── Product.ts          # Product schema
│   ├── Order.ts            # Order schema
│   └── Address.ts          # Address schema
├── lib/
│   ├── db.ts               # Database connection
│   ├── razorpay.ts         # Payment integration
│   ├── pricing.ts          # Price calculations
│   ├── helpers.ts          # Utility functions
│   ├── middleware.ts       # Rate limiting
│   ├── analytics.ts        # Logging
│   └── types.ts            # TypeScript types
└── components/             # React components
```

## Getting Help

1. Check console errors: `pnpm dev` terminal and browser DevTools
2. Review logs in MongoDB Atlas dashboard
3. Check Razorpay test webhook delivery in dashboard
4. Read the `README.md` for complete documentation
5. Review `TESTING_GUIDE.md` if functionality isn't working

## Made With ❤️

Built with:
- **Next.js 15** - React framework
- **Tailwind CSS** - Styling
- **MongoDB** - Database
- **Razorpay** - Payments
- **Vercel** - Hosting

Happy selling! 🎉
