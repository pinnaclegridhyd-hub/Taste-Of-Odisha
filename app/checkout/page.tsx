'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckoutPayload, ShippingInfo } from '@/lib/types';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  MapPin,
  User,
  Phone,
  CreditCard,
  Lock,
  ChevronRight,
  Zap
} from 'lucide-react';
import { getEffectivePrice } from '@/lib/helpers';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const [formData, setFormData] = useState<ShippingInfo>({
    name: '',
    mobile: '',
    pincode: '',
    city: '',
    state: '',
    addressLine: '',
  });

  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const fetchCheckoutDetails = async () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '{"items":[]}');
        if (!cart.items || cart.items.length === 0) {
          router.push('/products');
          return;
        }

        const res = await fetch('/api/products?category=all');
        const data = await res.json();
        const products = cart.items.map((cartItem: any) => {
          const product = data.data?.find((p: any) => p._id.toString() === cartItem.productId.toString());
          if (!product) return null;
          let finalBasePrice = product.price;
          if (cartItem.variantName && product.variants) {
            const variant = product.variants.find((v: any) => v.name === cartItem.variantName);
            if (variant) finalBasePrice = variant.price;
          }
          return { 
            ...product, 
            quantity: cartItem.quantity, 
            variantName: cartItem.variantName,
            effectiveBasePrice: finalBasePrice 
          };
        }).filter(Boolean);
        setCartItems(products);
      } catch (err) {
        setError('Failed to load checkout data');
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };
    fetchCheckoutDetails();

    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCoupon) {
      setCouponCode(savedCoupon);
      // We'll re-validate shortly or use the summary logic
    }
  }, [router]);

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (getEffectivePrice(item.effectiveBasePrice, item.discount) * item.quantity);
  }, 0);
  const deliveryCharge = subtotal >= 999 ? 0 : 99;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (!formData.name || !formData.pincode || !formData.city || !formData.state || !formData.addressLine || !phoneNumber) {
        setError('Complete all details to proceed');
        setSubmitting(false);
        return;
      }
      const cart = JSON.parse(localStorage.getItem('cart') || '{"items":[]}');
      const payload: CheckoutPayload = {
        items: cart.items,
        shippingInfo: { ...formData, mobile: phoneNumber },
        phoneNumber,
        couponCode: couponCode || undefined,
      };
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create your order');
        setSubmitting(false);
        return;
      }
      localStorage.setItem('currentOrder', JSON.stringify({
        orderId: data.data.orderId,
        razorpayOrderId: data.data.razorpayOrderId,
        amount: data.data.amount,
      }));
      router.push('/payment');
    } catch (err) {
      setError('A connection error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary/10 border-t-primary rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary pb-32 pt-28">
      <div className="bg-heritage-bone border-b border-heritage-dark/5 py-12 md:py-20 mb-12">
        <div className="container-sanctuary">
           <div className="mb-6">
              <Link href="/cart" className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-heritage-dark/60 hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Cart
              </Link>
           </div>
           <h1 className="h1 lowercase first-letter:uppercase text-heritage-dark">Secure <span className="italic font-normal text-primary">Checkout.</span></h1>
        </div>
      </div>

      <div className="container-sanctuary">
        {error && (
          <div className="bg-heritage-red/5 border border-heritage-red/10 text-heritage-red px-6 py-4 rounded-xl mb-12 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest animate-fade-up">
            <Lock className="w-4 h-4" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <section className="bg-white p-8 md:p-12 rounded-xl border border-heritage-dark/5 shadow-sm">
                <div className="flex items-center gap-4 mb-10">
                  <User className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-heritage-dark px-4 border-l-2 border-primary">Your Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="label-text ml-1 opacity-40">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Recipient Name" className="w-full px-6 py-4 bg-heritage-bone/50 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium" required />
                  </div>
                  <div className="space-y-3">
                    <label className="label-text ml-1 opacity-40">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-heritage-dark/20" />
                      <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="10-digit mobile" className="w-full pl-14 pr-6 py-4 bg-heritage-bone/50 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium" required />
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 md:p-12 rounded-xl border border-heritage-dark/5 shadow-sm">
                <div className="flex items-center gap-4 mb-10">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-heritage-dark px-4 border-l-2 border-primary">Shipping Address</h2>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="label-text ml-1 opacity-40">Full Address</label>
                    <textarea name="addressLine" value={formData.addressLine} onChange={handleInputChange} placeholder="House No, Street, Landmark..." rows={3} className="w-full px-6 py-4 bg-heritage-bone/50 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium resize-none leading-relaxed" required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <label className="label-text ml-1 opacity-40">City</label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="w-full px-6 py-4 bg-heritage-bone/50 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium" required />
                    </div>
                    <div className="space-y-3">
                      <label className="label-text ml-1 opacity-40">State</label>
                      <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" className="w-full px-6 py-4 bg-heritage-bone/50 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium" required />
                    </div>
                    <div className="space-y-3">
                      <label className="label-text ml-1 opacity-40">Pincode</label>
                      <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="6-digits" className="w-full px-6 py-4 bg-heritage-bone/50 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium" required />
                    </div>
                  </div>
                </div>
              </section>
            </form>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="bg-white rounded-xl p-8 border border-heritage-dark/5 shadow-md space-y-8">
              <h2 className="label-text pb-4 border-b border-heritage-dark/5">Order Summary</h2>

              <div className="space-y-6 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                {cartItems.map((item, i) => {
                  const price = getEffectivePrice(item.effectiveBasePrice, item.discount);
                  return (
                    <div key={i} className="flex justify-between items-start gap-4 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold text-heritage-dark uppercase tracking-tight">{item.name}</p>
                        {item.variantName && (
                          <div className="flex items-center gap-1.5">
                            <Zap className="w-2.5 h-2.5 text-primary" />
                            <span className="text-[9px] font-bold text-primary/60 uppercase tracking-widest">{item.variantName}</span>
                          </div>
                        )}
                        <p className="text-[9px] font-bold text-heritage-dark/30 uppercase tracking-widest">₹{price} × {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-heritage-dark">₹{(price * item.quantity).toFixed(0)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4 pt-6 border-t border-heritage-dark/5">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-heritage-dark/40">
                  <span>Subtotal</span>
                  <span className="text-heritage-dark">₹{subtotal.toFixed(0)}</span>
                </div>
                
                {couponCode && (
                   <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-primary">
                    <span>Discount ({couponCode})</span>
                    <span>Applied</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-heritage-dark/40">
                  <span>Shipping Info</span>
                  <span className={`${deliveryCharge === 0 ? 'text-primary' : 'text-heritage-dark'}`}>
                    {deliveryCharge === 0 ? 'Free Shipping' : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-heritage-dark/5">
                  <span className="label-text">Order Total</span>
                  <span className="text-[9px] font-bold text-heritage-dark/20 uppercase tracking-widest mr-2">(Re-calculating on secure server)</span>
                  <span className="text-3xl font-bold text-heritage-dark italic">Finalized at Pay</span>
                </div>
              </div>

              <button onClick={() => handleSubmit(null as any)} disabled={submitting} className="w-full btn-primary py-5 rounded-lg flex items-center justify-center gap-3 disabled:opacity-50">
                {submitting ? 'Processing...' : <><Lock className="w-4 h-4" /> Buy Now</>}
              </button>

              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-heritage-dark/5 opacity-30">
                 <div className="flex flex-col items-center gap-2 text-center">
                    <ShieldCheck className="w-4 h-4 text-heritage-dark" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">SSL Encrypted</span>
                 </div>
                 <div className="flex flex-col items-center gap-2 text-center">
                    <CreditCard className="w-4 h-4 text-heritage-dark" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Secured Gateway</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
