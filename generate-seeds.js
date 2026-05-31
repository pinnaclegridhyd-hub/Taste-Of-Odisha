const fs = require('fs');

const imageMap = JSON.parse(fs.readFileSync('image-map.json', 'utf8'));

// Helper to determine category from the image path
function determineCategory(pathStr) {
  const upperPath = pathStr.toUpperCase();
  if (upperPath.includes('ACHAR')) return 'Achar';
  if (upperPath.includes('DRY DELIGHT')) return 'Dry Delight';
  if (upperPath.includes('MIXTURE')) return 'Mixture';
  if (upperPath.includes('MURUKU')) return 'Muruku';
  if (upperPath.includes('PAPAD')) return 'Papad';
  if (upperPath.includes('SEGADALU')) return 'Segadalu';
  if (upperPath.includes('SWEET')) return 'Sweets';
  return 'Other';
}

function determinePrice(category) {
    const prices = {
        'Achar': 250,
        'Dry Delight': 140,
        'Mixture': 180,
        'Muruku': 150,
        'Papad': 120,
        'Segadalu': 160,
        'Sweets': 200,
        'Other': 150
    };
    return prices[category] || 150;
}

// Capitalize first letter of each word
function formatName(name) {
    return name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

const products = [];

for (const [folderName, images] of Object.entries(imageMap)) {
    const firstImagePath = images[0];
    const category = determineCategory(firstImagePath);
    const name = formatName(folderName.replace(/[_-]/g, ' '));
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    products.push({
        name,
        slug,
        category,
        price: determinePrice(category),
        images: images,
        inStock: true,
        stockQuantity: 100,
        origin: 'Odisha',
        description: `Authentic Taste Of Odisha ${name}, carefully prepared and sourced for the highest quality.`
    });
}

// Generate the TypeScript file content
const tsContent = `import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import mongoose from 'mongoose';
import Product from './models/Product';
import { connectDB } from './lib/db';

const productsToSeed = ${JSON.stringify(products, null, 2)};

async function seedProducts() {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('Existing products cleared.');

    console.log(\`Seeding \${productsToSeed.length} products...\`);
    await Product.insertMany(productsToSeed);
    console.log('Products seeded successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedProducts();
`;

fs.writeFileSync('seed-products.ts', tsContent, 'utf8');
console.log(`Generated seed-products.ts with ${products.length} products!`);
