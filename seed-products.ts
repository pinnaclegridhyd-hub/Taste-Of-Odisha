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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/AMBASODA%20OR%20MANGO%20JELLY%20ACHAR/file_00000000116c7206b3d5cb993ab62d03.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/AMBASODA%20OR%20MANGO%20JELLY%20ACHAR/file_000000002414720780bae01a4042fd08.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/AMBASODA%20OR%20MANGO%20JELLY%20ACHAR/file_000000005cd47207b5cf93e9a410e893.png"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/AMLA%20SWEET%20ACHAR/file_00000000242c7207837f0627aa2ee871.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/AMLA%20SWEET%20ACHAR/file_00000000b12471fa921735360df8af21.png"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/BARAKOLI%20ACHAR/file_00000000639c7206a200135360a4be29.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/BARAKOLI%20ACHAR/file_0000000090387207be90e28406452911.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Barakoli Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Big Size Chilly Pickle (500g)",
    "slug": "big-size-chilly-pickle",
    "category": "Achar",
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/BIG%20SIZE%20CHILLY%20PICKLE/file_00000000ad74720b9fc2be46915cef39.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/BIG%20SIZE%20CHILLY%20PICKLE/file_00000000ecf871f8a04da1efdb643043.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Big Size Chilly Pickle (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Champeita Achar (500g)",
    "slug": "champeita-achar",
    "category": "Achar",
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/CHAMPEITA%20ACHAR/file_00000000030c71fab6a10705eba3b461.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/CHAMPEITA%20ACHAR/file_00000000cf4c71fa9eefd441ff6adb4d.png"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/CORIANDER%20ACHAR/file_000000002e5c71faad584e8be4dd947c.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/CORIANDER%20ACHAR/file_00000000a25c71fa8a98311a4735a641.png"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/DRUMSTICKS%20ACHAR/file_0000000097a07207a63af11b27a93115.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/DRUMSTICKS%20ACHAR/file_00000000cb68720987ccd67bab446bcd.png"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/GINGER%20ACHAR/file_0000000019e47207b6d367582799f51f.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/GINGER%20ACHAR/file_00000000f6fc7207a7f356fe8ba8f8c4.png"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/GONGURA%20ACHAR/file_00000000b37072079fc9f5e556d06562.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/GONGURA%20ACHAR/file_00000000e9c471fa8e3569340f026912.png"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/GREEN%20CHILLY%20ACHAR/file_0000000052a87207a8d7b8c628f3a9da.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/GREEN%20CHILLY%20ACHAR/file_000000007db072079c59a6ddf7de2bad.png"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/HOT%20AMLA%20ACHAR/file_0000000040f471fd9241f0c3ae9a837e.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/HOT%20AMLA%20ACHAR/file_00000000801c71f887ffcb77c1c19a95.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/HOT%20AMLA%20ACHAR/file_00000000a47471fd8d82afc132c7c232.png"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/HOT%20MANGO%20ACHAR/file_00000000652472099ed83c2cfb68745f.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/HOT%20MANGO%20ACHAR/file_00000000f5447209bba35e40907dba8c.png"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/HOT%20MIX%20ACHAR/file_0000000074187206a6fdeddffacbff45.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/HOT%20MIX%20ACHAR/file_00000000c7907206b8ba89737a0e56a4.png"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/JACKFRUIT%20ACHAR/file_00000000673c7209a4ed61283a7766b9.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/JACKFRUIT%20ACHAR/file_0000000093cc7206ac213bccaacee05c.png"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/KAITHA%20ACHAR/file_0000000005a8720693e6bc65b9b10fce.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/KAITHA%20ACHAR/file_0000000009b872098eafaa6353dd31f5.png"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/LEMON%20SWEET%20ACHAR/file_0000000051c47206b29a1661a7c1e5a6.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/LEMON%20SWEET%20ACHAR/file_0000000076507209b6dd346db24e6d52.png"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/MANGO%20KORA%20ACHAR/file_00000000612871fa8d89eb0d525e71b3.png"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/MANGO%20LOLLIPOP%20ACHAR/file_00000000645c71faa112288623c88f59.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/MANGO%20LOLLIPOP%20ACHAR/file_000000009f487207963d1dbc95a4f4a0.png"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/MANGO%20RAI%20ACHAR/file_00000000a1b472069aa88b66c06a58fb.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/MANGO%20RAI%20ACHAR/file_00000000abf871fa9a82cb6ec5a99049.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Mango Rai Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Mango Sweet And Spicy (500g)",
    "slug": "mango-sweet-and-spicy",
    "category": "Achar",
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/MANGO%20SWEET%20AND%20SPICY/file_000000000d9471f59cc3f29249d722e1.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/MANGO%20SWEET%20AND%20SPICY/file_0000000051a471f793b330b2f265cb58.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Mango Sweet And Spicy (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Masala Garlic Achar (500g)",
    "slug": "masala-garlic-achar",
    "category": "Achar",
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/MASALA%20GARLIC%20ACHAR/file_00000000259c71f59307a2e757464cb4.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/MASALA%20GARLIC%20ACHAR/file_000000007d4071f5945d8c847268a92c.png"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/MIX%20SWEET%20ACHAR/file_00000000702071f59e0e244874ece619(1).png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/MIX%20SWEET%20ACHAR/file_00000000702071f59e0e244874ece619.png"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/MUSTARD%20GARLIC%20ACHAR/file_000000004b6871f58d35b91550819718.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/MUSTARD%20GARLIC%20ACHAR/file_0000000094e071f58b999a8e28f7e82f.png"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/NAVARATNA%20ACHAR/file_0000000041c871f590f603b5d22b3b59.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/NAVARATNA%20ACHAR/file_000000004e8471f7949ca3c2c6d8bc59.png"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/RED%20CHILLY%20ACHAR/file_00000000543c7207a5fe6e21ca92fcb3(1).png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/RED%20CHILLY%20ACHAR/file_00000000543c7207a5fe6e21ca92fcb3.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/RED%20CHILLY%20ACHAR/WhatsApp%20Image%202026-05-30%20at%2012.32.36%20AM.jpeg"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/TAMARIND%20ACHAR/file_0000000008b47209b6bc9babe07aab91.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/TAMARIND%20ACHAR/file_000000007d78720793ce1ab518c93c8d.png"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/TOMATO%20ACHAR/file_00000000883872079aee82d1aea7e285.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/TOMATO%20ACHAR/file_00000000af3c7209b633b3a44186a9fc.png"
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
    "price": 249,
    "images": [
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/TOVA%20ACHAR/file_000000007d307207bd07a21f2803ae84.png",
      "/TASTE%20OF%20ODISHA/BERHAMPUR%20ACHAR_-500gram%20%20%E2%82%B9249/TOVA%20ACHAR/WhatsApp%20Image%202026-05-30%20at%2012.35.39%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Tova Achar (500g) (500g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Hakka Noodles 250gram  ₹65 (100gram)",
    "slug": "hakka-noodles-250gram-65",
    "category": "Noodles",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/Chowmein-Noodles/Hakka%20noodles%20250gram_-%E2%82%B965/file_0000000063887206ba21046e6e5ddea3.png",
      "/TASTE%20OF%20ODISHA/Chowmein-Noodles/Hakka%20noodles%20250gram_-%E2%82%B965/file_00000000b15c7209852fc6bb0f2c0a89.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Hakka Noodles 250gram  ₹65 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ragi Noodles 250gram  ₹90 (100gram)",
    "slug": "ragi-noodles-250gram-90",
    "category": "Noodles",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/Chowmein-Noodles/Ragi%20noodles%20250gram_-%E2%82%B990/Screenshot_20260622_002718_Drive.jpg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ragi Noodles 250gram  ₹90 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Sooji Noodles 250gram  ₹70 (100gram)",
    "slug": "sooji-noodles-250gram-70",
    "category": "Noodles",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/Chowmein-Noodles/Sooji%20noodles%20250gram_-%E2%82%B970/20260608_163132.jpg",
      "/TASTE%20OF%20ODISHA/Chowmein-Noodles/Sooji%20noodles%20250gram_-%E2%82%B970/20260608_163135.jpg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Sooji Noodles 250gram  ₹70 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ambula  400gram (100gram)",
    "slug": "ambula-400gram",
    "category": "Dry Delight",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/DRY%20DELIGHT%20_-%E2%82%B979/Ambula_-400gram/file_000000006798720996118c5fa24e5fe1.png",
      "/TASTE%20OF%20ODISHA/DRY%20DELIGHT%20_-%E2%82%B979/Ambula_-400gram/WhatsApp%20Image%202026-05-31%20at%201.28.31%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ambula  400gram (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Imli Shots  200gram (100gram)",
    "slug": "imli-shots-200gram",
    "category": "Dry Delight",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/DRY%20DELIGHT%20_-%E2%82%B979/Imli%20Shots_-200gram/file_000000003cc872098a714fa4767cf29b.png",
      "/TASTE%20OF%20ODISHA/DRY%20DELIGHT%20_-%E2%82%B979/Imli%20Shots_-200gram/file_000000004cd871fa9831a8d7c5f0f8f8.png",
      "/TASTE%20OF%20ODISHA/DRY%20DELIGHT%20_-%E2%82%B979/Imli%20Shots_-200gram/file_00000000883472098747d84144ef3209.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Imli Shots  200gram (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Kakharubadi  200gram (100gram)",
    "slug": "kakharubadi-200gram",
    "category": "Dry Delight",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/DRY%20DELIGHT%20_-%E2%82%B979/Kakharubadi_-200gram/file_00000000dcd471fa8bfdcefb9933089d.png",
      "/TASTE%20OF%20ODISHA/DRY%20DELIGHT%20_-%E2%82%B979/Kakharubadi_-200gram/WhatsApp%20Image%202026-05-31%20at%201.30.29%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Kakharubadi  200gram (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Phulobadi  200gram (100gram)",
    "slug": "phulobadi-200gram",
    "category": "Dry Delight",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/DRY%20DELIGHT%20_-%E2%82%B979/Phulobadi_-200gram/file_00000000bd44720795e88d55cc98881d.png",
      "/TASTE%20OF%20ODISHA/DRY%20DELIGHT%20_-%E2%82%B979/Phulobadi_-200gram/WhatsApp%20Image%202026-05-31%20at%201.32.18%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Phulobadi  200gram (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Puri Famous Nadi Badi  200gram (100gram)",
    "slug": "puri-famous-nadi-badi-200gram",
    "category": "Dry Delight",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/DRY%20DELIGHT%20_-%E2%82%B979/PURI%20FAMOUS%20NADI%20BADI_-200gram/file_000000000c3872098739a48dfa980ab9.png",
      "/TASTE%20OF%20ODISHA/DRY%20DELIGHT%20_-%E2%82%B979/PURI%20FAMOUS%20NADI%20BADI_-200gram/WhatsApp%20Image%202026-05-31%20at%201.33.57%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Puri Famous Nadi Badi  200gram (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Rojana Badi  250gm (100gram)",
    "slug": "rojana-badi-250gm",
    "category": "Dry Delight",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/DRY%20DELIGHT%20_-%E2%82%B979/Rojana%20badi_-250gm/file_000000002858720b901144ec2c96dd07.png",
      "/TASTE%20OF%20ODISHA/DRY%20DELIGHT%20_-%E2%82%B979/Rojana%20badi_-250gm/file_000000004758720bb996d6960a344063.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Rojana Badi  250gm (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Besan 500gram  ₹79 (100gram)",
    "slug": "besan-500gram-79",
    "category": "Staples",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Besan%20500gram_-%E2%82%B979/df3a6fc209d23669c2b6d01f8b87be5a9eee911394ab5b7cc64a3d2af9332ee2.png",
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Besan%20500gram_-%E2%82%B979/file_00000000a56472079a2dcc3feb1421e2.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Besan 500gram  ₹79 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Bishnu Bhog Misri 500gram  ₹99 (100gram)",
    "slug": "bishnu-bhog-misri-500gram-99",
    "category": "Staples",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Bishnu%20bhog%20misri%20500gram_-%E2%82%B999/file_0000000051d472079bae4b96a68eae41.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Bishnu Bhog Misri 500gram  ₹99 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Chana Sattu 500gram  ₹149 (100gram)",
    "slug": "chana-sattu-500gram-149",
    "category": "Staples",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Chana%20sattu%20500gram_-%E2%82%B9149/file_0000000014807207887b61dd2983e65f.png",
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Chana%20sattu%20500gram_-%E2%82%B9149/file_0000000080e87206ab34c7b5d789e459.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Chana Sattu 500gram  ₹149 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Corn Flour 500gram  ₹69 (100gram)",
    "slug": "corn-flour-500gram-69",
    "category": "Staples",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Corn%20flour%20500gram_-%E2%82%B969/file_000000002e1072079e23ddb18def81d3.png",
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Corn%20flour%20500gram_-%E2%82%B969/file_0000000062107207bc520a3dd1ff170f.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Corn Flour 500gram  ₹69 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Daliya 500gram  ₹79 (100gram)",
    "slug": "daliya-500gram-79",
    "category": "Staples",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Daliya%20500gram_-%E2%82%B979/file_0000000079a8720997497cc5ef65abc4.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Daliya 500gram  ₹79 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Fried Poha 500gram  ₹89 (100gram)",
    "slug": "fried-poha-500gram-89",
    "category": "Staples",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Fried%20poha%20500gram_-%E2%82%B989/file_00000000787872068fe3563c01ebc55c.png",
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Fried%20poha%20500gram_-%E2%82%B989/file_00000000da347207a594225b8f25958a.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Fried Poha 500gram  ₹89 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Idli Rava  500gram  ₹59 (100gram)",
    "slug": "idli-rava-500gram-59",
    "category": "Staples",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Idli%20rava_-500gram_-%E2%82%B959/file_000000006e2c72069afbca5893d8f6c2.png",
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Idli%20rava_-500gram_-%E2%82%B959/file_00000000bc9c72079a4e65e9f3a31a1d.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Idli Rava  500gram  ₹59 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Lite Mixed Grain Sattu (sugarfree) 500gram  ₹119 (100gram)",
    "slug": "lite-mixed-grain-sattu-sugarfree-500gram-119",
    "category": "Staples",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Lite%20mixed%20grain%20sattu%20(sugarfree)%20500gram_-%E2%82%B9119/file_00000000068c7207b250cc922ebe2874.png",
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Lite%20mixed%20grain%20sattu%20(sugarfree)%20500gram_-%E2%82%B9119/file_000000009b4c7209ae10c41e109247c5.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Lite Mixed Grain Sattu (sugarfree) 500gram  ₹119 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Mixed Grain Sattu 500gram  ₹119 (100gram)",
    "slug": "mixed-grain-sattu-500gram-119",
    "category": "Staples",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Mixed%20grain%20sattu%20500gram_-%E2%82%B9119/file_00000000bbe872079886fdafa21d5c56.png",
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Mixed%20grain%20sattu%20500gram_-%E2%82%B9119/file_00000000c4c47207953035cd4fa2fff4.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Mixed Grain Sattu 500gram  ₹119 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Pakoda Besan 500gram  ₹69 (100gram)",
    "slug": "pakoda-besan-500gram-69",
    "category": "Staples",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Pakoda%20besan%20500gram_-%E2%82%B969/file_0000000099cc71fa8367db7e928ef20a.png",
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Pakoda%20besan%20500gram_-%E2%82%B969/file_00000000e19471faa2b465325131bc90.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Pakoda Besan 500gram  ₹69 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Peanut Badam  500gram  ₹149 (100gram)",
    "slug": "peanut-badam-500gram-149",
    "category": "Staples",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Peanut-Badam_-500gram_-%E2%82%B9149/file_000000004b5471faa12e388f0f536583.png",
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Peanut-Badam_-500gram_-%E2%82%B9149/file_00000000747471fab0f02913fd1703fc.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Peanut Badam  500gram  ₹149 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Punjabi Dal Tadka 500gram  ₹139 (100gram)",
    "slug": "punjabi-dal-tadka-500gram-139",
    "category": "Staples",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Punjabi%20dal%20tadka%20500gram_-%E2%82%B9139/file_000000003e34720685fed57257aa80db.png",
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Punjabi%20dal%20tadka%20500gram_-%E2%82%B9139/file_00000000fb1471fa9f714134009a98aa.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Punjabi Dal Tadka 500gram  ₹139 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Red Poha 1kg  ₹109 (100gram)",
    "slug": "red-poha-1kg-109",
    "category": "Staples",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Red%20poha%201kg_-%E2%82%B9109/file_00000000886c7207adb57bd3547f455f.png",
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Red%20poha%201kg_-%E2%82%B9109/file_000000008fa871fa9b455833275ea20c.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Red Poha 1kg  ₹109 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Sagoo 500gram  ₹69 (100gram)",
    "slug": "sagoo-500gram-69",
    "category": "Staples",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Sagoo%20500gram_-%E2%82%B969/file_000000008c347206a00fe10aa478bd97.png",
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Sagoo%20500gram_-%E2%82%B969/file_00000000a4ec7207ab4ef07787715e48.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Sagoo 500gram  ₹69 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Supreme Mixed Grain Sattu 500gram  ₹119 (100gram)",
    "slug": "supreme-mixed-grain-sattu-500gram-119",
    "category": "Staples",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Supreme%20mixed%20grain%20sattu%20500gram_-%E2%82%B9119/file_00000000387071faa59aec90238136fd.png",
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/Supreme%20mixed%20grain%20sattu%20500gram_-%E2%82%B9119/file_00000000f4707207851575e56c005ae0.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Supreme Mixed Grain Sattu 500gram  ₹119 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "White Poha 1kg  ₹109 (100gram)",
    "slug": "white-poha-1kg-109",
    "category": "Staples",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/White%20poha%201kg_-%E2%82%B9109/file_00000000952871fa94d0e9203af7f25d.png",
      "/TASTE%20OF%20ODISHA/Kamya-mahakali%20attakala/White%20poha%201kg_-%E2%82%B9109/file_00000000a4a871fabb58a36cedc4428f.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha White Poha 1kg  ₹109 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Chips Powder (veg) 100gm  ₹18 (100gram)",
    "slug": "chips-powder-veg-100gm-18",
    "category": "Masala & Spices",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/MASALA%20AND%20SPICES/CHIPS%20POWDER%20(VEG)%20100GM_-%E2%82%B918/file_0000000020f071f8894c77d56c987b68.png",
      "/TASTE%20OF%20ODISHA/MASALA%20AND%20SPICES/CHIPS%20POWDER%20(VEG)%20100GM_-%E2%82%B918/file_000000004ec8720ba11f2cac64a73995.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Chips Powder (veg) 100gm  ₹18 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Chips Powder(nonveg)  100gm  ₹20 (100gram)",
    "slug": "chips-powder-nonveg-100gm-20",
    "category": "Masala & Spices",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/MASALA%20AND%20SPICES/CHIPS%20POWDER(NONVEG)_-100GM_-%E2%82%B920/file_000000003c307207aad0477dca6d7180.png",
      "/TASTE%20OF%20ODISHA/MASALA%20AND%20SPICES/CHIPS%20POWDER(NONVEG)_-100GM_-%E2%82%B920/file_000000007734720bababc7f4b359f88e.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Chips Powder(nonveg)  100gm  ₹20 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ruchi Biriyani Masala 50gm  ₹60 (100gram)",
    "slug": "ruchi-biriyani-masala-50gm-60",
    "category": "Masala & Spices",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/MASALA%20AND%20SPICES/RUCHI%20BIRIYANI%20MASALA%2050GM_-%E2%82%B960/file_0000000053bc720b9271611ea27b04e7.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ruchi Biriyani Masala 50gm  ₹60 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ruchi Black Pepper 50gm  ₹90 (100gram)",
    "slug": "ruchi-black-pepper-50gm-90",
    "category": "Masala & Spices",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/MASALA%20AND%20SPICES/RUCHI%20BLACK%20PEPPER%2050GM_-%E2%82%B990/file_0000000038a4720b8999e985c9015e51.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ruchi Black Pepper 50gm  ₹90 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ruchi Chicken Masala 50gm  ₹46 (100gram)",
    "slug": "ruchi-chicken-masala-50gm-46",
    "category": "Masala & Spices",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/MASALA%20AND%20SPICES/RUCHI%20CHICKEN%20MASALA%2050gm_-%E2%82%B946/file_0000000098a47209ae05293ee6287079.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ruchi Chicken Masala 50gm  ₹46 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ruchi Chilli Powder  50gm  ₹28 (100gram)",
    "slug": "ruchi-chilli-powder-50gm-28",
    "category": "Masala & Spices",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/MASALA%20AND%20SPICES/RUCHI%20CHILLI%20POWDER_-50GM_-%E2%82%B928/file_000000007b94720ba1232ea578201a7c.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ruchi Chilli Powder  50gm  ₹28 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ruchi Coriander Powder 50gm  ₹21 (100gram)",
    "slug": "ruchi-coriander-powder-50gm-21",
    "category": "Masala & Spices",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/MASALA%20AND%20SPICES/RUCHI%20CORIANDER%20POWDER%2050GM_-%E2%82%B921/Screenshot_20260629_104903_ChatGPT.jpg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ruchi Coriander Powder 50gm  ₹21 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ruchi Cumin Powder 50gm  ₹38 (100gram)",
    "slug": "ruchi-cumin-powder-50gm-38",
    "category": "Masala & Spices",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/MASALA%20AND%20SPICES/RUCHI%20CUMIN%20POWDER%2050GM_-%E2%82%B938/file_00000000c6c8720b8e2a890af0f3fda7.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ruchi Cumin Powder 50gm  ₹38 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ruchi Curry Powder  50gm  ₹42 (100gram)",
    "slug": "ruchi-curry-powder-50gm-42",
    "category": "Masala & Spices",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/MASALA%20AND%20SPICES/RUCHI%20CURRY%20POWDER_-50GM_-%E2%82%B942/file_00000000a1bc7209be62346c1f7e02bb.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ruchi Curry Powder  50gm  ₹42 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ruchi Dalma Powder 50gm  ₹40 (100gram)",
    "slug": "ruchi-dalma-powder-50gm-40",
    "category": "Masala & Spices",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/MASALA%20AND%20SPICES/RUCHI%20DALMA%20POWDER%2050GM_-%E2%82%B940/file_000000000958720b8a3c4d1dfe90c140.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ruchi Dalma Powder 50gm  ₹40 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ruchi Fennel Seeds (panamadhuri) 50gm  ₹26 (100gram)",
    "slug": "ruchi-fennel-seeds-panamadhuri-50gm-26",
    "category": "Masala & Spices",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/MASALA%20AND%20SPICES/RUCHI%20FENNEL%20SEEDS%20(PANAMADHURI)%2050GM_-%E2%82%B926/file_000000005c4071f8917f4c7f8d9b4eba.png",
      "/TASTE%20OF%20ODISHA/MASALA%20AND%20SPICES/RUCHI%20FENNEL%20SEEDS%20(PANAMADHURI)%2050GM_-%E2%82%B926/file_000000006fd4720b92dc7c030f118ac0.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ruchi Fennel Seeds (panamadhuri) 50gm  ₹26 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ruchi Fish Masala 50gm  ₹40 (100gram)",
    "slug": "ruchi-fish-masala-50gm-40",
    "category": "Masala & Spices",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/MASALA%20AND%20SPICES/RUCHI%20FISH%20MASALA%2050GM_-%E2%82%B940/file_0000000076a4720ba157bcf088e5c1e0.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ruchi Fish Masala 50gm  ₹40 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ruchi Garam Masala  50gm  ₹66 (100gram)",
    "slug": "ruchi-garam-masala-50gm-66",
    "category": "Masala & Spices",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/MASALA%20AND%20SPICES/RUCHI%20GARAM%20MASALA_-50GM_-%E2%82%B966/file_00000000bcec7209a49590c7551259b7.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ruchi Garam Masala  50gm  ₹66 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ruchi Jeera Whole 50gm  ₹39 (100gram)",
    "slug": "ruchi-jeera-whole-50gm-39",
    "category": "Masala & Spices",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/MASALA%20AND%20SPICES/RUCHI%20JEERA%20WHOLE%2050GM_-%E2%82%B939/file_00000000addc720b9b2113a2d9909fe2.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ruchi Jeera Whole 50gm  ₹39 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ruchi Meat Masala 50gm  ₹46 (100gram)",
    "slug": "ruchi-meat-masala-50gm-46",
    "category": "Masala & Spices",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/MASALA%20AND%20SPICES/RUCHI%20MEAT%20MASALA%2050GM_-%E2%82%B946/file_000000001c287209a3e3240f540dfc8f.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ruchi Meat Masala 50gm  ₹46 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ruchi Paneer Masala 50gm  ₹40 (100gram)",
    "slug": "ruchi-paneer-masala-50gm-40",
    "category": "Masala & Spices",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/MASALA%20AND%20SPICES/RUCHI%20PANEER%20MASALA%2050GM_-%E2%82%B940/file_000000001ad0720b92b6d1fda1e9b0b4.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ruchi Paneer Masala 50gm  ₹40 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Ruchi Panipuri Masala 50gm  ₹40 (100gram)",
    "slug": "ruchi-panipuri-masala-50gm-40",
    "category": "Masala & Spices",
    "price": 150,
    "images": [
      "/TASTE%20OF%20ODISHA/MASALA%20AND%20SPICES/RUCHI%20PANIPURI%20MASALA%2050GM_-%E2%82%B940/file_00000000df8471f8b2f8acde342c0d35.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Ruchi Panipuri Masala 50gm  ₹40 (100gram) (100gram), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Buguda Mixture (250g)",
    "slug": "buguda-mixture",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Buguda%20mixture/file_00000000466c722f9b20b11b514b2b5d.png",
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Buguda%20mixture/file_00000000fabc722f88bd0dcb338865aa.png",
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
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Chana%20dal/file_00000000508c71f5bd66cbdb6f47fac8.png",
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
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Chaulo%20%20ganthiya%20mixture/file_00000000be9471f59f2a5b360512c46f.png",
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
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Chiwda%20mixture/file_000000007d1c722f88a66179650eca44.png",
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
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Cornflakes%20mixture/file_000000005564720c859f9578083df862.png",
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
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Garlic%20mixture/file_00000000d320720cbadb998b69f1d1ba.png",
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
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Garlic%20sau/file_000000002ccc720ca8fdfce428f394f3.png",
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
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Ginger%20mixture/file_00000000d25872089e2e69f95601cd4f.png",
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
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Khasta%20badan%20pakodi/file_00000000699c7208a0a1dbba2b95936a.png",
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
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Koromonga%20ganthiya/file_00000000449c720890845c7ee8dbdba1.png",
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Koromonga%20ganthiya/file_00000000b62472088884e48553914380.png",
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
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Masala%20boondi/file_000000004dc472088248f5b6e2442df0.png",
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Masala%20boondi/file_000000004fc47208a00e0a76d83dc788.png",
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
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Mini%20nimki/file_00000000d4ec7208848fdb3432c4adf2.png",
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
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Moong%20murukku%20mixture/file_000000000f507208b97d79429d706f15.png",
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Moong%20murukku%20mixture/file_000000008da07208be00773520f6b0e6.png",
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
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Mota%20sau/file_00000000be8c7208acafa062f496f356.png",
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
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Onion%20mixture/file_00000000644c7208ad6600cc2ff78c0b.png",
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Onion%20mixture/WhatsApp%20Image%202026-05-29%20at%206.08.50%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Onion Mixture (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Sadha Boondi (250g)",
    "slug": "sadha-boondi",
    "category": "Mixture",
    "price": 89,
    "images": [
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Sadha%20boondi/file_0000000012fc720ba2e8a09464ec22f0.png",
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
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Sadha%20mixture/file_00000000e7d4720b8466da26fce2fb95.png",
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
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Saru%20sau/Screenshot_20260622_130746_Drive.jpg",
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
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Spicy%20hot%20mixture/file_000000003b2c720b91cc2e4cc7ce47b8.png",
      "/TASTE%20OF%20ODISHA/MIXTURE%20VARIETIES%20250gram_-%E2%82%B989/Spicy%20hot%20mixture/WhatsApp%20Image%202026-05-29%20at%206.16.33%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Spicy Hot Mixture (250g) (250g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Anta Khoja (100g)",
    "slug": "anta-khoja",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Anta%20khoja/file_00000000c4e872079c0569b99cb395a3.png",
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Anta%20khoja/WhatsApp%20Image%202026-05-29%20at%202.29.03%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Anta Khoja (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Belt Murukku (100g)",
    "slug": "belt-murukku",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Belt%20murukku/file_0000000057687208a9ab93421f794a08.png",
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Belt%20murukku/file_0000000070d072088f0eb6f775b599fa.png",
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
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Biri%20murukku/file_00000000461c7208a49cf94bccd9b5d1.png",
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Biri%20murukku/file_000000004fc07208b08d14a5356d472e.png",
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
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Garlic%20masala%20murruku/file_0000000083bc7208a73e95bbadbdf2fd.png",
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Garlic%20masala%20murruku/file_000000008a687208986c9a0ba71c3430.png",
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
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Garlic%20murukku/file_00000000f3347208932be7348509fa4f.png",
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
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Ghagerabadi%20(khudobadi)/file_00000000319472088955d3d5de2ea4c7.png",
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
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Ghagerabadi%20stick%20(Khudobadi)/file_00000000a81872088173a46a3dfd3f28.png",
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
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Karam%20gavvalu%20(kaudi)/file_00000000c6b47208a0d7c0c269f2a5c9.png",
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
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Machamanzi/file_00000000122c722fbf4371dc374b7675.png",
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Machamanzi/file_00000000b4b4722f982bbb85bc4d2dfc.png",
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Machamanzi/file_00000000d93c722f80bd1c93ebeb5540.png"
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
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Masala%20murukku/file_00000000b85c720885ca88aaa0b91755%20(1).png",
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Masala%20murukku/WhatsApp%20Image%202026-05-29%20at%2012.31.56%20AM%20(1).jpeg",
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Masala%20murukku/WhatsApp%20Image%202026-05-29%20at%2012.31.56%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Masala Murukku (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Mini Red Murukku (100g)",
    "slug": "mini-red-murukku",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Mini%20red%20murukku/file_0000000055d4720bb4c7419fc4a3902b.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Mini Red Murukku (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Moong Dal Murukku (100g)",
    "slug": "moong-dal-murukku",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Moong%20dal%20murukku/file_00000000088c7208a29b3ec699c090cd.png",
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
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Rasi%20murukku/file_00000000e9a072089dca9b49b2f0a7ff.png",
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
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Rice%20murukku/file_00000000494c72089e807cc9a6489c2c.png",
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
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Sau%20murukku/file_000000003630720bbe9114005e7d5fcb.png"
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
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Special%20Rice%20%20murukku/file_000000009f087208a6c6aed49a249af4.png",
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Special%20Rice%20%20murukku/file_00000000d66072088fbb92136bf64689.png",
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Special%20Rice%20%20murukku/WhatsApp%20Image%202026-05-29%20at%201.41.20%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Special Rice  Murukku (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Stick Masala Murukku (100g)",
    "slug": "stick-masala-murukku",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Stick%20masala%20murukku/file_0000000084d4720894e0786e98e389ae.png",
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Stick%20masala%20murukku/WhatsApp%20Image%202026-05-29%20at%201.09.40%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Stick Masala Murukku (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Stick Ribbon Murukku (100g)",
    "slug": "stick-ribbon-murukku",
    "category": "Muruku",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Stick%20ribbon%20murukku/file_00000000478872088467ed908e179631.png",
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Stick%20ribbon%20murukku/file_00000000b91072088c668095e0a9a05c.png",
      "/TASTE%20OF%20ODISHA/MURUKU%20100gram_-%E2%82%B939/Stick%20ribbon%20murukku/WhatsApp%20Image%202026-05-29%20at%201.17.45%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Stick Ribbon Murukku (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Garlic Papad (200g)",
    "slug": "garlic-papad",
    "category": "Papaad",
    "price": 99,
    "images": [
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Garlic%20papad/file_0000000037847209a1e7188e95f3ec9b.png",
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Garlic%20papad/file_0000000073247207a0a77f24e6f917ee.png"
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
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Jeera%20papad/file_00000000344072089b710137a4ff0da2.jpg",
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
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Masala%20liabadi/file_00000000c13c72089453a36ccb911ec5.png",
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
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Masala%20moong%20papad/file_00000000bcd87208b28fb1ea70f9a0aa.png",
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
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Masala%20sagoo%20badi/file_000000008d40720895b7564691b491ec.png",
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
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/MINI%20PAPAD/file_000000001a74720884b3ad52e78b5dc7.png",
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/MINI%20PAPAD/file_0000000026c47208824271e8d5cff604.png",
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
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Moong%20papad/file_00000000f4047208a2d401dac45fda0f.png",
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
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Pudina%20kapeda/file_0000000081507208afd04364463279b8.png",
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
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/PUDINA%20PAPAD/file_000000004e047208812ab99395aedb3b.png",
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
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Rasi%20papad/file_0000000033bc7208a253ef3acce3c609.png",
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Rasi%20papad/file_000000009e447208aa66b14f34db291a.png",
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
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Sadha%20liabadi/file_000000009b947208a74dc260fded03ba.png",
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
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Sadha%20white%20kapeda/file_00000000359c72088d115cc9b2c76d25.png",
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
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Sagoobadi/file_00000000cc447208bb4edea9dab6c88c.png",
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
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Special%20chuna%20papad/file_00000000556872088b781b156902adbd.png",
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
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Special%20rasi%20papad/file_0000000092d07208997e8cce24f77177.png",
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Special%20rasi%20papad/file_00000000bf94720883cd1dea03626834.png",
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
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/Tomato%20kapeda/file_00000000e9dc720884c55c6f4cca5dae.png",
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
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/TOMATO%20PAPAD/file_000000003d8c7208859a94f3f899932e.png",
      "/TASTE%20OF%20ODISHA/PAPAD%20VARIETIES%20200gram_-%E2%82%B999/TOMATO%20PAPAD/WhatsApp%20Image%202026-05-27%20at%2010.26.05%20AM%20(1).jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Tomato Papad (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Jai Segadalu (100g)",
    "slug": "jai-segadalu",
    "category": "Segadalu",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/SEGADALU%20100gram_-%E2%82%B939/JAI%20SEGADALU/file_00000000437c7206bc6dfc4a8e9bbbd4.png",
      "/TASTE%20OF%20ODISHA/SEGADALU%20100gram_-%E2%82%B939/JAI%20SEGADALU/WhatsApp%20Image%202026-05-29%20at%2012.30.05%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Jai Segadalu (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Mini Rasi Segudu (100g)",
    "slug": "mini-rasi-segudu",
    "category": "Segadalu",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/SEGADALU%20100gram_-%E2%82%B939/MINI%20RASI%20SEGUDU/file_000000007ae4720b9da869afb2aa186f.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Mini Rasi Segudu (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Rasi Nola Sipulu (100g)",
    "slug": "rasi-nola-sipulu",
    "category": "Segadalu",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/SEGADALU%20100gram_-%E2%82%B939/RASI%20NOLA%20SIPULU/file_000000001758720981ef321210fd8f2b.png",
      "/TASTE%20OF%20ODISHA/SEGADALU%20100gram_-%E2%82%B939/RASI%20NOLA%20SIPULU/WhatsApp%20Image%202026-05-31%20at%2012.33.39%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Rasi Nola Sipulu (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Rasi Segadalu (100g)",
    "slug": "rasi-segadalu",
    "category": "Segadalu",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/SEGADALU%20100gram_-%E2%82%B939/RASI%20SEGADALU/file_000000008058720984a7f016536cfcce.png",
      "/TASTE%20OF%20ODISHA/SEGADALU%20100gram_-%E2%82%B939/RASI%20SEGADALU/WhatsApp%20Image%202026-05-29%20at%2012.36.39%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Rasi Segadalu (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Rasi Sipulu (100g)",
    "slug": "rasi-sipulu",
    "category": "Segadalu",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/SEGADALU%20100gram_-%E2%82%B939/RASI%20SIPULU/file_00000000741472068a3034cab7f6db89.png",
      "/TASTE%20OF%20ODISHA/SEGADALU%20100gram_-%E2%82%B939/RASI%20SIPULU/WhatsApp%20Image%202026-05-29%20at%202.04.31%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Rasi Sipulu (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Small Rasi Sipulu (100g)",
    "slug": "small-rasi-sipulu",
    "category": "Segadalu",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/SEGADALU%20100gram_-%E2%82%B939/SMALL%20RASI%20SIPULU/file_00000000fd80720ba8e201555a07c8d7.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Small Rasi Sipulu (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Stick Rasi Segadalu (100g)",
    "slug": "stick-rasi-segadalu",
    "category": "Segadalu",
    "price": 39,
    "images": [
      "/TASTE%20OF%20ODISHA/SEGADALU%20100gram_-%E2%82%B939/STICK%20RASI%20SEGADALU/file_00000000093872069d257f8461a1ee61.png",
      "/TASTE%20OF%20ODISHA/SEGADALU%20100gram_-%E2%82%B939/STICK%20RASI%20SEGADALU/WhatsApp%20Image%202026-05-29%20at%202.11.04%20PM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Stick Rasi Segadalu (100g) (100g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Adisha (200g)",
    "slug": "adisha",
    "category": "Sweets",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/ADISHA/file_00000000863472068221015270da6fee.png",
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/ADISHA/WhatsApp%20Image%202026-05-31%20at%2012.32.02%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Adisha (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Jaggery Badam Chikki (200g)",
    "slug": "jaggery-badam-chikki",
    "category": "Sweets",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/JAGGERY%20BADAM%20CHIKKI/file_0000000023ec7206896e7b4ebb1ecabb.png",
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/JAGGERY%20BADAM%20CHIKKI/file_00000000fe0c7209bb78e831ecb34385.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Jaggery Badam Chikki (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Jaggery Peanut Ladoo (200g)",
    "slug": "jaggery-peanut-ladoo",
    "category": "Sweets",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/JAGGERY%20PEANUT%20LADOO/file_000000006ef072098166e6cc5303e1b2.png",
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/JAGGERY%20PEANUT%20LADOO/file_00000000d0107209ba6cad96bd908aa3(1).png",
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/JAGGERY%20PEANUT%20LADOO/file_00000000d0107209ba6cad96bd908aa3.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Jaggery Peanut Ladoo (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Jaggery Rasi Chikki (200g)",
    "slug": "jaggery-rasi-chikki",
    "category": "Sweets",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/JAGGERY%20RASI%20CHIKKI/file_000000002fc4720bafa7346a49fd610b.png",
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/JAGGERY%20RASI%20CHIKKI/file_00000000c16c720b85ee04ebf41027e6.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Jaggery Rasi Chikki (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Jaggery Rasi Ladoo (200g)",
    "slug": "jaggery-rasi-ladoo",
    "category": "Sweets",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/JAGGERY%20RASI%20LADOO/file_000000003fb07207b2e88a66fb6e32a5.png",
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/JAGGERY%20RASI%20LADOO/WhatsApp%20Image%202026-05-31%20at%2012.59.57%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Jaggery Rasi Ladoo (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Jaggery Sau Ladu (200g)",
    "slug": "jaggery-sau-ladu",
    "category": "Sweets",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/JAGGERY%20SAU%20LADU/file_00000000cab87206a2041df3ad95fa80(1).png",
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/JAGGERY%20SAU%20LADU/file_00000000cab87206a2041df3ad95fa80.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Jaggery Sau Ladu (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Jaggery Sev Chiki (200g)",
    "slug": "jaggery-sev-chiki",
    "category": "Sweets",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/JAGGERY%20SEV%20CHIKI/file_000000000f187208adb7e1c415be3119.png",
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/JAGGERY%20SEV%20CHIKI/file_0000000057407208a5a59d2140e5176b.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Jaggery Sev Chiki (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Sugar Peanut Chiki (200g)",
    "slug": "sugar-peanut-chiki",
    "category": "Sweets",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/SUGAR%20PEANUT%20CHIKI/file_000000003c447208b6e9642216a242d0.png",
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/SUGAR%20PEANUT%20CHIKI/file_00000000e4807208a2741a568621b279.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Sugar Peanut Chiki (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Sugar Peanut Ladoo (200g)",
    "slug": "sugar-peanut-ladoo",
    "category": "Sweets",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/SUGAR%20PEANUT%20LADOO/file_0000000095747206850602da766b3525.png",
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/SUGAR%20PEANUT%20LADOO/file_00000000aca47209aac94712358b5bed.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Sugar Peanut Ladoo (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Sugar Rasi Chikki (200g)",
    "slug": "sugar-rasi-chikki",
    "category": "Sweets",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/SUGAR%20RASI%20CHIKKI/file_000000000a787209bba53eb7f62af5ec.png",
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/SUGAR%20RASI%20CHIKKI/file_00000000da887209987bea8b32422095.png",
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/SUGAR%20RASI%20CHIKKI/file_00000000efdc72099d09b0e908fb0e81.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Sugar Rasi Chikki (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Sugar Rasi Ladoo (200g)",
    "slug": "sugar-rasi-ladoo",
    "category": "Sweets",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/SUGAR%20RASI%20LADOO/file_00000000f78c71fab2e3671ec83924fb.png",
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/SUGAR%20RASI%20LADOO/WhatsApp%20Image%202026-05-31%20at%2012.58.37%20AM.jpeg"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Sugar Rasi Ladoo (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Sugar Sev Chiki (200g)",
    "slug": "sugar-sev-chiki",
    "category": "Sweets",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/SUGAR%20SEV%20CHIKI/file_00000000b45c720886ab16490fc9b70b.png",
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/SUGAR%20SEV%20CHIKI/file_00000000d90472089546dcf4d92dcf0c.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Sugar Sev Chiki (200g) (200g), carefully prepared and sourced for the highest quality."
  },
  {
    "name": "Sugar Sev Ladu (200g)",
    "slug": "sugar-sev-ladu",
    "category": "Sweets",
    "price": 79,
    "images": [
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/SUGAR%20SEV%20LADU/file_000000001be07209bf1210f9aa9ddbc9.png",
      "/TASTE%20OF%20ODISHA/SWEET%20VARIETIES%20200gram_-%E2%82%B979/SUGAR%20SEV%20LADU/file_00000000b9f87209878fcaadeec7da8b.png"
    ],
    "inStock": true,
    "stockQuantity": 100,
    "origin": "Odisha",
    "description": "Authentic Taste Of Odisha Sugar Sev Ladu (200g) (200g), carefully prepared and sourced for the highest quality."
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
