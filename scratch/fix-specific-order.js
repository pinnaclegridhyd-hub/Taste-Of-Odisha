const mongoose = require('mongoose');

async function run() {
  const uri = "mongodb+srv://admin:Taste%402026%23Mongo@tasteofodisha.kmshin3.mongodb.net/tasteofodisha?retryWrites=true&w=majority";
  await mongoose.connect(uri);
  console.log('Connected to DB');
  
  const ProductSchema = new mongoose.Schema({}, { strict: false });
  const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema, 'products');
  
  const OrderSchema = new mongoose.Schema({}, { strict: false });
  const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema, 'orders');
  
  const order = await Order.findOne({ orderId: 'ODISHAY0IHT972254' });
  if (!order) {
    console.log('Order not found!');
    await mongoose.disconnect();
    return;
  }
  
  console.log('Original Order:', order.orderId);
  
  let subtotal = 0;
  const updatedItems = [];
  
  for (const item of order.items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      console.error(`Product ${item.productId} not found`);
      continue;
    }
    
    let basePrice = product.price;
    let effectivePrice = basePrice;
    effectivePrice = Math.round(effectivePrice * 100) / 100;
    
    updatedItems.push({
      productId: item.productId,
      name: item.name,
      variantName: item.variantName || null,
      price: effectivePrice,
      quantity: item.quantity || 1
    });
    
    subtotal += effectivePrice * (item.quantity || 1);
  }
  
  let discountAmount = 0;
  if (order.couponCode === 'ODISHA10') {
    discountAmount = Math.round(subtotal * 0.1 * 100) / 100;
  }
  
  const deliveryCharge = subtotal - discountAmount >= 499 ? 0 : 60;
  const total = Math.round((subtotal - discountAmount + deliveryCharge) * 100) / 100;
  
  console.log('New stats:', { subtotal, discountAmount, deliveryCharge, total });
  
  await Order.updateOne({ _id: order._id }, {
    $set: {
      items: updatedItems,
      subtotal: subtotal,
      discount: discountAmount,
      deliveryCharge: deliveryCharge,
      total: total,
      advancePaid: total,
      balanceDue: 0
    }
  });
  
  console.log('Updated successfully!');
  await mongoose.disconnect();
}

run().catch(console.error);
