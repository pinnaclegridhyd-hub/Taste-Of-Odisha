import React from 'react';

const LoadingSpinner: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => {
  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`${className} border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
