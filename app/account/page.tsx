'use client';

import React, { useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Search, Package, MapPin, Receipt, Phone, ArrowLeft, History } from 'lucide-react';
import Link from 'next/link';

const AccountPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;

    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/orders?phone=${phoneNumber}`);
      const data = await res.json();
      
      if (data.success) {
        setOrders(data.data);
      } else {
        setError(data.error || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('A connection error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  return (
    <main className="min-h-screen bg-secondary pb-32 pt-28">
      {/* Sanctuary Header */}
      <section className="bg-heritage-bone border-b border-heritage-dark/5 py-12 md:py-20 mb-12">
        <div className="container-sanctuary">
          <div className="max-w-3xl space-y-6">
            <span className="label-text text-primary">Your Orders</span>
            <h1 className="h1 lowercase first-letter:uppercase text-heritage-dark">
              Order <br /><span className="italic font-normal text-primary">History.</span>
            </h1>
            <p className="body-text text-lg">
              Track your authentic Odisha products and explore your history with our collective.
            </p>
          </div>
        </div>
      </section>

      <div className="container-sanctuary">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Search Card */}
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 border border-heritage-dark/5 animate-fade-up">
            <div className="flex items-center gap-4 mb-8">
               <History className="w-5 h-5 text-primary" />
               <h2 className="text-xl font-bold text-heritage-dark px-4 border-l-2 border-primary">Retrieve History</h2>
            </div>
            
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-heritage-dark/20" />
                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-heritage-bone/30 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary px-10 py-4 flex items-center justify-center min-w-[180px] disabled:opacity-50"
              >
                {isLoading ? <LoadingSpinner className="w-5 h-5 border-white/30 border-t-white" /> : 'View History'}
              </button>
            </form>
          </div>

          {/* Results Area */}
          {hasSearched && (
            <div className="space-y-8 animate-fade-up">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-lg font-serif font-bold text-heritage-dark italic">
                   {orders.length > 0 ? `Found ${orders.length} order(s)` : 'No records found'}
                 </h3>
              </div>

              {orders.length === 0 ? (
                <div className="bg-heritage-bone/50 border-2 border-dashed border-heritage-dark/10 rounded-xl p-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Search className="w-8 h-8 text-heritage-dark/10" />
                  </div>
                  <p className="body-text text-sm opacity-50 italic">
                    We could not find any order records associated with this phone number.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order, i) => (
                    <div key={order.orderId} className="bg-white rounded-xl p-8 border border-heritage-dark/5 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                      <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
                      
                      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
                        <div className="space-y-4">
                          <div className="space-y-1">
                             <span className="label-text opacity-30">Order ID</span>
                             <p className="text-sm font-bold text-heritage-dark tracking-widest">{order.orderId}</p>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-heritage-dark/50 font-medium italic">
                             <Receipt className="w-3.5 h-3.5" />
                             {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'long', year: 'numeric'
                             })}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-colors ${
                            order.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-heritage-red/5 text-heritage-red border-heritage-red/10'
                          }`}>
                            {order.paymentStatus}
                          </span>
                          <span className="px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-heritage-bone text-heritage-dark border border-heritage-dark/10">
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4 mb-10 pb-10 border-b border-heritage-dark/5">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center group/item">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-heritage-bone rounded-lg flex items-center justify-center text-heritage-dark/20 group-hover/item:text-primary transition-colors">
                                <Package className="w-5 h-5" />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-sm font-bold text-heritage-dark">{item.name}</p>
                                <p className="text-[10px] font-bold text-heritage-dark/30 uppercase tracking-widest">
                                   QTY {item.quantity} × ₹{item.price}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-heritage-dark">₹{(item.price * item.quantity).toFixed(0)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                        <div className="space-y-4 text-left">
                           <div className="flex items-center gap-2 label-text opacity-30">
                              <MapPin className="w-3.5 h-3.5" /> Destination
                           </div>
                           <div className="space-y-1">
                              <p className="text-sm font-bold text-heritage-dark">{order.shippingAddress.name}</p>
                              <p className="text-xs text-heritage-dark/50 italic leading-relaxed max-w-xs">
                                 {order.shippingAddress.addressLine}, {order.shippingAddress.city}
                              </p>
                           </div>
                        </div>
                         <div className="text-right space-y-2">
                           <span className="label-text opacity-30">Order Total</span>
                           <p className="text-4xl font-serif font-bold text-heritage-dark italic tracking-tighter">
                             ₹{order.total.toFixed(0)}
                           </p>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AccountPage;
