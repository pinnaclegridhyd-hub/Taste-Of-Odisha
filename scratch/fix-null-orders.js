const mongoose = require('mongoose');

async function run() {
  const uri = "mongodb+srv://admin:Taste%402026%23Mongo@tasteofodisha.kmshin3.mongodb.net/tasteofodisha?retryWrites=true&w=majority";
  await mongoose.connect(uri);
  console.log('Connected to DB');
  
  const ProductSchema = new mongoose.Schema({}, { strict: false });
  const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema, 'products');
  
  const OrderSchema = new mongoose.Schema({}, { strict: false });
  const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema, 'orders');
  
  const allOrders = await Order.find({});
  const orders = allOrders.filter(order => {
    const hasNullTotal = order.total === null || order.total === undefined;
    const hasNullItemPrice = order.items && order.items.some(item => item.price === null || item.price === undefined);
    return hasNullTotal || hasNullItemPrice;
  });
  
  console.log(`Found ${orders.length} orders to repair.`);
  
  for (const order of orders) {
    let subtotal = 0;
    const updatedItems = [];
    
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        console.error(`Product ${item.productId} not found for order ${order.orderId}`);
        continue;
      }
      
      let basePrice = product.price;
      if (item.variantName && product.variants) {
        const variant = product.variants.find(v => v.name === item.variantName);
        if (variant) basePrice = variant.price;
      }
      
      // Calculate effective price manually
      let effectivePrice = basePrice;
      const discount = product.discount;
      if (discount && discount.value !== undefined && discount.value !== null && discount.type) {
        const now = new Date();
        const startValid = !discount.startDate || now >= discount.startDate;
        const endValid = !discount.endDate || now <= discount.endDate;
        if (startValid && endValid) {
          if (discount.type === 'percentage') {
            effectivePrice = basePrice - (basePrice * (discount.value / 100));
          } else {
            effectivePrice = Math.max(0, basePrice - discount.value);
          }
        }
      }
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
    
    // Apply coupon if any (ODISHA10 = 10%)
    let discountAmount = 0;
    if (order.couponCode === 'ODISHA10') {
      discountAmount = Math.round(subtotal * 0.1 * 100) / 100;
    }
    
    const deliveryCharge = subtotal - discountAmount >= 499 ? 0 : 60;
    const total = Math.round((subtotal - discountAmount + deliveryCharge) * 100) / 100;
    
    order.items = updatedItems;
    order.subtotal = subtotal;
    order.discount = discountAmount;
    order.deliveryCharge = deliveryCharge;
    order.total = total;
    
    if (order.paymentMethod === 'cod') {
      order.advancePaid = 150;
      order.balanceDue = total - 150;
    } else {
      order.advancePaid = total;
      order.balanceDue = 0;
    }
    
    await Order.updateOne({ _id: order._id }, {
      $set: {
        items: order.items,
        subtotal: order.subtotal,
        discount: order.discount,
        deliveryCharge: order.deliveryCharge,
        total: order.total,
        advancePaid: order.advancePaid,
        balanceDue: order.balanceDue
      }
    });
    
    console.log(`Repaired order ${order.orderId}: subtotal=${subtotal}, discount=${discountAmount}, deliveryCharge=${deliveryCharge}, total=${total}`);
  }
  
  await mongoose.disconnect();
}

run().catch(console.error);
