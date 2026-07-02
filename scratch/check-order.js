const mongoose = require('mongoose');

async function run() {
  const uri = "mongodb+srv://admin:Taste%402026%23Mongo@tasteofodisha.kmshin3.mongodb.net/tasteofodisha?retryWrites=true&w=majority";
  await mongoose.connect(uri);
  console.log('Connected to DB');
  
  const OrderSchema = new mongoose.Schema({}, { strict: false });
  const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema, 'orders');
  
  const order = await Order.findOne({ orderId: 'ODISHAY0IHT972254' });
  console.log('Order Details:', JSON.stringify(order, null, 2));
  
  await mongoose.disconnect();
}

run().catch(console.error);
