const { MongoClient } = require('mongodb');
const fs = require('fs');

// Read env from .env.local
const envFile = fs.readFileSync('.env.local', 'utf-8');
const mongoLine = envFile.split('\n').find(l => l.startsWith('MONGODB_URI'));
const uri = mongoLine.split('=').slice(1).join('=').trim();

async function fix() {
  const client = await MongoClient.connect(uri);
  const db = client.db();
  
  // Fix the broken image path for Roasted Makhana
  const result = await db.collection('products').updateOne(
    { slug: 'roasted-makhana' },
    { $set: { images: ['/makhana_unique.png'] } }
  );
  
  console.log('Roasted Makhana image fix - modified:', result.modifiedCount);
  
  // Also verify all other products have valid image paths
  const products = await db.collection('products').find({}, { projection: { name: 1, images: 1, slug: 1 } }).toArray();
  console.log('\nAll product images after fix:');
  products.forEach(p => console.log(` - ${p.name}: ${JSON.stringify(p.images)}`));
  
  await client.close();
}

fix().catch(console.error);
