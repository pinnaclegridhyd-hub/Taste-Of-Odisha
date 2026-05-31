'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function CartBadge() {
  const [count, setCount] = useState(0);

  const updateCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '{"items":[]}');
      const totalItems = (cart.items || []).reduce((acc: number, item: any) => acc + (item.quantity || 0), 0);
      setCount(totalItems);
    } catch (e) {
      setCount(0);
    }
  };

  useEffect(() => {
    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('cart-updated', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('cart-updated', updateCount);
    };
  }, []);

  return (
    <Link href="/cart" className="text-heritage-dark hover:text-primary transition-all relative group flex items-center justify-center w-10 h-10 rounded-full hover:bg-heritage-bone" aria-label="Cart">
      <ShoppingBag className="w-5 h-5 md:w-[1.4rem] md:h-[1.4rem]" strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute top-1.5 right-1.5 bg-primary text-secondary text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm animate-reveal border border-white">
          {count}
        </span>
      )}
      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 label-text text-[8px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Bag</span>
    </Link>
  );
}
