import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
  try {
    const { connection } = await connectDB();
    
    // Use direct collection access to bypass problematic Mongoose middlewares
    const collection = connection.db.collection('products');
    
    const result = await collection.updateMany(
      {},
      { $set: { stockQuantity: 500, inStock: true, updatedAt: new Date() } }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Heritage stock replenished via Direct Access.',
      details: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      }
    });
  } catch (err: any) {
    console.error('Replenishment API Error:', err);
    return NextResponse.json({ 
      success: false, 
      error: err.message
    }, { status: 500 });
  }
}
