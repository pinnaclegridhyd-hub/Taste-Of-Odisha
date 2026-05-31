const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in .env.local');
  process.exit(1);
}

// Minimal Schema
const ProductSchema = new mongoose.Schema({
  slug: String,
  stockQuantity: Number,
  inStock: Boolean
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function replenish() {
  try {
    console.log('Connecting to sanctuary...');
    await mongoose.connect(MONGODB_URI);
    
    const slug = 'odisha-thekua';
    console.log(`Adding 500 units to ${slug}...`);
    
    const result = await Product.updateOne(
      { slug },
      { $set: { stockQuantity: 500, inStock: true } }
    );
    
    if (result.matchedCount > 0) {
      console.log('Stock Manifest Updated Successfully.');
    } else {
      console.error('Legacy error: Product not found.');
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Replenishment failed:', err);
    process.exit(1);
  }
}

replenish();
