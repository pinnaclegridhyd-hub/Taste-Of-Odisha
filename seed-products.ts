import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import mongoose from 'mongoose';
import Product from './models/Product';
import { connectDB } from './lib/db';

const productsToSeed = [
  {
    "name": "Ambasoda Or Mango Jelly Achar (500g)",
    "slug": "ambasoda-or-mango-jelly-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/AMBASODA%20OR%20MANGO%20JELLY%20ACHAR/WhatsApp%20Image%202026-05-31%20at%201.17.28%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ambasoda Or Mango Jelly Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Amla Sweet Achar (500g)",
    "slug": "amla-sweet-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/AMLA%20SWEET%20ACHAR/WhatsApp%20Image%202026-05-24%20at%208.43.57%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Amla Sweet Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Barakoli Achar (500g)",
    "slug": "barakoli-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/BARAKOLI%20ACHAR/WhatsApp%20Image%202026-05-30%20at%2012.50.02%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Barakoli Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Champeita Achar (500g)",
    "slug": "champeita-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/CHAMPEITA%20ACHAR/WhatsApp%20Image%202026-05-31%20at%201.24.23%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Champeita Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Coriander Achar (500g)",
    "slug": "coriander-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/CORIANDER%20ACHAR/WhatsApp%20Image%202026-05-24%20at%209.31.28%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Coriander Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Drumsticks Achar (500g)",
    "slug": "drumsticks-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/DRUMSTICKS%20ACHAR/WhatsApp%20Image%202026-05-30%20at%2012.45.11%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Drumsticks Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ginger Achar (500g)",
    "slug": "ginger-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/GINGER%20ACHAR/WhatsApp%20Image%202026-05-31%20at%201.19.40%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ginger Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Gongura Achar (500g)",
    "slug": "gongura-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/GONGURA%20ACHAR/WhatsApp%20Image%202026-05-24%20at%208.53.11%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Gongura Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Green Chilly Achar (500g)",
    "slug": "green-chilly-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/GREEN%20CHILLY%20ACHAR/WhatsApp%20Image%202026-05-30%20at%2012.48.03%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Green Chilly Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Hot Amla Achar (500g)",
    "slug": "hot-amla-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/HOT%20AMLA%20ACHAR/WhatsApp%20Image%202026-05-24%20at%208.56.15%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Hot Amla Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Hot Mango Achar (500g)",
    "slug": "hot-mango-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/HOT%20MANGO%20ACHAR/WhatsApp%20Image%202026-05-30%20at%2012.43.21%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Hot Mango Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Hot Mix Achar (500g)",
    "slug": "hot-mix-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/HOT%20MIX%20ACHAR/WhatsApp%20Image%202026-05-30%20at%201.03.38%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Hot Mix Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Jackfruit Achar (500g)",
    "slug": "jackfruit-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/JACKFRUIT%20ACHAR/WhatsApp%20Image%202026-05-24%20at%209.11.46%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Jackfruit Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Kaitha Achar (500g)",
    "slug": "kaitha-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/KAITHA%20ACHAR/WhatsApp%20Image%202026-05-24%20at%207.51.55%20PM%20(1).jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Kaitha Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Lemon Sweet Achar (500g)",
    "slug": "lemon-sweet-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/LEMON%20SWEET%20ACHAR/WhatsApp%20Image%202026-05-24%20at%207.47.25%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Lemon Sweet Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Mango Kora Achar (500g)",
    "slug": "mango-kora-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/MANGO%20KORA%20ACHAR/WhatsApp%20Image%202026-05-30%20at%2012.41.08%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Mango Kora Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Mango Lollipop Achar (500g)",
    "slug": "mango-lollipop-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/MANGO%20LOLLIPOP%20ACHAR/WhatsApp%20Image%202026-05-24%20at%207.36.33%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Mango Lollipop Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Mango Rai Achar (500g)",
    "slug": "mango-rai-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/MANGO%20RAI%20ACHAR/WhatsApp%20Image%202026-05-29%20at%206.34.59%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Mango Rai Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Mango Sweet Achar (500g)",
    "slug": "mango-sweet-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/MANGO%20SWEET%20ACHAR/WhatsApp%20Image%202026-05-30%20at%2012.51.58%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Mango Sweet Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Masala Garlic Achar (500g)",
    "slug": "masala-garlic-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/MASALA%20GARLIC%20ACHAR/WhatsApp%20Image%202026-05-30%20at%201.05.53%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Masala Garlic Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Mix Sweet Achar (500g)",
    "slug": "mix-sweet-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/MIX%20SWEET%20ACHAR/WhatsApp%20Image%202026-05-30%20at%2012.57.41%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Mix Sweet Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Mustard Garlic Achar (500g)",
    "slug": "mustard-garlic-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/MUSTARD%20GARLIC%20ACHAR/WhatsApp%20Image%202026-05-31%20at%201.21.49%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Mustard Garlic Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Navaratna Achar (500g)",
    "slug": "navaratna-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/NAVARATNA%20ACHAR/WhatsApp%20Image%202026-05-24%20at%208.50.41%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Navaratna Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Red Chilly Achar (500g)",
    "slug": "red-chilly-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/RED%20CHILLY%20ACHAR/WhatsApp%20Image%202026-05-30%20at%2012.32.36%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Red Chilly Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Tamarind Achar (500g)",
    "slug": "tamarind-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/TAMARIND%20ACHAR/WhatsApp%20Image%202026-05-30%20at%201.10.19%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Tamarind Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Tomato Achar (500g)",
    "slug": "tomato-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/TOMATO%20ACHAR/WhatsApp%20Image%202026-05-31%20at%201.26.47%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Tomato Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Tova Achar (500g)",
    "slug": "tova-achar",
    "category": "Achar",
    "price": 199,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9199/TOVA%20ACHAR/WhatsApp%20Image%202026-05-30%20at%2012.35.39%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Tova Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ambula (200g)",
    "slug": "ambula",
    "category": "Dry Delight",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/DRY%20DELIGHT%20200gram_-%E2%82%B979/Ambula/WhatsApp%20Image%202026-05-31%20at%201.28.31%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ambula (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Imli Shots (200g)",
    "slug": "imli-shots",
    "category": "Dry Delight",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/DRY%20DELIGHT%20200gram_-%E2%82%B979/Imli%20Shots/WhatsApp%20Image%202026-05-29%20at%202.31.40%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Imli Shots (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Kakharubadi (200g)",
    "slug": "kakharubadi",
    "category": "Dry Delight",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/DRY%20DELIGHT%20200gram_-%E2%82%B979/Kakharubadi/WhatsApp%20Image%202026-05-31%20at%201.30.29%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Kakharubadi (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Nadi Badi (200g)",
    "slug": "nadi-badi",
    "category": "Dry Delight",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/DRY%20DELIGHT%20200gram_-%E2%82%B979/NADI%20BADI/WhatsApp%20Image%202026-05-31%20at%201.33.57%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Nadi Badi (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Phulobadi (200g)",
    "slug": "phulobadi",
    "category": "Dry Delight",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/DRY%20DELIGHT%20200gram_-%E2%82%B979/Phulobadi/WhatsApp%20Image%202026-05-31%20at%201.32.18%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Phulobadi (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Buguda Mixture (250g)",
    "slug": "buguda-mixture",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Buguda%20mixture/WhatsApp%20Image%202026-05-29%20at%202.48.21%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Buguda Mixture (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Chana Dal (250g)",
    "slug": "chana-dal",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Chana%20dal/WhatsApp%20Image%202026-05-29%20at%203.23.12%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Chana Dal (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Chaulo  Ganthiya Mixture (250g)",
    "slug": "chaulo-ganthiya-mixture",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Chaulo%20%20ganthiya%20mixture/WhatsApp%20Image%202026-05-29%20at%202.40.24%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Chaulo  Ganthiya Mixture (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Chiwda Mixture (250g)",
    "slug": "chiwda-mixture",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Chiwda%20mixture/WhatsApp%20Image%202026-05-29%20at%203.03.17%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Chiwda Mixture (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Cornflakes Mixture (250g)",
    "slug": "cornflakes-mixture",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Cornflakes%20mixture/WhatsApp%20Image%202026-05-24%20at%208.05.26%20PM.jpeg",
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Cornflakes%20mixture/WhatsApp%20Image%202026-05-29%20at%202.35.25%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Cornflakes Mixture (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Garlic Mixture (250g)",
    "slug": "garlic-mixture",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Garlic%20mixture/WhatsApp%20Image%202026-05-29%20at%205.58.00%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Garlic Mixture (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Garlic Sau (250g)",
    "slug": "garlic-sau",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Garlic%20sau/WhatsApp%20Image%202026-05-29%20at%203.30.02%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Garlic Sau (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ginger Mixture (250g)",
    "slug": "ginger-mixture",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Ginger%20mixture/WhatsApp%20Image%202026-05-29%20at%206.05.20%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ginger Mixture (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Khasta Badan Pakodi (250g)",
    "slug": "khasta-badan-pakodi",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Khasta%20badan%20pakodi/WhatsApp%20Image%202026-05-29%20at%202.16.11%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Khasta Badan Pakodi (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Koromonga Ganthiya (250g)",
    "slug": "koromonga-ganthiya",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Koromonga%20ganthiya/WhatsApp%20Image%202026-05-29%20at%206.27.19%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Koromonga Ganthiya (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Masala Boondi (250g)",
    "slug": "masala-boondi",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Masala%20boondi/WhatsApp%20Image%202026-05-29%20at%203.19.28%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Masala Boondi (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Mini Nimki (250g)",
    "slug": "mini-nimki",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Mini%20nimki/WhatsApp%20Image%202026-05-29%20at%202.20.55%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Mini Nimki (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Moong Murukku Mixture (250g)",
    "slug": "moong-murukku-mixture",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Moong%20murukku%20mixture/WhatsApp%20Image%202026-05-29%20at%205.33.59%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Moong Murukku Mixture (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Mota Sau (250g)",
    "slug": "mota-sau",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Mota%20sau/WhatsApp%20Image%202026-05-31%20at%2012.47.04%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Mota Sau (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Onion Mixture (250g)",
    "slug": "onion-mixture",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Onion%20mixture/WhatsApp%20Image%202026-05-29%20at%206.08.50%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Onion Mixture (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Rojana Badi (250g)",
    "slug": "rojana-badi",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Rojana%20badi/WhatsApp%20Image%202026-05-29%20at%203.09.26%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Rojana Badi (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Sadha Boondi (250g)",
    "slug": "sadha-boondi",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Sadha%20boondi/WhatsApp%20Image%202026-05-29%20at%203.15.58%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Sadha Boondi (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Sadha Mixture (250g)",
    "slug": "sadha-mixture",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Sadha%20mixture/WhatsApp%20Image%202026-05-29%20at%206.21.36%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Sadha Mixture (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Saru Sau (250g)",
    "slug": "saru-sau",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Saru%20sau/WhatsApp%20Image%202026-05-24%20at%209.06.35%20PM.jpeg",
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Saru%20sau/WhatsApp%20Image%202026-05-29%20at%2012.06.39%20AM.jpeg",
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Saru%20sau/WhatsApp%20Image%202026-05-29%20at%2012.06.45%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Saru Sau (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Special Buguda Mixture (250g)",
    "slug": "special-buguda-mixture",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Special%20Buguda%20mixture/WhatsApp%20Image%202026-05-29%20at%203.00.09%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Special Buguda Mixture (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Spicy Hot Mixture (250g)",
    "slug": "spicy-hot-mixture",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Spicy%20hot%20mixture/WhatsApp%20Image%202026-05-29%20at%206.16.33%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Spicy Hot Mixture (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Belt Murukku (100g)",
    "slug": "belt-murukku",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Belt%20murukku/WhatsApp%20Image%202026-05-28%20at%2011.51.33%20PM.jpeg",
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Belt%20murukku/WhatsApp%20Image%202026-05-28%20at%2011.58.34%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Belt Murukku (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Biri Murukku (100g)",
    "slug": "biri-murukku",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Biri%20murukku/WhatsApp%20Image%202026-05-29%20at%201.46.04%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Biri Murukku (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Garlic Masala Murruku (100g)",
    "slug": "garlic-masala-murruku",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Garlic%20masala%20murruku/WhatsApp%20Image%202026-05-29%20at%2012.34.17%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Garlic Masala Murruku (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Garlic Murukku (100g)",
    "slug": "garlic-murukku",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Garlic%20murukku/WhatsApp%20Image%202026-05-29%20at%201.07.03%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Garlic Murukku (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ghagerabadi (khudobadi) (100g)",
    "slug": "ghagerabadi-khudobadi",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Ghagerabadi%20(khudobadi)/WhatsApp%20Image%202026-05-29%20at%2012.26.56%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ghagerabadi (khudobadi) (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ghagerabadi Stick (khudobadi) (100g)",
    "slug": "ghagerabadi-stick-khudobadi",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Ghagerabadi%20stick%20(Khudobadi)/WhatsApp%20Image%202026-05-29%20at%2012.30.35%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ghagerabadi Stick (khudobadi) (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Karam Gavvalu (kaudi) (100g)",
    "slug": "karam-gavvalu-kaudi",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Karam%20gavvalu%20(kaudi)/WhatsApp%20Image%202026-05-29%20at%201.52.10%20PM%20(1).jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Karam Gavvalu (kaudi) (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Machamanzi (100g)",
    "slug": "machamanzi",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Machamanzi/WhatsApp%20Image%202026-05-29%20at%201.04.18%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Machamanzi (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Masala Murukku (100g)",
    "slug": "masala-murukku",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Masala%20murukku/WhatsApp%20Image%202026-05-29%20at%2012.31.56%20AM%20(1).jpeg",
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Masala%20murukku/WhatsApp%20Image%202026-05-29%20at%2012.31.56%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Masala Murukku (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Moong Dal Murukku (100g)",
    "slug": "moong-dal-murukku",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Moong%20dal%20murukku/WhatsApp%20Image%202026-05-29%20at%201.37.37%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Moong Dal Murukku (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Rasi Murukku (100g)",
    "slug": "rasi-murukku",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Rasi%20murukku/WhatsApp%20Image%202026-05-29%20at%201.24.49%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Rasi Murukku (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Rice Murukku (100g)",
    "slug": "rice-murukku",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Rice%20murukku/WhatsApp%20Image%202026-05-29%20at%201.39.41%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Rice Murukku (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ring Rice Murukku (100g)",
    "slug": "ring-rice-murukku",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Ring%20rice%20murukku/WhatsApp%20Image%202026-05-29%20at%2012.06.59%20AM.jpeg",
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Ring%20rice%20murukku/WhatsApp%20Image%202026-05-29%20at%2012.07.00%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ring Rice Murukku (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Sau Murukku (100g)",
    "slug": "sau-murukku",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Sau%20murukku/WhatsApp%20Image%202026-05-29%20at%2012.40.15%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Sau Murukku (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Special Rice  Murukku (100g)",
    "slug": "special-rice-murukku",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Special%20Rice%20%20murukku/WhatsApp%20Image%202026-05-29%20at%201.41.20%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Special Rice  Murukku (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Stick Belt Murukku (100g)",
    "slug": "stick-belt-murukku",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Stick%20belt%20murukku/WhatsApp%20Image%202026-05-29%20at%201.17.45%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Stick Belt Murukku (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Stick Masala Murukku (100g)",
    "slug": "stick-masala-murukku",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Stick%20masala%20murukku/WhatsApp%20Image%202026-05-29%20at%201.09.40%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Stick Masala Murukku (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Garlic Papad (200g)",
    "slug": "garlic-papad",
    "category": "Papaad",
    "price": 99,
    "images": [
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Garlic%20papad/WhatsApp%20Image%202026-05-31%20at%2012.49.59%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Garlic Papad (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Jeera Papad (200g)",
    "slug": "jeera-papad",
    "category": "Papaad",
    "price": 99,
    "images": [
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Jeera%20papad/WhatsApp%20Image%202026-05-29%20at%205.28.46%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Jeera Papad (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Masala Liabadi (200g)",
    "slug": "masala-liabadi",
    "category": "Papaad",
    "price": 99,
    "images": [
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Masala%20liabadi/WhatsApp%20Image%202026-05-29%20at%2012.18.09%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Masala Liabadi (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Masala Moong Papad (200g)",
    "slug": "masala-moong-papad",
    "category": "Papaad",
    "price": 99,
    "images": [
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Masala%20moong%20papad/WhatsApp%20Image%202026-05-31%20at%2012.56.25%20AM%20(1).jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Masala Moong Papad (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Masala Sagoo Badi (200g)",
    "slug": "masala-sagoo-badi",
    "category": "Papaad",
    "price": 99,
    "images": [
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Masala%20sagoo%20badi/WhatsApp%20Image%202026-05-29%20at%2012.14.20%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Masala Sagoo Badi (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Mini Papad (200g)",
    "slug": "mini-papad",
    "category": "Papaad",
    "price": 99,
    "images": [
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/MINI%20PAPAD/WhatsApp%20Image%202026-05-29%20at%2012.07.03%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Mini Papad (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Moong Papad (200g)",
    "slug": "moong-papad",
    "category": "Papaad",
    "price": 99,
    "images": [
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Moong%20papad/WhatsApp%20Image%202026-05-31%20at%2012.53.56%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Moong Papad (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Pudina Kapeda (200g)",
    "slug": "pudina-kapeda",
    "category": "Papaad",
    "price": 99,
    "images": [
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Pudina%20kapeda/WhatsApp%20Image%202026-05-29%20at%2012.03.52%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Pudina Kapeda (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Pudina Papad (200g)",
    "slug": "pudina-papad",
    "category": "Papaad",
    "price": 99,
    "images": [
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/PUDINA%20PAPAD/WhatsApp%20Image%202026-05-27%20at%2010.26.06%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Pudina Papad (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Rasi Papad (200g)",
    "slug": "rasi-papad",
    "category": "Papaad",
    "price": 99,
    "images": [
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Rasi%20papad/WhatsApp%20Image%202026-05-29%20at%2012.07.01%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Rasi Papad (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Sadha Liabadi (200g)",
    "slug": "sadha-liabadi",
    "category": "Papaad",
    "price": 99,
    "images": [
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Sadha%20liabadi/WhatsApp%20Image%202026-05-29%20at%2012.20.42%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Sadha Liabadi (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Sadha White Kapeda (200g)",
    "slug": "sadha-white-kapeda",
    "category": "Papaad",
    "price": 99,
    "images": [
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Sadha%20white%20kapeda/WhatsApp%20Image%202026-05-29%20at%2011.22.04%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Sadha White Kapeda (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Sagoobadi (200g)",
    "slug": "sagoobadi",
    "category": "Papaad",
    "price": 99,
    "images": [
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Sagoobadi/WhatsApp%20Image%202026-05-29%20at%2012.12.36%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Sagoobadi (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Special Chuna Papad (200g)",
    "slug": "special-chuna-papad",
    "category": "Papaad",
    "price": 99,
    "images": [
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Special%20chuna%20papad/WhatsApp%20Image%202026-05-31%20at%2012.44.18%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Special Chuna Papad (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Special Rasi Papad (200g)",
    "slug": "special-rasi-papad",
    "category": "Papaad",
    "price": 99,
    "images": [
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Special%20rasi%20papad/WhatsApp%20Image%202026-05-31%20at%2012.52.12%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Special Rasi Papad (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Stick Rasi Papad (200g)",
    "slug": "stick-rasi-papad",
    "category": "Papaad",
    "price": 99,
    "images": [
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Stick%20rasi%20papad/WhatsApp%20Image%202026-05-24%20at%207.52.33%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Stick Rasi Papad (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Tomato Kapeda (200g)",
    "slug": "tomato-kapeda",
    "category": "Papaad",
    "price": 99,
    "images": [
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Tomato%20kapeda/WhatsApp%20Image%202026-05-29%20at%2010.53.04%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Tomato Kapeda (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Tomato Papad (200g)",
    "slug": "tomato-papad",
    "category": "Papaad",
    "price": 99,
    "images": [
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/TOMATO%20PAPAD/WhatsApp%20Image%202026-05-27%20at%2010.26.05%20AM%20(1).jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Tomato Papad (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Chaulo Rasi Sipulu (100g)",
    "slug": "chaulo-rasi-sipulu",
    "category": "Segadalu",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/SEGADALU%20100gram_-%E2%82%B939/Chaulo%20rasi%20sipulu/WhatsApp%20Image%202026-05-29%20at%202.25.50%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Chaulo Rasi Sipulu (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Jai Segdalu (100g)",
    "slug": "jai-segdalu",
    "category": "Segadalu",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/SEGADALU%20100gram_-%E2%82%B939/Jai%20segdalu/WhatsApp%20Image%202026-05-29%20at%2012.30.05%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Jai Segdalu (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Rasi Nola Sipulu (100g)",
    "slug": "rasi-nola-sipulu",
    "category": "Segadalu",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/SEGADALU%20100gram_-%E2%82%B939/Rasi%20nola%20sipulu/WhatsApp%20Image%202026-05-31%20at%2012.33.39%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Rasi Nola Sipulu (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Rasi Segdalu (100g)",
    "slug": "rasi-segdalu",
    "category": "Segadalu",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/SEGADALU%20100gram_-%E2%82%B939/Rasi%20segdalu/WhatsApp%20Image%202026-05-29%20at%2012.36.39%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Rasi Segdalu (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Rasi Sipulu (100g)",
    "slug": "rasi-sipulu",
    "category": "Segadalu",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/SEGADALU%20100gram_-%E2%82%B939/Rasi%20sipulu/WhatsApp%20Image%202026-05-29%20at%202.04.31%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Rasi Sipulu (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Stick Rasi Segdalu (100g)",
    "slug": "stick-rasi-segdalu",
    "category": "Segadalu",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/SEGADALU%20100gram_-%E2%82%B939/Stick%20rasi%20segdalu/WhatsApp%20Image%202026-05-29%20at%202.11.04%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Stick Rasi Segdalu (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Adisha (200g)",
    "slug": "adisha",
    "category": "Sweets",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/ADISHA/WhatsApp%20Image%202026-05-31%20at%2012.32.02%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Adisha (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Anta Khoja (200g)",
    "slug": "anta-khoja",
    "category": "Sweets",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/Anta%20khoja/WhatsApp%20Image%202026-05-29%20at%202.29.03%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Anta Khoja (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Jaggery Til Ladoo Rasikhaja (200g)",
    "slug": "jaggery-til-ladoo-rasikhaja",
    "category": "Sweets",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/JAGGERY%20TIL%20LADOO%20Rasikhaja/WhatsApp%20Image%202026-05-31%20at%2012.59.57%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Jaggery Til Ladoo Rasikhaja (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Sugar Til Ladoo Rasikhaja (200g)",
    "slug": "sugar-til-ladoo-rasikhaja",
    "category": "Sweets",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/SUGAR%20TIL%20LADOO%20Rasikhaja/WhatsApp%20Image%202026-05-31%20at%2012.58.37%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Sugar Til Ladoo Rasikhaja (200g) (200g), carefully prepared and sourced for the highest quality."
  }
];

async function seedProducts() {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('Existing products cleared.');

    console.log(`Seeding ${productsToSeed.length} products...`);
    await Product.insertMany(productsToSeed);
    console.log('Products seeded successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedProducts();
