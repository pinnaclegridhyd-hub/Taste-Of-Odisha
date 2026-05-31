'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Box, ShoppingCart, TrendingUp, AlertCircle, LogOut, ArrowRight, Package, ListChecks } from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const key = localStorage.getItem('adminKey');
        if (!key) {
          setShowKeyInput(true);
          setLoading(false);
          return;
        }
        setAdminKey(key);

        const [productsRes, ordersRes] = await Promise.all([
          fetch('/api/admin/products', {
            headers: { Authorization: `Bearer ${key}` },
          }),
          fetch('/api/admin/orders', {
            headers: { Authorization: `Bearer ${key}` },
          }),
        ]);

        if (!productsRes.ok || !ordersRes.ok) {
          setError('Unauthorized Access Detected');
          setShowKeyInput(true);
          setLoading(false);
          return;
        }

        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();

        const totalRevenue = ordersData.data.reduce(
          (sum: number, order: any) => {
            if (order.paymentStatus === 'paid') {
              return sum + order.total;
            }
            return sum;
          },
          0
        );

        const pendingOrders = ordersData.data.filter(
          (order: any) => order.status === 'pending'
        ).length;

        setStats({
          totalProducts: productsData.data.length,
          totalOrders: ordersData.data.length,
          totalRevenue,
          pendingOrders,
        });

        setLoading(false);
      } catch (err) {
        setError('Connection interrupted');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleSetKey = (key: string) => {
    localStorage.setItem('adminKey', key);
    setAdminKey(key);
    setShowKeyInput(false);
    window.location.reload();
  };

  if (showKeyInput) {
    return (
      <main className="min-h-screen bg-secondary flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-xl p-12 max-w-md w-full border border-heritage-dark/5 text-center space-y-8 animate-fade-up">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
             <Shield className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
             <span className="label-text text-primary">Admin Access</span>
             <h1 className="text-2xl font-serif font-bold text-heritage-dark italic">Secured Login.</h1>
          </div>

          <div className="space-y-4">
             <input
               type="password"
               placeholder="Enter admin key"
               onKeyPress={(e) => {
                 if (e.key === 'Enter') handleSetKey((e.target as HTMLInputElement).value);
               }}
               className="w-full px-6 py-4 bg-heritage-bone/50 border border-heritage-dark/5 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-center font-bold tracking-[0.5em]"
             />
             <button
               onClick={() => {
                 const input = document.querySelector('input[type="password"]') as HTMLInputElement;
                 if (input) handleSetKey(input.value);
               }}
               className="w-full btn-primary py-4"
             >
               Login to Dashboard
             </button>
             <p className="text-[10px] font-bold uppercase tracking-widest text-heritage-dark/30 italic">Restricted Admin Access</p>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
           <div className="w-10 h-10 border-2 border-primary/10 border-t-primary rounded-full animate-spin"></div>
           <span className="label-text opacity-40">Loading Dashboard</span>
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
               <span className="label-text text-primary">Control Center</span>
               <h1 className="h1 lowercase first-letter:uppercase text-heritage-dark">
                 Admin <br /><span className="italic font-normal text-primary">Dashboard.</span>
               </h1>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('adminKey');
                window.location.reload();
              }}
              className="flex items-center gap-2 label-text text-heritage-red hover:opacity-70 transition-opacity border-b-2 border-heritage-red/10 pb-2"
            >
              Terminate Session <LogOut className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      <div className="container-sanctuary">
        {error && (
          <div className="bg-heritage-red/5 border border-heritage-red/10 text-heritage-red px-6 py-4 rounded-xl mb-12 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { icon: Box, label: 'Collection Size', value: stats.totalProducts, desc: 'Total Products' },
            { icon: ShoppingCart, label: 'Order Volume', value: stats.totalOrders, desc: 'Total Orders' },
            { icon: TrendingUp, label: 'Total Sales', value: `₹${stats.totalRevenue.toLocaleString()}`, desc: 'Estd. Revenue' },
            { icon: AlertCircle, label: 'Action Required', value: stats.pendingOrders, desc: 'Pending Orders', alert: stats.pendingOrders > 0 },
          ].map((stat, i) => (
            <div key={i} className={`bg-white rounded-xl p-8 border border-heritage-dark/5 shadow-sm transition-all hover:shadow-md ${stat.alert ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}>
               <div className="flex justify-between items-start mb-6">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.alert ? 'bg-primary/20 text-primary' : 'bg-heritage-bone text-heritage-dark/40'}`}>
                     <stat.icon className="w-5 h-5" />
                  </div>
               </div>
               <span className="label-text opacity-40 block mb-2">{stat.label}</span>
               <p className={`text-3xl font-bold font-serif italic ${stat.alert ? 'text-primary' : 'text-heritage-dark'}`}>{stat.value}</p>
               <p className="text-[10px] font-bold text-heritage-dark/30 uppercase tracking-widest mt-2">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Action Gateways */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Link href="/admin/products" className="group bg-white rounded-xl p-10 md:p-16 border border-heritage-dark/5 hover:border-primary/20 transition-all shadow-sm hover:shadow-xl flex flex-col items-start relative overflow-hidden">
             <div className="w-12 h-12 rounded-xl bg-heritage-bone flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                <Package className="w-6 h-6" />
             </div>
             <h2 className="text-2xl font-serif font-bold text-heritage-dark mb-4 italic">Product Management</h2>
             <p className="body-text text-sm opacity-60 mb-10 max-w-sm">
                Manage the Odisha collection. Update inventory, pricing, and curate artisan products.
             </p>
             <span className="flex items-center gap-3 label-text text-primary group-hover:translate-x-2 transition-transform">
                Explore Catalog <ArrowRight className="w-4 h-4" />
             </span>
          </Link>

          <Link href="/admin/orders" className="group bg-heritage-dark rounded-xl p-10 md:p-16 border border-white/5 hover:border-primary/20 transition-all shadow-xl flex flex-col items-start relative overflow-hidden text-white">
             <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-primary transition-all">
                <ListChecks className="w-6 h-6" />
             </div>
             <h2 className="text-2xl font-serif font-bold text-heritage-bone mb-4 italic">Order Fulfillment</h2>
             <p className="text-heritage-bone/60 text-sm mb-10 max-w-sm">
                Manage order processing and shipping. Update status, verify details, and ensure artisan delivery.
             </p>
             <span className="flex items-center gap-3 label-text text-primary group-hover:translate-x-2 transition-transform">
                View Orders <ArrowRight className="w-4 h-4" />
             </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
