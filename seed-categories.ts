import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import mongoose from 'mongoose';
import Category from './models/Category';
import { connectDB } from './lib/db';

async function seedCategories() {
  try {
    console.log('Connecting to database...');
    await connectDB();

    const defaultCategories = [
      { name: 'Muruku', slug: 'muruku', description: 'Authentic crunchy snacks of Odisha.', order: 1, isDefault: true, image: '/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Masala%20murukku/WhatsApp%20Image%202026-05-29%20at%2012.31.56%20AM%20(1).jpeg' },
      { name: 'Sweets', slug: 'sweets', description: 'Traditional sweet delicacies.', order: 2, isDefault: true, image: '/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/ADISHA/WhatsApp%20Image%202026-05-31%20at%2012.32.02%20AM.jpeg' },
      { name: 'Segadalu', slug: 'segadalu', description: 'Classic Odia treats.', order: 3, isDefault: true, image: '/TASTE%20OF%20ODISHA/SEGADALU%20100gram_-%E2%82%B939/Rasi%20segdalu/WhatsApp%20Image%202026-05-29%20at%2012.36.39%20AM.jpeg' },
      { name: 'Mixture', slug: 'mixture', description: 'Spicy and savory mixtures.', order: 4, isDefault: true, image: '/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Cornflakes%20mixture/WhatsApp%20Image%202026-05-24%20at%208.05.26%20PM.jpeg' },
      { name: 'Dry Delight', slug: 'dry-delight', description: 'Tangy and dry delicacies.', order: 5, isDefault: true, image: '/TASTE%20OF%20ODISHA/DRY%20DELIGHT%20200gram_-%E2%82%B979/Ambula/WhatsApp%20Image%202026-05-31%20at%201.28.31%20AM.jpeg' },
      { name: 'Pickles', slug: 'pickles', description: 'Traditional homemade pickles.', order: 6, isDefault: true, image: '/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/MIX%20SWEET%20ACHAR/WhatsApp%20Image%202026-05-30%20at%2012.57.41%20AM.jpeg' },
      { name: 'Papaad', slug: 'papaad', description: 'Crispy lentil wafers.', order: 7, isDefault: true, image: '/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Special%20chuna%20papad/WhatsApp%20Image%202026-05-31%20at%2012.44.18%20AM.jpeg' },
      { name: 'Achar', slug: 'achar', description: 'Authentic spicy and tangy Achar varieties.', order: 8, isDefault: true, image: '/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/AMBASODA%20OR%20MANGO%20JELLY%20ACHAR/WhatsApp%20Image%202026-05-31%20at%201.17.28%20AM.jpeg' },
    ];

    console.log('Clearing existing categories...');
    await Category.deleteMany({});
    console.log('Existing categories cleared.');

    console.log('Seeding default categories...');

    for (const cat of defaultCategories) {
      const existing = await Category.findOne({ slug: cat.slug });
      
      if (existing) {
        console.log(`Category "${cat.name}" (${cat.slug}) already exists. Skipping...`);
        continue;
      }

      await Category.create(cat);
      console.log(`Created category: ${cat.name}`);
    }

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedCategories();
