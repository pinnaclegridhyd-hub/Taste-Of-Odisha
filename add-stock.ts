import mongoose from 'mongoose';
import Product from './models/Product';
import { connectDB } from './lib/db';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function addStock() {
  try {
    console.log('Connecting to heritage database...');
    await connectDB();
    
    const slug = 'odisha-thekua';
    console.log(`Replenishing stock for: ${slug}`);
    
    const product = await Product.findOneAndUpdate(
      { slug },
      { 
        stockQuantity: 500, 
        inStock: true 
      },
      { new: true }
    );
    
    if (product) {
      console.log('Stock Manifest Updated Successfully:');
      console.log(`- Product: ${product.name}`);
      console.log(`- New Quantity: ${product.stockQuantity}`);
      console.log(`- Status: ${product.inStock ? 'In Stock' : 'Out of Stock'}`);
    } else {
      console.error('Heritage error: Product not found in database.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Failed to update stock:', err);
    process.exit(1);
  }
}

addStock();
