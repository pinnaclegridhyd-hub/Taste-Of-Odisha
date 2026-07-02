const mongoose = require('mongoose');

async function run() {
  const uri = "mongodb+srv://admin:Taste%402026%23Mongo@tasteofodisha.kmshin3.mongodb.net/tasteofodisha?retryWrites=true&w=majority";
  await mongoose.connect(uri);
  console.log('Connected to DB');
  
  const ProductSchema = new mongoose.Schema({}, { strict: false });
  const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema, 'products');
  
  const p1 = await Product.findById('6a1c054c302ba0bd845b813f');
  const p2 = await Product.findById('6a1c054c302ba0bd845b8141');
  console.log('Product 1:', JSON.stringify(p1, null, 2));
  console.log('Product 2:', JSON.stringify(p2, null, 2));
  
  await mongoose.disconnect();
}

run().catch(console.error);
