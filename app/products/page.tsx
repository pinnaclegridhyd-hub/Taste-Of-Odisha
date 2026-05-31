'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { SearchX, ArrowUpDown, Sparkles } from 'lucide-react';
import SkeletonLoader from '@/components/SkeletonLoader';

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error('Failed to load lineages:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = category ? `/api/products?category=${category}` : '/api/products';
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch heritage:', err);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchProducts();
  }, [category]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery) || 
        p.description?.toLowerCase().includes(searchQuery) ||
        p.category?.toLowerCase().includes(searchQuery)
      );
    }

    const sorted = [...result];
    if (sortBy === 'price-low') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sorted;
  }, [products, searchQuery, sortBy]);


  return (
    <main className="min-h-screen bg-secondary pb-32 pt-28">
      {/* 01. Refined Boutique Header */}
      <section className="bg-heritage-bone border-b border-heritage-dark/5 py-12 md:py-20">
        <div className="container-sanctuary">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="label-text text-primary">
                {searchQuery ? 'Search Discovery' : category ? `Category: ${category}` : 'The Collection'}
              </span>
              <h1 className="h1 lowercase first-letter:uppercase text-heritage-dark">
                {searchQuery ? `"${searchParams.get('search')}"` : <>Heritage <br /><span className="italic font-normal text-primary">Collection.</span></>}
              </h1>
            </div>

            {/* Utility Row: Sorting */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-lg border border-heritage-dark/5 shadow-sm">
                <ArrowUpDown className="w-4 h-4 text-primary" />
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-[10px] font-bold uppercase tracking-widest text-heritage-dark outline-none cursor-pointer"
                >
                  <option value="newest">Latest Collections</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-sanctuary py-12">
        {/* Category Navigation - Subtle & Stable */}
        <div className="mb-16 overflow-x-auto no-scrollbar border-b border-heritage-dark/5">
           <div className="flex items-center gap-10 min-w-max">
             <Link 
               href="/products" 
               className={`text-[10px] font-bold uppercase tracking-widest pb-4 border-b-2 transition-all ${!category ? 'text-primary border-primary' : 'text-heritage-dark/40 border-transparent hover:text-heritage-dark'}`}
             >
               All Selection
             </Link>
             {categories.map(cat => (
               <Link 
                 key={cat._id} 
                 href={`/products?category=${cat.slug}`}
                 className={`text-[10px] font-bold uppercase tracking-widest pb-4 border-b-2 transition-all capitalize ${category === cat.slug ? 'text-primary border-primary' : 'text-heritage-dark/40 border-transparent hover:text-heritage-dark'}`}
               >
                 {cat.name}
               </Link>
             ))}
           </div>
        </div>

        {/* 2-Column Responsive Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {[...Array(8)].map((_, i) => (
              <SkeletonLoader key={i} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-heritage-bone/30 rounded-xl border border-heritage-dark/5">
             <div className="max-w-md mx-auto px-8 flex flex-col items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                   <SearchX className="w-8 h-8 opacity-20" />
                </div>
                <h3 className="text-xl font-bold text-heritage-dark">No products found.</h3>
                <p className="body-text text-sm mb-4">
                   We couldn't find any products matching your current selection.
                </p>
                <Link href="/products" className="btn-outline">
                  Clear Selection
                </Link>
             </div>
          </div>
        )}
      </div>

      {/* Preservation Banner */}
      <section className="container-sanctuary mt-24">
         <div className="bg-heritage-dark rounded-xl p-10 md:p-20 relative overflow-hidden text-center md:text-left bg-gradient-to-br from-heritage-dark to-black/80">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-4 max-w-xl">
                 <h2 className="text-2xl md:text-3xl font-serif font-bold text-heritage-bone italic leading-snug">
                   Every piece preserves a lineage of over 500 women artisans in rural Odisha.
                 </h2>
                 <p className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">The Preservation Promise</p>
              </div>
              <Sparkles className="w-10 h-10 text-primary opacity-30 animate-pulse" />
            </div>
            <div className="absolute top-0 right-0 w-64 h-full bg-white/5 skew-x-12 translate-x-20"></div>
         </div>
      </section>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container-sanctuary py-32 flex justify-center text-primary">Loading collection...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

