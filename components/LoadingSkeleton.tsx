import React from 'react';

const LoadingSkeleton: React.FC<{ type?: 'card' | 'list' | 'detail' }> = ({
  type = 'card',
}) => {
  if (type === 'card') {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse border border-gray-100">
        <div className="aspect-[4/5] bg-gray-200"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="animate-pulse container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-200 rounded-2xl"></div>
          <div className="space-y-6">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded w-full mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
