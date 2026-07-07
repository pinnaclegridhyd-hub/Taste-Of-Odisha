'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Calendar, 
  Home, 
  ShoppingBag,
  ArrowRight,
  ClipboardCheck,
  Heart,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
       const resolvedParams = await params;
       setOrderId(resolvedParams.orderId);
       setLoading(false);
    };
    fetchOrder();
  }, [params]);

  // Delivery Estimate (Today + 5-7 days)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const deliveryDateStr = deliveryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });

  if (loading) {
    return (
      <main className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary/10 border-t-primary rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary pb-32 pt-28">
      <div className="container-sanctuary">
        <div className="max-w-3xl mx-auto space-y-12">
          
          {/* Success Header */}
          <div className="bg-white rounded-xl p-12 md:p-20 border border-heritage-dark/5 shadow-lg text-center relative overflow-hidden animate-fade-up">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>

              <span className="label-text text-primary mb-4">Selection Confirmed</span>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-heritage-dark mb-8 italic leading-tight">
                Heritage <br />Preserved.
              </h1>
              
              <div className="bg-heritage-bone/50 border border-heritage-dark/5 px-6 py-3 rounded-lg mb-10 flex items-center gap-4">
                 <div className="text-left">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-heritage-dark/40 block">Order ID</span>
                    <span className="text-sm font-bold text-heritage-dark tracking-widest">{orderId}</span>
                 </div>
                 <div className="w-px h-6 bg-heritage-dark/10"></div>
                 <button 
                   onClick={() => {
                     navigator.clipboard.writeText(orderId);
                     toast.success('Order ID copied to clipboard');
                   }}
                   className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary"
                   title="Copy Order ID"
                 >
                    <ClipboardCheck className="w-4 h-4" />
                 </button>
              </div>

              <p className="body-text text-lg opacity-70 max-w-lg mx-auto leading-relaxed">
                Your order is being prepared by our local collective. Thank you for supporting the soul of Odisha.
              </p>

              <a
                href={`https://wa.me/918260607991?text=${encodeURIComponent(`Hello Taste of Odisha! I just placed an order. My Order ID is ${orderId}. Please share my order confirmation and shipping updates.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1EBE57] text-white px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                Confirm on WhatsApp
              </a>
            </div>
          </div>

          {/* Logistics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
             <div className="bg-white p-10 rounded-xl border border-heritage-dark/5 shadow-sm space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Truck className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-heritage-dark italic">Delivery Estimate</h3>
                </div>
                <div className="flex items-center gap-4 py-4 bg-heritage-bone/30 rounded-lg px-6">
                   <Calendar className="w-6 h-6 text-primary opacity-40" />
                   <div>
                      <span className="text-xl font-bold text-heritage-dark">{deliveryDateStr}</span>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-heritage-dark/30">Estimated Arrival</p>
                   </div>
                </div>
                <p className="body-text text-xs opacity-60 leading-relaxed italic">
                  Dispatch occurs within 48 hours. Real-time tracking will be sent to your email soon.
                </p>
             </div>

             <div className="bg-heritage-dark rounded-xl p-10 text-heritage-bone space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-10 blur-3xl -mr-16 -mt-16"></div>
                <h3 className="label-text text-primary border-b border-primary/20 pb-4">Our Commitment</h3>
                <ul className="space-y-6">
                   {[
                     { icon: Package, text: 'Rigorous Quality Control' },
                     { icon: ShieldCheck, text: 'Secure Safe Packaging' },
                     { icon: Heart, text: 'Direct Dispatch from Odisha' }
                   ].map((item, idx) => (
                     <li key={idx} className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-primary">
                           <item.icon className="w-3 h-3" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{item.text}</span>
                     </li>
                   ))}
                </ul>
             </div>
          </div>

          {/* Final Actions */}
          <div className="flex flex-col sm:flex-row gap-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
             <Link href="/products" className="flex-1 bg-white border border-heritage-dark/5 p-8 rounded-xl group hover:border-primary transition-all shadow-sm flex items-center justify-between">
                <div>
                   <h4 className="text-lg font-serif font-bold text-heritage-dark mb-1 italic">Explore Collection</h4>
                   <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Back to Shop</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-heritage-bone flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                  <ShoppingBag className="w-5 h-5" />
                </div>
             </Link>
             <Link href="/" className="flex-1 bg-heritage-dark text-white p-8 rounded-xl group transition-all shadow-xl flex items-center justify-between">
                <div>
                   <h4 className="text-lg font-serif font-bold mb-1 italic">Return Home</h4>
                   <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Go to Homepage</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary transition-all">
                  <Home className="w-5 h-5" />
                </div>
             </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
