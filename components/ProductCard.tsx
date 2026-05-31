'use client';

import { getEffectivePrice } from '@/lib/helpers';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, Zap, ShoppingBag, Check, Layers, Award, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imgError, setImgError] = useState(false);

  let displayPrice = product.price;
  if (product.variants && product.variants.length > 0) {
    displayPrice = Math.min(...product.variants.map((v: any) => v.price));
  }

  const effectivePrice = getEffectivePrice(displayPrice, product.discount);
  const hasDiscount = product.discount && product.discount.value > 0;
  const hasVariants = product.variants && product.variants.length > 0;
  
  const discountLabel = hasDiscount 
    ? (product.discount.type === 'percentage' ? `${product.discount.value}% OFF` : `₹${product.discount.value} OFF`)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (hasVariants) {
      window.location.href = `/products/${product.slug}`;
      return;
    }

    setAdding(true);
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '{"items":[]}');
      const productId = product._id?.toString();
      if (!productId) return;

      const items = cart.items || [];
      const existingItem = items.find((item: any) => String(item.productId) === String(productId));

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        items.push({ 
          productId, 
          quantity: 1, 
          variantName: null, 
          price: effectivePrice,
          name: product.name,
          image: product.images[0]
        });
      }

      cart.items = items;
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));
      
      setSuccess(true);
      toast.success(`${product.name} added to bag`);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      toast.error('Failed to update cart');
    } finally {
      setTimeout(() => setAdding(false), 500);
    }
  };

  const isBestSeller = displayPrice > 800 && hasDiscount;
  const fallbackImg = '/placeholder.jpg';

  return (
    <div className="card-premium group flex flex-col h-full bg-white overflow-hidden animate-fade-in">
      <Link href={`/products/${product.slug}`} className="block relative aspect-product">
        {product.images?.[0] || imgError ? (
          <Image
            src={imgError ? fallbackImg : (product.images[0] || fallbackImg)}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-heritage-bone">
             <span className="text-[10px] uppercase font-semibold tracking-widest text-heritage-dark/30">Odisha Piece</span>
          </div>
        )}

        {/* Status Badges - Subtle & Clean */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
           {isBestSeller && (
             <span className="bg-heritage-dark text-white px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                <Zap className="w-3 h-3 text-heritage-gold fill-heritage-gold stroke-[1.5]" /> Best Seller
             </span>
           )}
           {discountLabel && (
             <span className="bg-heritage-red text-white px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest shadow-sm">
                {discountLabel}
             </span>
           )}
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-heritage-bone/80 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="text-heritage-dark/40 text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-heritage-dark/10 rounded-lg">Out of stock</span>
          </div>
        )}
      </Link>

      {/* Content Section - Structured Clarity */}
      <div className="p-4 md:p-5 flex flex-col flex-1">
        <div className="mb-2">
           <span className="text-[10px] font-semibold uppercase tracking-widest text-primary/70">{product.category}</span>
        </div>
        
        <Link href={`/products/${product.slug}`} className="block mb-4">
          <h3 className="text-base md:text-lg font-serif font-semibold text-heritage-dark leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Price & Action - Standard Flow */}
        <div className="mt-auto pt-4 border-t border-heritage-dark/5 flex items-center justify-between gap-4">
           <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                 <span className="text-lg md:text-xl font-bold text-heritage-dark">
                    ₹{effectivePrice}
                 </span>
                 {hasDiscount && (
                    <span className="text-xs text-heritage-dark/30 line-through font-medium">₹{displayPrice}</span>
                 )}
              </div>
           </div>
           
           <button 
              onClick={handleAddToCart}
              disabled={!product.inStock || adding}
              className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all disabled:opacity-20 active:scale-90 ${success ? 'bg-green-600 text-white' : 'bg-heritage-dark text-white hover:bg-primary shadow-sm hover:shadow-md'}`}
              aria-label={hasVariants ? 'View Item' : 'Add to Cart'}
           >
              {success ? <Check className="w-4 h-4" /> : hasVariants ? <ArrowRight className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
           </button>
        </div>
      </div>
    </div>
  );
}

