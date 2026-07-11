'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { IProduct } from '@/models/Product';
import { getEffectivePrice } from '@/lib/helpers';
import StockBadge from './StockBadge';
import QualityBadge from './QualityBadge';
import ArtisanHighlight from './ArtisanHighlight';
import DeliveryBadge from './DeliveryBadge';
import { ShoppingBag, Minus, Plus, ShieldCheck, Heart, Share2 } from 'lucide-react';
import { getDisplayImageUrl } from '@/lib/image-url';

interface ProductDetailProps {
  product: any;
  onAddToCart: (product: any, quantity: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const effectivePrice = getEffectivePrice(product.price, product.discount);
  const hasDiscount = product.discount && product.discount.value > 0;

  const handleQuantityChange = (type: 'inc' | 'dec') => {
    if (type === 'inc') {
      if (quantity < (product.stockQuantity || 10)) {
        setQuantity(prev => prev + 1);
      }
    } else {
      if (quantity > 1) {
        setQuantity(prev => prev - 1);
      }
    }
  };

  return (
    <div className="container-sanctuary py-12 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">
        {/* Image Gallery */}
        <div className="space-y-6 lg:sticky lg:top-32">
          <div className="aspect-[4/5] relative rounded-xl overflow-hidden bg-white shadow-lg border border-heritage-dark/5 group">
            <Image
              src={getDisplayImageUrl(product.images[activeImage] || 'https://images.unsplash.com/photo-1544654803-b69140b285a1?auto=format&fit=crop&q=80&w=800')}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {hasDiscount && (
              <div className="absolute top-6 left-6 bg-primary text-white px-5 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-xl">
                {product.discount.type === 'percentage' 
                  ? `${product.discount.value}% Heritage Offer` 
                  : `₹${product.discount.value} Reserved`}
              </div>
            )}
            <div className="absolute bottom-6 right-6 flex gap-3">
               <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-heritage-dark shadow-sm hover:bg-white transition-colors">
                  <Heart className="w-4 h-4" />
               </button>
               <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-heritage-dark shadow-sm hover:bg-white transition-colors">
                  <Share2 className="w-4 h-4" />
               </button>
            </div>
          </div>
          
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-24 h-28 rounded-xl overflow-hidden flex-shrink-0 border transition-all duration-300 ${
                    activeImage === idx ? 'border-primary shadow-md' : 'border-heritage-dark/5 opacity-60'
                  }`}
                >
                  <Image src={getDisplayImageUrl(img)} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
               <span className="label-text text-primary">
                  {product.category} archive
               </span>
               <div className="w-1 h-1 rounded-full bg-heritage-dark/10"></div>
               <StockBadge quantity={product.stockQuantity} inStock={product.inStock} />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-heritage-dark leading-tight italic">
              {product.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-serif font-bold text-primary italic">₹{effectivePrice}</span>
                {hasDiscount && (
                  <span className="text-lg text-heritage-dark/30 line-through font-medium">₹{product.price}</span>
                )}
              </div>
              <div className="h-6 w-px bg-heritage-dark/10"></div>
              <DeliveryBadge free={effectivePrice >= 999} />
            </div>
          </div>

          <div className="space-y-8">
             <div className="flex items-center gap-4 text-primary/30">
                <div className="h-px flex-1 bg-heritage-dark/5"></div>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] italic text-center">
                   "Preserving the soul of Odisha"
                </p>
                <div className="h-px flex-1 bg-heritage-dark/5"></div>
             </div>
             <p className="body-text text-lg leading-relaxed italic opacity-70">
               {product.description}
             </p>
          </div>

          <div className="space-y-10 pt-10 border-t border-heritage-dark/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4 text-left">
                  <span className="label-text text-heritage-dark/30">Identity Validation</span>
                  <QualityBadge />
               </div>
               <div className="space-y-4 text-left">
                  <span className="label-text text-heritage-dark/30">The Creator</span>
                  <ArtisanHighlight name={product.artisanName} />
               </div>
            </div>

            {/* Selection Section */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center bg-heritage-bone rounded-lg h-16 px-4 border border-heritage-dark/5">
                <button
                  onClick={() => handleQuantityChange('dec')}
                  className="w-10 h-10 flex items-center justify-center text-heritage-dark/30 hover:text-primary transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-lg font-serif font-bold text-heritage-dark italic">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('inc')}
                  className="w-10 h-10 flex items-center justify-center text-heritage-dark/30 hover:text-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => onAddToCart(product, quantity)}
                disabled={!product.inStock || product.stockQuantity <= 0}
                className="btn-primary flex-1 h-16 flex items-center justify-center gap-4 group disabled:opacity-50"
              >
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
                {product.inStock ? 'Acquire Heritage piece' : 'Archive Depleted'}
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-8 pt-12 border-t border-heritage-dark/5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-heritage-bone flex items-center justify-center text-primary shadow-inner">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                 <p className="text-[11px] font-bold text-heritage-dark uppercase tracking-widest">Preserved</p>
                 <p className="text-[10px] text-heritage-dark/40 italic leading-snug font-medium">Supporting the rural artisan collective of Odisha.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-heritage-bone flex items-center justify-center text-primary shadow-inner">
                <Heart className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                 <p className="text-[11px] font-bold text-heritage-dark uppercase tracking-widest">Ethical</p>
                 <p className="text-[10px] text-heritage-dark/40 italic leading-snug font-medium">Verified heritage standards for 100% authenticity.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
