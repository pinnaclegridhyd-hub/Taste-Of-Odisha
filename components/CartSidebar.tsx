'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, X, Trash2, ShieldCheck, ArrowRight, Minus, Plus } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
  onRemove: (productId: string) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  items,
  onRemove,
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-heritage-dark/60 backdrop-blur-md z-[100] transition-opacity duration-700 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white z-[101] shadow-2xl transition-transform duration-[0.8s] cubic-bezier(0.16, 1, 0.3, 1) flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-8 border-b border-heritage-dark/5 flex items-center justify-between bg-heritage-bone/30">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif font-bold text-heritage-dark italic">Your Bag</h2>
            <div className="flex items-center gap-2">
               <div className="w-1 h-1 rounded-full bg-primary animate-pulse"></div>
               <p className="label-text text-heritage-dark/40">
                 {items.length} {items.length === 1 ? 'Product' : 'Products'}
               </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-heritage-bone rounded-full transition-all text-heritage-dark/30 hover:text-heritage-dark"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-up">
              <div className="w-24 h-24 bg-heritage-bone rounded-full flex items-center justify-center shadow-inner group">
                <ShoppingBag className="w-8 h-8 text-heritage-dark opacity-10 group-hover:text-primary group-hover:opacity-40 transition-all duration-700 hover:scale-110" />
              </div>
              <div className="max-w-[280px] space-y-2">
                <p className="text-xl font-serif font-bold text-heritage-dark italic">Heritage Collection</p>
                <p className="body-text text-sm opacity-50 italic">Your bag is currently empty. Explore the story of Odisha through our collection.</p>
              </div>
              <button
                onClick={onClose}
                className="btn-outline px-10 py-4"
              >
                Discover Collection
              </button>
            </div>
          ) : (
            <div className="space-y-8">
               {items.map((item) => (
                  <div key={item.productId} className="flex gap-6 py-4 group animate-fade-up">
                    <div className="relative w-24 h-32 rounded-xl overflow-hidden bg-heritage-bone flex-shrink-0 border border-heritage-dark/5 shadow-sm group-hover:shadow-md transition-all duration-700">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-[1.5s]" 
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h3 className="text-lg font-serif font-bold text-heritage-dark leading-tight line-clamp-2 italic">
                            {item.name}
                          </h3>
                          <p className="label-text text-primary">₹{item.price} per piece</p>
                        </div>
                        <button
                          onClick={() => onRemove(item.productId)}
                          className="text-heritage-dark/10 hover:text-heritage-red transition-colors p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-6">
                        <div className="flex items-center gap-4 px-4 py-2 bg-heritage-bone rounded-lg border border-heritage-dark/5">
                           <span className="label-text opacity-30 text-[9px]">QTY</span>
                           <span className="text-sm font-serif font-bold italic">{item.quantity}</span>
                        </div>
                        <span className="text-lg font-serif font-bold text-heritage-dark italic text-right">₹{(item.price * item.quantity).toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
               ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 border-t border-heritage-dark/5 space-y-8 bg-heritage-bone/30">
            <div className="flex justify-between items-end px-2">
              <span className="label-text opacity-40">Subtotal</span>
              <span className="text-3xl font-serif font-bold text-primary italic tracking-tighter">₹{subtotal.toFixed(0)}</span>
            </div>
            
            <div className="space-y-4">
              <Link
                href="/checkout"
                onClick={onClose}
                className="btn-primary w-full !py-5 flex items-center justify-center gap-4 group"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <div className="flex items-center justify-center gap-2 label-text text-heritage-dark/20 text-[9px]">
                <ShieldCheck className="w-3 h-3" />
                Secure Checkout: Trusted Transaction
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
