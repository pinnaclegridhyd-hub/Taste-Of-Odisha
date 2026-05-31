import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const ADMIN_KEY = process.env.ADMIN_KEY;

if (!MONGODB_URI || !RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET || !ADMIN_KEY) {
  const missing = [];
  if (!MONGODB_URI) missing.push('MONGODB_URI');
  if (!RAZORPAY_KEY_ID) missing.push('RAZORPAY_KEY_ID');
  if (!RAZORPAY_KEY_SECRET) missing.push('RAZORPAY_KEY_SECRET');
  if (!ADMIN_KEY) missing.push('ADMIN_KEY');
  
  const errorMsg = `[CRITICAL] Missing environment variables: ${missing.join(', ')}`;
  console.error(errorMsg);
  // Throw error to prevent startup or further execution
  throw new Error(`Please define the following environment variables inside .env.local: ${missing.join(', ')}`);
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

declare global {
  var mongoose: {
    conn: any;
    promise: any;
  };
}
