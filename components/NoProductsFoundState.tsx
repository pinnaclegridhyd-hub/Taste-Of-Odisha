import React from 'react';
import { Search } from 'lucide-react';

const NoProductsFoundState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <div className="w-20 h-20 bg-heritage-bone rounded-xl flex items-center justify-center mb-8 shadow-inner">
        <Search className="w-8 h-8 text-heritage-dark/10" />
      </div>
      <h3 className="text-2xl font-serif font-bold text-heritage-dark mb-4 italic">No products found.</h3>
      <p className="body-text max-w-sm opacity-50 italic">
        We couldn't find any products matching your criteria. Try adjusting your filters or explore our other collections.
      </p>
    </div>
  );
};

export default NoProductsFoundState;
