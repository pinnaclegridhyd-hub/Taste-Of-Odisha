import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const EmptyCartState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <div className="w-32 h-32 bg-heritage-bone rounded-full flex items-center justify-center mb-10 shadow-inner group overflow-hidden relative">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <ShoppingBag className="w-12 h-12 text-heritage-dark opacity-10 group-hover:text-primary group-hover:opacity-40 transition-all duration-700 hover:scale-110" />
      </div>
      <h3 className="text-3xl font-serif font-bold text-heritage-dark mb-4 italic">The bag is empty.</h3>
      <p className="body-text max-w-sm mb-12 opacity-60">
        Discover the culinary soul of Odisha. Explore our collections of authentic sweets, Achar, and savory Muruku.
      </p>
      <Link
        href="/products"
        className="btn-primary !px-12 !py-4 flex items-center gap-3 group"
      >
        Explore Catalog
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default EmptyCartState;
