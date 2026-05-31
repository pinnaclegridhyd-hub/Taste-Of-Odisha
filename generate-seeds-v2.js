const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'public', 'TASTE OF ODISHA');

function parseFolderInfo(folderName) {
  // Example: BERHAMPUR ACHAR_-500gram  ₹199
  // Example: MURUKU 100gram_-₹39
  
  let price = 150;
  let quantity = "100gram";
  
  // Extract Price
  const priceMatch = folderName.match(/₹(\d+)/);
  if (priceMatch) {
    price = parseInt(priceMatch[1], 10);
  } else {
    // If ₹ is scrambled or something, look for number at the very end after -
    const fallbackPriceMatch = folderName.match(/-(\d+)$/);
    if (fallbackPriceMatch) {
        price = parseInt(fallbackPriceMatch[1], 10);
    }
  }

  // Extract Quantity
  const qtyMatch = folderName.match(/(\d+)gram/);
  if (qtyMatch) {
    quantity = qtyMatch[1] + "g";
  }

  // Determine Category from name
  const upper = folderName.toUpperCase();
  let category = 'Other';
  if (upper.includes('ACHAR')) category = 'Achar';
  else if (upper.includes('DRY DELIGHT')) category = 'Dry Delight';
  else if (upper.includes('MIXTURE')) category = 'Mixture';
  else if (upper.includes('MURUKU')) category = 'Muruku';
  else if (upper.includes('PAPAD')) category = 'Papaad';
  else if (upper.includes('SEGADALU')) category = 'Segadalu';
  else if (upper.includes('SWEET')) category = 'Sweets';
  
  return { price, quantity, category };
}

function formatName(name) {
    return name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

function encodePath(str) {
    // Split by slash and encodeURIComponent each part to handle spaces and ₹ safely for browsers
    return str.split('/').map(segment => encodeURIComponent(segment)).join('/');
}

const products = [];

const parentFolders = fs.readdirSync(baseDir);

for (const parent of parentFolders) {
  const parentPath = path.join(baseDir, parent);
  if (!fs.statSync(parentPath).isDirectory()) continue;
  
  const { price, quantity, category } = parseFolderInfo(parent);
  
  const productFolders = fs.readdirSync(parentPath);
  
  for (const productFolder of productFolders) {
     const productPath = path.join(parentPath, productFolder);
     if (!fs.statSync(productPath).isDirectory()) continue;
     
     const files = fs.readdirSync(productPath).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
     if (files.length === 0) continue;
     
     const images = files.map(file => {
         // Create the relative path from public/
         const rawPath = `/TASTE OF ODISHA/${parent}/${productFolder}/${file}`;
         return encodePath(rawPath).replace(/%2F/g, '/'); // ensure slashes aren't encoded
     });
     
     const baseName = formatName(productFolder.replace(/[_-]/g, ' '));
     const slug = baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
     const name = `${baseName} (${quantity})`;
     
     products.push({
        name,
        slug,
        category,
        price,
        images,
        inStock: true,
        stockQuantity: 100,
        origin: 'Odisha',
        description: `Authentic Taste Of Odisha ${name} (${quantity}), carefully prepared and sourced for the highest quality.`
     });
  }
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
console.log(`Generated seed-products.ts with ${products.length} products and fixed URIs!`);
