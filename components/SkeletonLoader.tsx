'use client';

export default function SkeletonLoader() {
  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden animate-pulse">
      {/* Image area skeleton */}
      <div className="aspect-square bg-gray-100 relative">
        {/* Wishlist icon placeholder */}
        <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-gray-200" />
        {/* ADD button placeholder */}
        <div className="absolute bottom-3 right-3 w-16 h-7 rounded bg-gray-200" />
      </div>
      {/* Info area skeleton */}
      <div className="p-3 md:p-4 space-y-2">
        {/* Price row */}
        <div className="flex items-baseline gap-2">
          <div className="h-5 w-16 bg-gray-100 rounded" />
          <div className="h-3 w-10 bg-gray-100 rounded" />
        </div>
        {/* Discount */}
        <div className="h-3 w-12 bg-gray-100 rounded" />
        {/* Product name */}
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-3/4 bg-gray-100 rounded" />
        {/* Variant */}
        <div className="h-3 w-14 bg-gray-100 rounded" />
      </div>
    </div>
  );
}
