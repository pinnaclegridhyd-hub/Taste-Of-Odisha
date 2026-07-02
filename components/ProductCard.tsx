'use client';

import { getEffectivePrice } from '@/lib/helpers';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  let displayPrice = product.price;
  if (product.variants && product.variants.length > 0) {
    displayPrice = Math.min(...product.variants.map((v: any) => v.price));
  }

  const effectivePrice = getEffectivePrice(displayPrice, product.discount);
  const hasDiscount = product.discount && product.discount.value > 0;
  const hasVariants = product.variants && product.variants.length > 0;

  const discountPercent = hasDiscount
    ? (product.discount.type === 'percentage'
        ? product.discount.value
        : Math.round((product.discount.value / displayPrice) * 100))
    : 0;

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

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(!wishlisted);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const fallbackImg = '/placeholder.jpg';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderRadius: '12px',
        border: '1px solid rgba(45, 27, 27, 0.05)',
        overflow: 'hidden',
        isolation: 'isolate',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
      }}
      className="group hover:shadow-md hover:border-primary/20"
    >
      {/* ====== IMAGE AREA — position:relative container for absolute children ====== */}
      <Link
        href={`/products/${product.slug}`}
        style={{
          display: 'block',
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          backgroundColor: '#F8F6F3',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Product Image */}
        {(product.images?.[0] && !imgError) ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            style={{ objectFit: 'contain', padding: '16px' }}
            sizes="(max-width: 768px) 50vw, 25vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F0E8' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(45,27,27,0.3)' }}>No Image</span>
          </div>
        )}

        {/* Wishlist Heart — top-left of image area */}
        <button
          onClick={handleWishlist}
          aria-label="Add to wishlist"
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 5,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.9)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            transition: 'all 0.2s',
          }}
        >
          <Heart
            className={`w-4 h-4 ${wishlisted ? 'fill-red-600 text-red-600' : 'text-gray-400'}`}
            style={{ transition: 'color 0.2s, fill 0.2s' }}
          />
        </button>

        {/* Discount Badge — top-left below heart */}
        {hasDiscount && (
          <span
            style={{
              position: 'absolute',
              top: '48px',
              left: '10px',
              zIndex: 5,
              backgroundColor: '#8B1D1D',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 700,
              lineHeight: '16px',
            }}
          >
            {discountPercent}% OFF
          </span>
        )}

        {/* ADD Button — bottom-right of image area */}
        {product.inStock && (
          <button
            onClick={handleAddToCart}
            disabled={adding}
            aria-label={hasVariants ? 'View Options' : 'Add to Cart'}
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              zIndex: 5,
              padding: '5px 16px',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: success ? '2px solid #16a34a' : '2px solid #8B1D1D',
              borderRadius: '6px',
              backgroundColor: success ? '#16a34a' : '#fff',
              color: success ? '#fff' : '#8B1D1D',
              cursor: 'pointer',
              transition: 'all 0.2s',
              lineHeight: '20px',
            }}
            className="hover:bg-primary hover:text-white active:scale-95"
          >
            {success ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check style={{ width: '14px', height: '14px' }} /> Added
              </span>
            ) : (
              'ADD'
            )}
          </button>
        )}

        {/* SOLD Overlay */}
        {!product.inStock && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              backgroundColor: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(1px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'rgba(45,27,27,0.4)',
                padding: '6px 16px',
                border: '1px solid rgba(45,27,27,0.15)',
                borderRadius: '4px',
                backgroundColor: 'rgba(255,255,255,0.8)',
              }}
            >
              SOLD
            </span>
          </div>
        )}
      </Link>

      {/* ====== INFO AREA — normal flow, no absolute positioning ====== */}
      <div
        style={{
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          flexGrow: 1,
          boxSizing: 'border-box',
        }}
      >
        {/* Price Row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#8B1D1D' }}>
            ₹ {effectivePrice}
          </span>
          {hasDiscount && (
            <span style={{ fontSize: '12px', color: '#aaa', textDecoration: 'line-through' }}>
              ₹{displayPrice}
            </span>
          )}
        </div>

        {/* Discount % */}
        {hasDiscount && (
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#16a34a' }}>
            {discountPercent}% OFF
          </span>
        )}

        {/* Product Name — 2 lines max */}
        <Link href={`/products/${product.slug}`}>
          <h3
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#2D1B1B',
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: '36px',
              margin: 0,
              transition: 'color 0.2s',
            }}
            className="group-hover:text-primary"
          >
            {product.name}
          </h3>
        </Link>

        {/* Variant / Weight Selector */}
        {hasVariants && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <select
              onClick={(e) => e.stopPropagation()}
              style={{
                fontSize: '11px',
                color: 'rgba(45,27,27,0.5)',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontWeight: 500,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {product.variants.map((v: any, i: number) => (
                <option key={i} value={v.name}>{v.name}</option>
              ))}
            </select>
            <ChevronDown style={{ width: '12px', height: '12px', color: 'rgba(45,27,27,0.3)' }} />
          </div>
        )}
      </div>
    </div>
  );
}
