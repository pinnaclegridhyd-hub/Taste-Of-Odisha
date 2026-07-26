const mongoose = require('mongoose');

async function run() {
  const uri = "mongodb+srv://admin:Taste%402026%23Mongo@tasteofodisha.kmshin3.mongodb.net/tasteofodisha?retryWrites=true&w=majority";
  await mongoose.connect(uri);
  console.log('Connected to DB');
  
  const OrderSchema = new mongoose.Schema({}, { strict: false });
  const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema, 'orders');
  
  const testOrderId = 'TEST-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  
  const mockOrder = {
    orderId: testOrderId,
    phoneNumber: '9999999999',
    items: [
      {
        productId: '6a4550943b5430623500dde9',
        name: 'Hakka Noodles',
        variantName: '500gm',
        price: 185,
        quantity: 2
      },
      {
        productId: '6a4550943b5430623500de2e',
        name: 'Karam Gavvalu (kaudi)',
        variantName: '100gm',
        price: 49,
        quantity: 3
      },
      {
        productId: '6a4550943b5430623500ddfc',
        name: 'Peanut Badam',
        variantName: '500gm',
        price: 149,
        quantity: 1
      }
    ],
    total: 666,
    deliveryCharge: 0,
    status: 'processing',
    paymentStatus: 'fully_paid',
    paymentMethod: 'online',
    advancePaid: 666,
    balanceDue: 0,
    razorpayOrderId: 'rzp_test_' + Math.random().toString(36).substring(2, 9),
    shippingAddress: {
      name: 'Test Customer',
      email: 'test@example.com',
      mobile: '9999999999',
      pincode: '751001',
      city: 'Bhubaneswar',
      state: 'Odisha',
      addressLine: '123 Heritage Lane'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await Order.create(mockOrder);
  console.log('Created test order with ID:', testOrderId);
  
  await mongoose.disconnect();
}

run().catch(console.error);
