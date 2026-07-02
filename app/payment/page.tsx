'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, ShieldCheck, CreditCard, Smartphone, Landmark } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const currentOrder = localStorage.getItem('currentOrder');
      if (!currentOrder) {
        setError('No order found. Please return to the sanctuary and try again.');
        setLoading(false);
        return;
      }
      const order = JSON.parse(currentOrder);
      setOrderData(order);
      setLoading(false);

      if (order.razorpayOrderId?.startsWith('mock_order_')) {
        setTimeout(() => {
          handlePaymentSuccess({
            razorpay_order_id: order.razorpayOrderId,
            razorpay_payment_id: `mock_pay_${Math.random().toString(16).slice(2, 10)}`,
            razorpay_signature: 'mock_signature'
          }, order);
        }, 1500);
        return;
      }
      setTimeout(() => initiatePayment(order), 1200);
    };

    script.onerror = () => {
      setError('Failed to load heritage payment gateway. Please refresh.');
      setLoading(false);
    };
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const handlePaymentSuccess = async (response: any, order: any) => {
    try {
      const verifyRes = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        }),
      });
      const verifyData = await verifyRes.json();
      if (verifyRes.ok && verifyData.success) {
        localStorage.removeItem('cart');
        localStorage.removeItem('currentOrder');
        router.push(`/order-confirmation/${verifyData.data.orderId}`);
      } else {
        setError('Heritage validation failed. Please contact our support.');
      }
    } catch (err) {
      setError('Verification connection error.');
    }
  };

  const initiatePayment = (order: any) => {
    if (!window.Razorpay) return;
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: Math.round((order?.amount ?? 0) * 100),
      currency: 'INR',
      order_id: order.razorpayOrderId,
      name: 'TasteOfOdisha',
      description: `Order ${order.orderId}`,
      theme: { color: '#8B6B4C' }, // Sanctuary primary color
      prefill: { contact: '', email: '' },
      handler: (res: any) => handlePaymentSuccess(res, order),
      modal: {
        ondismiss: () => {
          setError('Transaction paused. Returning to manifest...');
          setTimeout(() => router.push('/cart'), 2000);
        },
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (res: any) => setError(`Failed: ${res.error.description}`));
    rzp.open();
  };

  return (
    <main className="min-h-screen bg-secondary flex items-center justify-center p-6 pb-24">
      <div className="bg-white rounded-xl shadow-lg p-12 md:p-16 max-w-md w-full border border-heritage-dark/5 text-center animate-fade-up">
        {loading ? (
          <div className="py-12 flex flex-col items-center gap-6">
            <div className="w-10 h-10 border-2 border-primary/10 border-t-primary rounded-full animate-spin"></div>
            <span className="label-text opacity-40">Activating Gateway</span>
          </div>
        ) : error ? (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-heritage-red/5 text-heritage-red rounded-xl flex items-center justify-center mx-auto border border-heritage-red/10">
               <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-heritage-dark italic">Transaction Paused</h2>
            <p className="body-text text-sm opacity-60 tracking-tight">{error}</p>
            <button onClick={() => router.push('/cart')} className="w-full btn-outline py-4">
              Return to Manifest
            </button>
          </div>
        ) : orderData ? (
          <div className="space-y-10">
            <span className="label-text text-primary">Secure Authorization</span>
            <div className="space-y-2">
              <p className="body-text text-xs opacity-40 uppercase tracking-[0.3em]">
                {orderData.paymentMethod === 'cod' ? 'Advance Payment Due' : 'Final Amount Due'}
              </p>
              <h2 className="text-5xl font-serif font-bold text-heritage-dark italic">
                ₹{(orderData?.amount ?? 0).toFixed(0)}
              </h2>
              {orderData.paymentMethod === 'cod' && orderData.total && (
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider mt-2">
                  Remaining ₹{(orderData.total - orderData.amount).toFixed(0)} payable in cash at delivery
                </p>
              )}
            </div>
            
            <div className="bg-heritage-bone/50 rounded-lg py-4 text-[9px] font-bold text-heritage-dark/30 uppercase tracking-[0.4em] border border-heritage-dark/5">
               REF: {orderData.orderId}
            </div>

            <div className="space-y-4 pt-4 text-left">
              <span className="text-[9px] font-bold text-heritage-dark/30 uppercase tracking-[0.3em]">Channel</span>
              <div className="grid grid-cols-3 gap-3">
                 {[
                   { icon: Smartphone, label: 'UPI' },
                   { icon: CreditCard, label: 'Cards' },
                   { icon: Landmark, label: 'Bank' }
                 ].map((method, i) => (
                   <div key={i} className="flex flex-col items-center gap-2 p-3 bg-heritage-bone/30 rounded-lg border border-heritage-dark/5 opacity-60">
                      <method.icon className="w-4 h-4 text-primary" />
                      <span className="text-[7px] font-bold uppercase tracking-widest">{method.label}</span>
                   </div>
                 ))}
              </div>
            </div>

            <button onClick={() => initiatePayment(orderData)} className="w-full btn-primary py-5 rounded-lg flex items-center justify-center gap-4 group">
              Authorize securely <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            
            <div className="pt-8 border-t border-heritage-dark/5 flex items-center justify-center gap-2 opacity-30">
               <ShieldCheck className="w-3 h-3" />
               <span className="text-[8px] font-bold uppercase tracking-[0.4em]">Razorpay Secure Authorization</span>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
