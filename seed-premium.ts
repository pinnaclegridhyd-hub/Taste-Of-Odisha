import mongoose from 'mongoose';
import Product from './models/Product.ts';
import { connectDB } from './lib/db.ts';

async function seed() {
  await connectDB();
  
  const products = [
    {
      name: 'Odisha Thekua (Authentic)',
      slug: 'odisha-thekua',
      description: 'The golden snack of Chhath Puja, sun-baked and heart-made. Prepared with whole wheat, jaggery, and dry fruits using traditional wooden molds (sancha).',
      price: 499,
      category: 'food',
      images: ['/thekua_unique.png'],
      inStock: true,
      featured: true,
      discount: { type: 'percentage', value: 10 },
      stockQuantity: 100,
      origin: 'Odisha'
    },
    {
      name: 'Graded Odisha Makhana',
      slug: 'graded-makhana',
      description: 'Luxury fox nuts curated by grade. Hand-roasted and classified by traditional Odisha sutta grading systems for peak quality and texture. Rich in protein and antioxidants, flavored with a secret blend of Odisha masalas.',
      price: 320, // Base price for 3 sutta
      category: 'food',
      images: ['/images/makhana_bowl.png', '/images/makhana_packaging.png', '/images/makhana_traditional.png'],
      inStock: true,
      featured: true,
      stockQuantity: 500,
      origin: 'Odisha',
      variants: [
        { name: '3 sutta', price: 320, stockQuantity: 100 },
        { name: '4 sutta', price: 665, stockQuantity: 100 },
        { name: '4 sutta (HP)', price: 810, stockQuantity: 100 },
        { name: '4+ (NOR)', price: 930, stockQuantity: 100 },
        { name: '4+ (HP)', price: 1030, stockQuantity: 100 },
        { name: '5 sutta (NOR)', price: 970, stockQuantity: 100 },
        { name: '5 sutta (HP)', price: 1020, stockQuantity: 100 },
        { name: '5+ (NOR)', price: 1030, stockQuantity: 100 },
        { name: '5+ (HP)', price: 1120, stockQuantity: 100 },
        { name: '6+ (NOR)', price: 1220, stockQuantity: 100 },
        { name: '6+ (HP)', price: 1300, stockQuantity: 100 }
      ]
    },
    {
      name: 'Puri Silk Dupatta',
      slug: 'puri-dupatta',
      description: 'Hand-painted silk drapes telling stories of ancient lore. Each piece is unique, featuring intricate Kohbar and flora patterns painted by master artisans.',
      price: 2499,
      category: 'clothing',
      images: ['/dupatta_unique.png'],
      inStock: true,
      featured: true,
      stockQuantity: 25,
      origin: 'Odisha'
    },
    {
      name: 'Ceremonial Odisha Paag',
      slug: 'odisha-paag',
      description: 'The ceremonial crown of Odisha heritage. A symbol of honor and respect, hand-folded and stitched in the traditional red cotton fabric.',
      price: 799,
      category: 'festive',
      images: ['/Odisha-Paag.jpg'],
      inStock: true,
      featured: true,
      stockQuantity: 150,
      origin: 'Odisha'
    },
    {
      name: 'Spicy Mango Odisha Achar',
      slug: 'odisha-achar',
      description: 'Traditional Odisha Achar (mango pickles) in a classic white and yellow ceramic jar style. Sun-lit and sun-dried for that authentic tangy flavor.',
      price: 349,
      category: 'food',
      images: ['/achar_unique.png'],
      inStock: true,
      featured: true,
      stockQuantity: 200,
      origin: 'Odisha'
    },
    {
      name: 'Chhath Puja Prasad Box',
      slug: 'festival-pack',
      description: 'Premium festival gift box for Chhath Puja, including traditional prasad items like Thekua, Makhana, and organic dry fruits in eco-friendly gold foil packaging.',
      price: 1299,
      category: 'festive',
      images: ['/prasad_unique.png'],
      inStock: true,
      featured: true,
      stockQuantity: 50,
      origin: 'Odisha'
    },
    {
      name: 'Odisha Janeu (Sacred Thread)',
      slug: 'odisha-janeu',
      description: 'Sacred hand-spun cotton Janeu threads, colored with natural pigments and knotted with traditional Vedic precision.',
      price: 199,
      category: 'festive',
      images: ['/white-janeu.jpg', '/yellow-janeu.jpg', '/Red-Janeu.webp', '/janeu_unique.png'],
      inStock: true,
      featured: true,
      origin: 'Odisha',
      stockQuantity: 300,
      variants: [
        { name: 'Traditional White', price: 199, stockQuantity: 100, image: '/white-janeu.jpg' },
        { name: 'Saffron Yellow', price: 199, stockQuantity: 100, image: '/yellow-janeu.jpg' },
        { name: 'Ceremonial Red', price: 199, stockQuantity: 100, image: '/Red-Janeu.webp' }
      ]
    }
  ];

  for (const p of products) {
    await Product.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, returnDocument: 'after' });
  }

  console.log('Premium Heritage Products Seeded Successfully with Variants');
  process.exit(0);
}

seed();
