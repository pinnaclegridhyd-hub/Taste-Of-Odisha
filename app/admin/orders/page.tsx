'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IOrder } from '@/models/Order';
import { User, Package, Clock, ArrowLeft, AlertCircle } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const key = localStorage.getItem('adminKey');
        if (!key) {
          router.push('/admin/dashboard');
          return;
        }
        setAdminKey(key);

        const res = await fetch('/api/admin/orders', {
          headers: { Authorization: `Bearer ${key}` },
        });

        if (!res.ok) {
          setError('Failed to fetch orders');
          setLoading(false);
          return;
        }

        const data = await res.json();
        setOrders(data.data);
        setLoading(false);
      } catch (err) {
        setError('Connection error fetching orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminKey}`,
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (res.ok) {
        setOrders(
          orders.map((o) =>
            o.orderId === orderId
              ? { ...o, status: newStatus as any }
              : o
          )
        );
      } else {
        setError('Failed to update order status');
      }
    } catch (err) {
      setError('Update connection error');
    } finally {
      setUpdatingOrderId('');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
           <div className="w-10 h-10 border-2 border-primary/10 border-t-primary rounded-full animate-spin"></div>
           <span className="label-text opacity-40">Loading Orders</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary pb-32 pt-28">
      {/* Header */}
      <section className="bg-heritage-bone border-b border-heritage-dark/5 py-12 md:py-16 mb-12">
        <div className="container-sanctuary">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="space-y-6">
               <Link href="/admin/dashboard" className="flex items-center gap-2 label-text text-primary hover:opacity-70 transition-opacity">
                  <ArrowLeft className="w-3 h-3" /> Dashboard
               </Link>
               <h1 className="h1 lowercase first-letter:uppercase text-heritage-dark">
                 Order <br /><span className="italic font-normal text-primary">Fulfillment.</span>
               </h1>
            </div>
            <div className="text-right space-y-2">
               <span className="label-text opacity-30">Total Orders</span>
               <p className="text-2xl font-serif font-bold text-heritage-dark italic">{orders.length} Orders</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-sanctuary">
        {error && (
          <div className="bg-heritage-red/5 border border-heritage-red/10 text-heritage-red px-6 py-4 rounded-xl mb-12 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-20 text-center border border-heritage-dark/5 space-y-4">
             <Package className="w-12 h-12 text-heritage-dark/10 mx-auto" />
             <p className="body-text text-lg opacity-40 italic">No orders yet.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {orders.map((order) => (
              <div key={order._id?.toString()} className="bg-white rounded-xl p-8 md:p-12 border border-heritage-dark/5 shadow-sm hover:shadow-md transition-all overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/20"></div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  {/* Identity */}
                  <div className="lg:col-span-3 space-y-8">
                    <div className="space-y-1">
                       <span className="label-text opacity-30">Order ID</span>
                       <p className="text-lg font-bold text-heritage-dark tracking-widest uppercase">{order.orderId}</p>
                    </div>
                    <div className="space-y-4">
                       <div className="flex items-center gap-3 label-text opacity-30">
                          <User className="w-3.5 h-3.5" /> Customer
                       </div>
                       <div className="space-y-1">
                          <p className="text-sm font-bold text-heritage-dark">{order.shippingAddress?.name}</p>
                          <p className="text-xs text-heritage-dark/50 italic">{order.phoneNumber}</p>
                       </div>
                    </div>
                  </div>

                  {/* Financials & Status */}
                  <div className="lg:col-span-5 space-y-10">
                    <div className="flex justify-between items-end border-b border-heritage-dark/5 pb-8">
                       <div className="space-y-1">
                          <span className="label-text opacity-30">Total</span>
                          <p className="text-4xl font-serif font-bold text-heritage-dark italic tracking-tighter">
                            &#8377;{(order.total ?? 0).toFixed(0)}
                          </p>
                       </div>
                       <div className="text-right space-y-1">
                          <span className="label-text opacity-30 mb-2 block">Payment</span>
                          <span className={`px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                            order.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-heritage-red/5 text-heritage-red border-heritage-red/10'
                          }`}>
                            {order.paymentStatus}
                          </span>
                       </div>
                    </div>

                    <div className="flex items-center justify-between gap-6 p-6 bg-heritage-bone/30 rounded-xl border border-heritage-dark/5">
                       <div className="flex items-center gap-3 label-text text-heritage-dark/60">
                          <div className={`w-2 h-2 rounded-full animate-pulse ${order.status !== 'delivered' ? 'bg-primary' : 'bg-green-500'}`}></div>
                          {order.status}
                       </div>
                       
                       {order.paymentStatus === 'paid' && order.status !== 'delivered' && (
                          <div className="relative">
                             {updatingOrderId === order.orderId ? (
                               <LoadingSpinner className="w-5 h-5 border-primary/30 border-t-primary" />
                             ) : (
                               <select
                                 value={order.status}
                                 onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                 className="bg-white border border-heritage-dark/10 rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-widest focus:ring-4 focus:ring-primary/5 outline-none cursor-pointer hover:border-primary transition-all"
                               >
                                 <option value="">Update Status</option>
                                 <option value="processing">Processing</option>
                                 <option value="shipped">Shipped</option>
                                 <option value="delivered">Delivered</option>
                                 <option value="cancelled">Cancelled</option>
                               </select>
                             )}
                          </div>
                       )}
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="lg:col-span-4 bg-heritage-dark p-8 rounded-xl text-heritage-bone relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                       <span className="label-text text-primary border-b border-primary/20 pb-4 block">Shipping Address</span>
                       <div className="space-y-2">
                          <p className="text-xs font-medium uppercase tracking-widest opacity-70 leading-relaxed">
                            {order.shippingAddress?.addressLine}<br />
                            {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                          </p>
                          <p className="text-xs font-bold text-primary pt-2">{order.shippingAddress?.mobile}</p>
                       </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  </div>
                </div>

                {/* Items */}
                <div className="mt-12 pt-10 border-t border-heritage-dark/5 space-y-6">
                  <div className="flex items-center gap-3 label-text opacity-30">
                     <Package className="w-3.5 h-3.5" /> Order Items
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {(order.items ?? []).map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-heritage-bone/30 p-4 rounded-lg border border-heritage-dark/5">
                           <span className="text-[11px] font-bold text-heritage-dark uppercase tracking-widest truncate flex-1 pr-4">{item.name}</span>
                           <span className="text-[10px] font-bold text-primary">QTY {item.quantity}</span>
                        </div>
                     ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-heritage-dark/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-bold uppercase tracking-[0.3em] text-heritage-dark/20">
                   <div className="flex gap-8">
                      <span>RZP: {order.razorpayOrderId}</span>
                      {order.razorpayPaymentId && <span>TXN: {order.razorpayPaymentId}</span>}
                   </div>
                   <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(order.createdAt).toLocaleString()}</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
