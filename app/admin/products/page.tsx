'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IProduct } from '@/models/Product';
import Image from 'next/image';
import { ArrowLeft, Plus, Edit3, Trash2, Box, Package, AlertCircle } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminKey, setAdminKey] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const key = localStorage.getItem('adminKey');
        if (!key) {
          router.push('/admin/dashboard');
          return;
        }
        setAdminKey(key);

        const res = await fetch('/api/admin/products', {
          headers: { Authorization: `Bearer ${key}` },
        });

        if (!res.ok) {
          setError('Failed to fetch catalog');
          setLoading(false);
          return;
        }

        const data = await res.json();
        setProducts(data.data);
        setLoading(false);
      } catch (err) {
        setError('Heritage Synchronization Interrupted');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [router]);

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you certain you wish to purge this heritage artifact from the manifest?')) return;

    try {
      const res = await fetch(`/api/products/${slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminKey}` },
      });

      if (res.ok) {
        setProducts(products.filter((p) => p.slug !== slug));
      } else {
        setError('Failed to purge artifact');
      }
    } catch (err) {
      setError('Connection error during purge');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
           <div className="w-10 h-10 border-2 border-primary/10 border-t-primary rounded-full animate-spin"></div>
           <span className="label-text opacity-40">Syncing Catalog</span>
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
                 Master <br /><span className="italic font-normal text-primary">Catalog.</span>
               </h1>
            </div>
            <Link href="/admin/products/create" className="btn-primary px-8 py-4 flex items-center gap-3">
              <Plus className="w-4 h-4" /> Add Artifact
            </Link>
          </div>
        </div>
      </section>

      <div className="container-sanctuary">
        {error && (
          <div className="bg-heritage-red/5 border border-heritage-red/10 text-heritage-red px-6 py-4 rounded-xl mb-12 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-heritage-dark/5 overflow-hidden animate-fade-up">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-heritage-bone/50 border-b border-heritage-dark/5">
                  <th className="px-8 py-4 label-text opacity-30">Artifact Identity</th>
                  <th className="px-8 py-4 label-text opacity-30">Category</th>
                  <th className="px-8 py-4 label-text opacity-30 text-right">Valuation</th>
                  <th className="px-8 py-4 label-text opacity-30 text-center">Stock</th>
                  <th className="px-8 py-4 label-text opacity-30 text-center">Status</th>
                  <th className="px-8 py-4 label-text opacity-30 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-heritage-dark/5">
                {products.map((product) => (
                  <tr key={product._id?.toString()} className="hover:bg-heritage-bone/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden border border-heritage-dark/5 shadow-sm">
                           <Image
                             src={product.images?.[0] || '/placeholder.png'}
                             alt={product.name}
                             fill
                             className="object-cover"
                           />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-heritage-dark group-hover:text-primary transition-colors">
                            {product.name}
                          </p>
                          <p className="text-[10px] font-bold text-heritage-dark/30 uppercase tracking-widest">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-[9px] font-bold text-primary uppercase tracking-widest border border-primary/20 px-3 py-1 rounded-full">{product.category}</span>
                    </td>
                    <td className="px-8 py-6 text-right font-serif font-bold text-heritage-dark text-lg italic tracking-tighter">
                      ₹{product.price.toFixed(0)}
                    </td>
                    <td className="px-8 py-6 text-center text-xs font-bold text-heritage-dark/40">
                      {product.stockQuantity} Units
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                        product.inStock 
                          ? 'bg-green-50 text-green-700 border-green-100' 
                          : 'bg-heritage-red/5 text-heritage-red border-heritage-red/10'
                      }`}>
                        {product.inStock ? 'Available' : 'Depleted'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/products/${product._id}/edit`}
                          className="p-2 text-heritage-dark/30 hover:text-primary transition-colors"
                          title="Edit Manifest"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.slug)}
                          className="p-2 text-heritage-dark/30 hover:text-heritage-red transition-colors"
                          title="Purge Artifact"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
