import React from 'react';
import { Advertisement } from '../types';
import { ExternalLink, Settings } from 'lucide-react';

interface AdCardProps {
  ad: Advertisement;
  isAdmin?: boolean;
}

export const AdCard: React.FC<AdCardProps> = ({ ad, isAdmin }) => {
  return (
    <div className="relative group h-full">
        {isAdmin && (
            <div className="absolute top-2 left-2 z-30">
                <button className="bg-slate-900/90 text-white text-xs px-2 py-1 rounded shadow-md flex items-center gap-1 hover:bg-slate-800">
                    <Settings className="w-3 h-3" /> Gestionar
                </button>
            </div>
        )}
        <a 
          href={ad.linkUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block relative overflow-hidden rounded-xl border border-slate-200 bg-white hover:shadow-lg transition-all h-full"
        >
          <div className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wider border border-slate-100">
            Publicidad
          </div>
          
          <div className="relative h-48 overflow-hidden">
            <img 
              src={ad.imageUrl} 
              alt={ad.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
                <span className="text-amber-400 text-xs font-bold uppercase mb-1 block">{ad.advertiserName}</span>
                <h3 className="text-white font-bold text-lg leading-tight flex items-center gap-2">
                    {ad.title} <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
            </div>
          </div>
        </a>
    </div>
  );
};

export const SidebarAd: React.FC<{ ad: Advertisement, isAdmin?: boolean }> = ({ ad, isAdmin }) => {
    return (
        <div className="mt-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group">
             {isAdmin && (
                <div className="absolute top-2 right-2 z-30">
                     <button className="bg-slate-900/90 text-white text-xs px-2 py-1 rounded shadow-md hover:bg-slate-800">
                        Editar Banner
                    </button>
                </div>
             )}
             <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 text-center">Espacio Publicitario</div>
             <a href={ad.linkUrl} className="block group relative overflow-hidden rounded-lg">
                <img 
                    src={ad.imageUrl} 
                    alt={ad.title} 
                    className="w-full h-48 object-cover rounded-lg transform group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="text-center p-4">
                        <h4 className="text-white font-bold text-lg drop-shadow-md">{ad.title}</h4>
                        <span className="text-white/90 text-sm mt-1 inline-block bg-blue-600 px-3 py-1 rounded-full text-xs">Ver más</span>
                    </div>
                </div>
             </a>
        </div>
    );
};