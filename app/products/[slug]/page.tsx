'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getEffectivePrice } from '@/lib/helpers';
import { IProduct } from '@/models/Product';
import Image from 'next/image';
import { 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Star, 
  Zap,
  ArrowLeft,
  Award,
  Users,
  ChevronRight,
  Heart
} from 'lucide-react';
import { toast } from 'sonner';
import TrustSignals from '@/components/TrustSignals';
import Link from 'next/link';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  
  const [displayImage, setDisplayImage] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddToCart = (isBuyNow = false) => {
    if (!product) return;
    
    // Variant validation
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      toast.error('Please select a variety to proceed');
      return;
    }

    setIsProcessing(true);
    
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '{"items":[]}');
      const productId = product._id?.toString() || (product as any)._id;
      
      if (!productId) {
        toast.error('Product reference invalid');
        setIsProcessing(false);
        return;
      }

      const items = cart.items || [];
      const existingItemIndex = items.findIndex((item: any) => 
        String(item.productId) === String(productId) && 
        item.variantName === (selectedVariant?.name || null)
      );

      if (existingItemIndex > -1) {
        items[existingItemIndex].quantity += quantity;
      } else {
        items.push({ 
          productId, 
          quantity, 
          variantName: selectedVariant?.name || null, 
          price: effectivePrice,
          name: product.name,
          image: selectedVariant?.image || product.images[0]
        });
      }

      cart.items = items;
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Instant synchronization for CartBadge and Sidebar
      window.dispatchEvent(new Event('cart-updated'));
      
      setAdded(true);
      toast.success(`${product.name} added to your collection`);
      
      if (isBuyNow) {
        setTimeout(() => router.push('/cart'), 500);
      } else {
        setTimeout(() => {
          setAdded(false);
          setIsProcessing(false);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      toast.error('Could not archive heritage piece');
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${(await params).slug}`);
        if (!res.ok) throw new Error('Heritage piece not found');
        const data = await res.json();
        const p = data.data;
        setProduct(p);
        
        if (p.variants && p.variants.length > 0) {
          setSelectedVariant(p.variants[0]);
          setDisplayImage(p.variants[0].image || p.images[0]);
        } else {
          setDisplayImage(p.images?.[0] || '');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };
    fetchProduct();
  }, [params]);

  useEffect(() => {
    if (!product) return;
    const targetImage = selectedVariant?.image || product.images[activeImage] || product.images[0];
    if (targetImage === displayImage) return;
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setDisplayImage(targetImage);
      setIsTransitioning(false);
    }, 250); 
    return () => clearTimeout(timer);
  }, [selectedVariant, activeImage, product, displayImage]);

  if (loading) {
    return (
      <main className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-secondary flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-serif font-bold text-heritage-dark mb-6">Product Not Found</h2>
        <button onClick={() => router.push('/products')} className="btn-primary">Back to Collection</button>
      </main>
    );
  }

  const basePrice = selectedVariant ? selectedVariant.price : product.price;
  const effectivePrice = getEffectivePrice(basePrice, product.discount);
  const hasDiscount = effectivePrice < basePrice;
  
  const isBestSeller = basePrice > 800 && hasDiscount;
  const isPopular = !isBestSeller && product.inStock;
  const currentStock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;
  const isOutOfStock = currentStock <= 0;

  return (
    <main className="min-h-screen bg-secondary pb-48 pt-32 overflow-x-hidden">
      <div className="container-sanctuary">
        <div className="mb-10">
            <Link href="/products" className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-heritage-dark/60 hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" /> The Collection
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
            <div className="flex md:flex-col gap-4 overflow-x-auto no-scrollbar md:w-20 px-4 md:px-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                        setActiveImage(idx);
                        setSelectedVariant(null); 
                  }}
                  className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${ (activeImage === idx && !selectedVariant?.image) ? 'border-primary shadow-sm scale-105' : 'border-white hover:border-primary/10 shadow-sm'}`}
                >
                  <Image src={img} alt={`Preview ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
            
            <div className="flex-1 relative aspect-product bg-heritage-bone rounded-xl overflow-hidden border border-heritage-dark/5 shadow-md">
              <div className={`w-full h-full relative transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                {displayImage ? (
                  <Image
                    src={displayImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-heritage-dark/20 text-[10px] uppercase font-bold tracking-widest">Loading...</div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-primary">
                {product.category}
                <div className="h-px flex-1 bg-heritage-dark/5"></div>
                <span className="flex items-center gap-2 italic uppercase"><Award className="w-3.5 h-3.5" /> Authentic Handmade Product</span>
              </div>
              
              <h1 className="h1 lowercase first-letter:uppercase text-heritage-dark">
                {product.name}
              </h1>

              {/* Maker Profile */}
              <div className="bg-white p-6 rounded-xl border border-heritage-dark/5 flex items-start gap-6 shadow-sm">
                 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Users className="w-6 h-6" />
                 </div>
                 <div className="space-y-1">
                    <span className="label-text !text-[9px]">Prepared By</span>
                    <p className="font-bold text-heritage-dark">
                       {product.artisanName || "Odisha Women's Collective"}
                    </p>
                    <p className="text-sm text-heritage-dark/60 font-medium italic">
                       Prepared in Odisha by local self-help groups using authentic home-style recipes.
                    </p>
                 </div>
              </div>
            </div>

            {/* Price & Selection Section */}
            <div className="bg-white p-8 md:p-10 rounded-xl border border-heritage-dark/5 shadow-md space-y-10">
               
               {/* Pricing Row */}
               <div className="flex flex-col gap-4 pb-8 border-b border-heritage-dark/5">
                  <div className="flex items-baseline gap-4">
                     <span className="text-4xl md:text-5xl font-bold text-heritage-dark">₹{effectivePrice}</span>
                     {hasDiscount && (
                       <span className="text-2xl text-heritage-dark/20 line-through font-medium">₹{basePrice}</span>
                     )}
                  </div>
                  {hasDiscount && (
                    <div className="inline-flex items-center gap-2 bg-heritage-red/5 px-4 py-1.5 rounded-full w-fit">
                       <Zap className="w-4 h-4 text-heritage-red fill-heritage-red/20" />
                       <p className="text-[10px] font-bold text-heritage-red uppercase tracking-widest">
                          Savings: ₹{(basePrice - effectivePrice).toFixed(1)} Off
                       </p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${!isOutOfStock ? 'bg-primary animate-pulse' : 'bg-red-400'}`} />
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${!isOutOfStock ? 'text-heritage-dark/60' : 'text-red-400'}`}>
                      {!isOutOfStock 
                        ? currentStock > 5 ? 'Status: Direct Shipping Available' : `Only ${currentStock} Pieces Remaining`
                        : 'Status: Temporarily Out of Stock'
                      }
                    </p>
                  </div>
               </div>

               {/* Variant Selection */}
               {product.variants && product.variants.length > 0 && (
                  <div className="space-y-6">
                    <label className="label-text">Select Variety</label>
                    <div className="grid grid-cols-2 gap-4">
                      {product.variants.map((v: any, i: number) => (
                        <button
                          key={i}
                          onClick={() => setSelectedVariant(v)}
                          className={`p-4 rounded-lg border text-left transition-all ${selectedVariant?.name === v.name ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-heritage-dark border-heritage-dark/10 hover:border-primary/20'}`}
                        >
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-1">{v.name}</p>
                          <p className="text-lg font-bold">₹{v.price}</p>
                        </button>
                      ))}
                    </div>
                  </div>
               )}

               {/* Quantity & Actions */}
               <div className="space-y-6 pt-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center justify-between bg-heritage-bone/50 border border-heritage-dark/10 rounded-lg px-6 py-3 flex-shrink-0 min-w-[140px]">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-2xl font-light text-heritage-dark/40 hover:text-primary transition-all disabled:opacity-10" disabled={quantity <= 1}>−</button>
                      <span className="text-lg font-bold text-heritage-dark">{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(currentStock || 10, quantity + 1))} className="text-2xl font-light text-heritage-dark/40 hover:text-primary transition-all disabled:opacity-10" disabled={quantity >= (currentStock || 10)}>+</button>
                    </div>
                    
                    <button 
                      onClick={() => handleAddToCart(false)}
                      disabled={isOutOfStock || added || isProcessing}
                      className={`btn-primary flex-1 flex items-center justify-center gap-3 transition-all duration-300 ${added ? 'bg-green-600 border-green-600 scale-[0.98]' : 'hover:shadow-lg'}`}
                    >
                      <ShoppingCart className={`w-5 h-5 ${isProcessing ? 'animate-bounce' : ''}`} />
                      {isProcessing ? 'Archiving...' : added ? 'Added to Bag' : 'Add to Cart'}
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => handleAddToCart(true)}
                    disabled={isOutOfStock || isProcessing}
                    className="w-full btn-outline py-5 rounded-lg flex items-center justify-center gap-4 hover:bg-heritage-dark hover:text-white transition-all disabled:opacity-20 group"
                  >
                     <CreditCard className={`w-5 h-5 transition-transform ${isProcessing ? 'scale-110' : 'group-hover:scale-110'}`} />
                     {isProcessing ? 'Preparing Checkout...' : 'Buy it Now'}
                  </button>
               </div>
            </div>

            {/* Meta Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[
                 { icon: Truck, title: 'Direct Shipping', sub: 'Est: 4-6 Business Days' },
                 { icon: ShieldCheck, title: 'Secure Payment', sub: 'Razorpay Secure Portal' },
               ].map((item, i) => (
                 <div key={i} className="flex items-start gap-5 p-6 rounded-xl bg-white border border-heritage-dark/5 shadow-sm">
                    <item.icon className="w-6 h-6 text-primary mt-1" />
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-heritage-dark">{item.title}</p>
                       <p className="text-[10px] text-primary font-medium uppercase tracking-widest opacity-60">{item.sub}</p>
                    </div>
                 </div>
               ))}
            </div>

            {/* Narrative Description */}
            <div className="pt-16 border-t border-heritage-dark/10 space-y-8">
              <span className="label-text">The Story</span>
              <div className="space-y-6">
                {product.description?.split('\n').map((para, i) => (
                  <p key={i} className="text-lg md:text-xl text-heritage-dark/80 leading-relaxed font-medium italic border-l-2 border-primary/20 pl-6">
                    {para}
                  </p>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Unified Signals */}
        <div className="mt-40">
           <TrustSignals />
        </div>
      </div>
    </main>
  );
}
