'use client';

export default function SkeletonLoader() {
  return (
    <div className="card-heritage skeleton-pulse">
      <div className="aspect-[4/5] bg-primary/5 skeleton transition-opacity" />
      <div className="p-8 space-y-4">
        <div className="h-2 w-16 bg-primary/5 skeleton" />
        <div className="h-6 w-full bg-primary/5 skeleton" />
        <div className="flex justify-between items-end pt-4">
          <div className="space-y-2">
            <div className="h-8 w-24 bg-primary/5 skeleton" />
            <div className="h-2 w-12 bg-primary/5 skeleton" />
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/5 skeleton" />
        </div>
      </div>
    </div>
  );
}
