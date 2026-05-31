import React from 'react';
import { UserCheck } from 'lucide-react';

interface ArtisanHighlightProps {
  name?: string;
}

const ArtisanHighlight: React.FC<ArtisanHighlightProps> = ({ name }) => {
  return (
    <div className="flex items-center gap-5 bg-heritage-dark p-6 rounded-xl shadow-lg border border-white/5 group">
      <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
         <UserCheck className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <span className="block text-[9px] font-bold uppercase tracking-[0.3em] text-primary/60">Lead Artisan</span>
        <span className="block text-lg font-serif font-bold text-heritage-bone italic leading-tight group-hover:text-primary transition-colors">
           {name || 'Odisha Collective'}
        </span>
      </div>
    </div>
  );
};

export default ArtisanHighlight;
