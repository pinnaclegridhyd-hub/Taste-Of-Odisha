import React from 'react';

interface StockBadgeProps {
  quantity: number;
  inStock: boolean;
}

const StockBadge: React.FC<StockBadgeProps> = ({ quantity, inStock }) => {
  if (!inStock || quantity <= 0) {
    return (
      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] bg-heritage-red/5 text-heritage-red border border-heritage-red/10">
         Archive / Out of Stock
      </span>
    );
  }

  if (quantity < 5) {
    return (
      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] bg-primary text-white shadow-sm animate-pulse">
        Rarity: {quantity} Artisanal Pieces Remaining
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] bg-heritage-bone text-heritage-dark border border-heritage-dark/10">
      Sanctuary Guaranteed Stock
    </span>
  );
};

export default StockBadge;
