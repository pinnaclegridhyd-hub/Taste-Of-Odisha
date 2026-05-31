import React from 'react';

const QualityBadge: React.FC = () => {
  return (
    <div className="flex items-center gap-4 bg-white border border-heritage-dark/5 px-6 py-4 rounded-xl shadow-sm">
      <div className="w-8 h-8 rounded-lg bg-heritage-bone flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      </div>
      <div className="space-y-0.5">
        <span className="block label-text text-heritage-dark text-[9px]">Authentic Archetype</span>
        <span className="block text-[10px] font-bold text-heritage-dark/30 uppercase tracking-[0.2em] italic">Odisha Archive</span>
      </div>
    </div>
  );
};

export default QualityBadge;
