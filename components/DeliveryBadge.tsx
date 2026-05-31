import React from 'react';
import { Truck } from 'lucide-react';

interface DeliveryBadgeProps {
  free?: boolean;
}

const DeliveryBadge: React.FC<DeliveryBadgeProps> = ({ free = false }) => {
  return (
    <div className={`flex items-center gap-4 border px-6 py-4 rounded-xl transition-all duration-500 ${free ? 'bg-green-50/50 border-green-100 text-green-800' : 'bg-heritage-bone border-heritage-dark/5 text-heritage-dark'}`}>
      <Truck className="w-5 h-5 opacity-60" strokeWidth={1.5} />
      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
        {free ? 'Complimentary Transit' : 'Archive Passage Guaranteed'}
      </span>
    </div>
  );
};

export default DeliveryBadge;
