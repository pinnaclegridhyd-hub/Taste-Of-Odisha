const mongoose = require('mongoose');

async function run() {
  const uri = "mongodb+srv://admin:Taste%402026%23Mongo@tasteofodisha.kmshin3.mongodb.net/tasteofodisha?retryWrites=true&w=majority";
  await mongoose.connect(uri);
  console.log('Connected to DB');
  
  const ProductSchema = new mongoose.Schema({}, { strict: false });
  const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema, 'products');
  
  const products = await Product.find({ 'variants.0': { $exists: true } }).limit(5);
  for (const p of products) {
    console.log(`Product: ${p.name} (${p._id})`);
    console.log('Variants:', p.variants.map(v => `${v.name} - ₹${v.price} (Stock: ${v.stockQuantity})`));
  }
  
  await mongoose.disconnect();
}

run().catch(console.error);
