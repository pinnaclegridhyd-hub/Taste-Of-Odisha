import React from 'react';
import { getDeliveryCharge } from '@/lib/helpers';
import { ShieldCheck, ArrowRight, Zap } from 'lucide-react';

interface CartSummaryProps {
  subtotal: number;
  onCheckout?: () => void;
  isLoading?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  onCheckout,
  isLoading = false,
}) => {
  const deliveryCharge = getDeliveryCharge(subtotal);
  const total = subtotal + deliveryCharge;
  const FREE_DELIVERY_THRESHOLD = 999;

  return (
    <div className="bg-white rounded-xl p-8 lg:p-10 sticky top-32 border border-heritage-dark/5 shadow-sm">
      <h3 className="text-2xl font-serif font-bold text-heritage-dark mb-8 italic">Order Summary</h3>
      
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center text-sm">
          <span className="label-text opacity-40">Subtotal</span>
          <span className="font-serif font-bold text-heritage-dark italic">₹{subtotal.toFixed(0)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="label-text opacity-40">Shipping Info</span>
          <span className={deliveryCharge === 0 ? 'text-green-700 font-bold label-text' : 'font-serif font-bold text-heritage-dark italic'}>
            {deliveryCharge === 0 ? 'FREE SHIPPING' : `₹${deliveryCharge.toFixed(0)}`}
          </span>
        </div>
        
        {deliveryCharge > 0 && (
          <div className="bg-heritage-bone/50 border border-heritage-dark/5 p-4 rounded-lg flex items-center gap-3 animate-fade-up">
             <Zap className="w-4 h-4 text-primary" />
             <p className="text-[10px] text-primary font-bold uppercase tracking-widest leading-relaxed">
               Add ₹{(FREE_DELIVERY_THRESHOLD - subtotal).toFixed(0)} for <span className="underline underline-offset-4">Free Shipping</span>
             </p>
          </div>
        )}
      </div>

      <div className="border-t border-heritage-dark/5 pt-8 mb-10">
        <div className="flex justify-between items-end">
          <span className="text-lg font-serif font-bold text-heritage-dark italic">Order Total</span>
          <div className="text-right">
            <p className="text-3xl font-serif font-bold text-primary italic tracking-tighter">₹{total.toFixed(0)}</p>
            <p className="text-[9px] text-heritage-dark/30 mt-1 font-bold uppercase tracking-[0.2em]">Authentic Products</p>
          </div>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={isLoading || subtotal === 0}
        className="btn-primary w-full !py-5 flex items-center justify-center gap-3 group transition-all"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <>
            Proceed to Checkout
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
      
      <div className="mt-10 pt-8 border-t border-heritage-dark/5 flex flex-col items-center gap-6">
        <div className="flex items-center gap-3 label-text text-heritage-dark/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          Secure Payment Portal
        </div>
        
        <div className="flex items-center gap-4 opacity-10 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
           <span className="text-[8px] font-bold tracking-widest uppercase">Razorpay</span>
           <span className="text-[8px] font-bold tracking-widest uppercase">Visa</span>
           <span className="text-[8px] font-bold tracking-widest uppercase">Mastercard</span>
           <span className="text-[8px] font-bold tracking-widest uppercase">UPI</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
