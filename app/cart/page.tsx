'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getEffectivePrice } from '@/lib/helpers';
import { Trash2, Plus, Minus, ShieldCheck, Truck, ShoppingBag, ArrowLeft, Heart, Lock, Zap, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState<any>(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '{"items":[]}');
        if (!cart.items || cart.items.length === 0) {
          setCartItems([]);
          setLoading(false);
          return;
        }
        const res = await fetch(`/api/products?category=all`);
        const data = await res.json();
        const products = cart.items.map((cartItem: any) => {
           const product = data.data?.find((p: any) => String(p._id) === String(cartItem.productId));
           if (!product) return null;
           let finalBasePrice = product.price;
           if (cartItem.variantName && product.variants) {
              const variant = product.variants.find((v: any) => v.name === cartItem.variantName);
              if (variant) finalBasePrice = variant.price;
           }
           return { 
              ...product, 
              cartQuantity: cartItem.quantity, 
              selectedVariantName: cartItem.variantName,
              effectiveBasePrice: finalBasePrice 
           };
        }).filter(Boolean);
        setCartItems(products);
      } catch (err) {
        toast.error('Failed to load your heritage selection');
      } finally {
        setTimeout(() => setLoading(false), 250);
      }
    };
    fetchCartDetails();
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCoupon) setCouponCode(savedCoupon);
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setValidating(true);
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '{"items":[]}');
      const res = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart.items, couponCode })
      });
      const data = await res.json();
      if (res.ok) {
        setCouponData(data.data);
        localStorage.setItem('appliedCoupon', couponCode);
        toast.success(`Authentic Code Applied: ${couponCode}`);
      } else {
        setCouponData(null);
        toast.error(data.error || 'Invalid heritage code');
      }
    } catch (err) {
      toast.error('Validation system busy');
    } finally {
      setValidating(false);
    }
  };

  const updateQuantity = (productId: string, variantName: string | null, newQuantity: number) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '{"items":[]}');
    const items = cart.items || [];
    const itemIdx = items.findIndex((i: any) => 
      String(i.productId) === String(productId) && 
      i.variantName === (variantName || null)
    );
    if (itemIdx > -1) {
      if (newQuantity <= 0) {
        items.splice(itemIdx, 1);
        setCartItems(prev => prev.filter((p) => !(String(p._id) === String(productId) && p.selectedVariantName === variantName)));
        toast.info('Item removed from selection');
      } else {
        items[itemIdx].quantity = newQuantity;
        setCartItems(prev => prev.map(p => (String(p._id) === String(productId) && p.selectedVariantName === variantName) ? { ...p, cartQuantity: newQuantity } : p));
      }
    }
    cart.items = items;
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const subtotal = cartItems.reduce((sum, p) => sum + getEffectivePrice(p.effectiveBasePrice, p.discount) * p.cartQuantity, 0);
  const deliveryCharge = subtotal >= 999 ? 0 : 99;

  if (loading) {
    return (
      <main className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary/10 border-t-primary rounded-full animate-spin"></div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-secondary flex flex-col items-center justify-center p-6 text-center gap-8">
        <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center animate-pulse">
           <ShoppingBag className="w-12 h-12 text-primary opacity-30" />
        </div>
        <h1 className="h1 lowercase first-letter:uppercase text-heritage-dark">Your manifest <br/><span className="italic font-normal text-primary">is empty.</span></h1>
        <p className="body-text max-w-sm">Start your journey through our authentic Odisha collections and preserve ancient legacies.</p>
        <Link href="/products" className="btn-primary">
           Explore The Boutique
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary pb-32 pt-28">
      <div className="bg-heritage-bone border-b border-heritage-dark/5 py-12 md:py-20 mb-12">
        <div className="container-sanctuary">
           <div className="mb-6">
              <Link href="/products" className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-heritage-dark/60 hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" /> Continue Discovery
              </Link>
           </div>
           <h1 className="h1 lowercase first-letter:uppercase text-heritage-dark">Selected <span className="italic font-normal text-primary">Manifest.</span></h1>
        </div>
      </div>

      <div className="container-sanctuary">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-4 py-4 border-b border-heritage-dark/5">
                <span className="label-text">{cartItems.length} Masterpieces in Manifest</span>
                <div className="h-px flex-grow bg-heritage-dark/5"></div>
            </div>

            {cartItems.map((product, idx) => {
              const price = getEffectivePrice(product.effectiveBasePrice, product.discount);
              return (
                <div key={`${product._id}-${product.selectedVariantName || idx}`} className="bg-white rounded-xl p-6 border border-heritage-dark/5 shadow-sm flex flex-col md:flex-row gap-8 items-center group transition-all">
                  <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-lg overflow-hidden bg-heritage-bone flex-shrink-0 border border-heritage-dark/5">
                    <Image src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} fill className="object-cover transition-transform duration-[2s] group-hover:scale-110" />
                  </div>

                  <div className="flex-1 space-y-4 w-full">
                    <div className="flex justify-between items-start gap-4">
                       <div className="space-y-1">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-primary">{product.category}</span>
                          <h3 className="text-xl font-bold text-heritage-dark">{product.name}</h3>
                          {product.selectedVariantName && (
                             <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-heritage-dark/60">
                                <Zap className="w-3 h-3 text-primary fill-primary/20" /> Variety: {product.selectedVariantName}
                             </div>
                          )}
                       </div>
                       <button onClick={() => updateQuantity(product._id, product.selectedVariantName, 0)} className="p-2 text-heritage-dark/30 hover:text-heritage-red transition-all">
                          <Trash2 className="w-5 h-5" />
                       </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-heritage-dark/5">
                       <div className="flex items-center gap-8 bg-heritage-bone px-6 py-2 rounded-lg border border-heritage-dark/5">
                          <button onClick={() => updateQuantity(product._id, product.selectedVariantName, product.cartQuantity - 1)} className="text-xl font-light text-heritage-dark/40 hover:text-primary disabled:opacity-10" disabled={product.cartQuantity <= 1}>−</button>
                          <span className="font-bold text-heritage-dark">{product.cartQuantity}</span>
                          <button onClick={() => updateQuantity(product._id, product.selectedVariantName, product.cartQuantity + 1)} className="text-xl font-light text-heritage-dark/40 hover:text-primary">+</button>
                       </div>
                       <div className="text-right">
                          <p className="text-xl font-bold text-heritage-dark">₹{(price * product.cartQuantity).toFixed(0)}</p>
                          <p className="text-[9px] font-bold text-heritage-dark/20 uppercase tracking-widest italic">Unit Auth: ₹{price}</p>
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing Summary Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-xl p-8 border border-heritage-dark/5 shadow-md space-y-8">
              <h2 className="label-text pb-4 border-b border-heritage-dark/5">Price Manifest Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-heritage-dark/40">
                  <span>Manifest Subtotal</span>
                  <span className="text-heritage-dark">₹{subtotal.toFixed(0)}</span>
                </div>
                
                {couponData && couponData.discount > 0 && (
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-primary">
                    <div className="flex items-center gap-2">
                       <span>Authentic Discount</span>
                       <button onClick={() => { setCouponData(null); setCouponCode(''); localStorage.removeItem('appliedCoupon'); }} className="text-[8px] underline opacity-50 hover:opacity-100">(Remove)</button>
                    </div>
                    <span>-₹{couponData.discount.toFixed(0)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-heritage-dark/40">
                  <span>Heritage Passage</span>
                  <span className={`${(couponData ? couponData.deliveryCharge : deliveryCharge) === 0 ? 'text-primary' : 'text-heritage-dark'}`}>
                    {(couponData ? couponData.deliveryCharge : deliveryCharge) === 0 ? 'Complimentary' : `₹${couponData ? couponData.deliveryCharge : deliveryCharge}`}
                  </span>
                </div>
              </div>

              {/* Promo Code Input */}
              {!couponData && (
                <div className="space-y-3 pt-6 border-t border-heritage-dark/5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-heritage-dark/40">Heritage Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="E.G. ODISHA10"
                      className="flex-1 bg-heritage-bone border border-heritage-dark/10 rounded px-3 py-2 text-xs uppercase tracking-widest focus:border-primary outline-none transition-all"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={validating || !couponCode}
                      className="bg-heritage-dark text-white px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all disabled:opacity-20"
                    >
                      {validating ? '...' : 'Apply'}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-6 border-t border-heritage-dark/5 text-right">
                <span className="label-text">Final Manifest Total</span>
                <span className="text-4xl md:text-5xl font-bold text-heritage-dark">₹{(couponData ? couponData.total : (subtotal + deliveryCharge)).toFixed(0)}</span>
              </div>

              <button 
                onClick={() => router.push('/checkout')} 
                className="w-full btn-primary py-5 rounded-lg flex items-center justify-center gap-3"
              >
                Purchase Manifest <ChevronRight className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-heritage-dark/5 opacity-30">
                 <div className="flex flex-col items-center gap-3 text-center">
                    <Lock className="w-4 h-4 text-heritage-dark" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">SSL Verified</span>
                 </div>
                 <div className="flex flex-col items-center gap-3 text-center">
                    <Truck className="w-4 h-4 text-heritage-dark" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Artisan Courier</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
