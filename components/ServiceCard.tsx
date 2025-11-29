
import React from 'react';
import { Star, MapPin, CheckCircle, Clock, Map, Pencil, Trash2, MessageSquare } from 'lucide-react';
import { Professional } from '../types';

interface ServiceCardProps {
  professional: Professional;
  distance?: number | null;
  isAdmin?: boolean;
  onContact?: (proId: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ professional, distance, isAdmin, onContact }) => {
  const openInMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${professional.latitude},${professional.longitude}`, '_blank');
  };

  const handleContact = () => {
      // Open WhatsApp
      if (professional.whatsapp) {
          const message = `Hola ${professional.name}, te vi en ProSpot y me interesa tu servicio.`;
          window.open(`https://wa.me/${professional.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(message)}`, '_blank');
      }
      // Record History in App
      if (onContact) {
          onContact(professional.id);
      }
  };

  return (
    <div className={`
      bg-white rounded-xl overflow-hidden transition-all duration-300 group flex flex-col h-full relative
      ${professional.isPromoted 
        ? 'border-2 border-amber-400 shadow-lg' 
        : 'border border-slate-200 hover:shadow-xl'}
    `}>
      {/* Admin Controls */}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-30 flex gap-2">
            <button className="bg-white/90 p-2 rounded-full shadow-sm border border-slate-200 text-blue-600 hover:bg-blue-50 transition-colors" title="Editar">
                <Pencil className="w-4 h-4" />
            </button>
            <button className="bg-white/90 p-2 rounded-full shadow-sm border border-slate-200 text-red-600 hover:bg-red-50 transition-colors" title="Eliminar">
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
      )}

      {/* Promoted Badge */}
      {professional.isPromoted && (
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-3 py-1 text-center tracking-wider shadow-sm uppercase">
          Destacado · Recomendado
        </div>
      )}

      <div className="relative h-48 overflow-hidden">
        <img 
          src={professional.imageUrl} 
          alt={professional.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/600x400/f1f5f9/64748b?text=Imagen+No+Disponible';
          }}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-slate-700 shadow-sm border border-slate-100 mt-6 md:mt-0">
          {professional.priceRange}
        </div>
        {professional.isVerified && (
          <div className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <CheckCircle className="w-3 h-3" /> Verificado
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <div>
                 <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-1">
                   {professional.category}
                 </span>
                 <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                   {professional.name}
                 </h3>
                 <p className="text-xs text-slate-500 mt-1">{professional.title}</p>
            </div>
            <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 flex-shrink-0 ml-2">
                <Star className="w-4 h-4 text-amber-400 fill-current" />
                <span className="ml-1 text-sm font-bold text-amber-700">{professional.rating}</span>
            </div>
        </div>
        
        <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-grow mt-2">{professional.description}</p>
        
        <div className="space-y-3 mt-auto">
          <div className="flex flex-wrap gap-2">
            {(professional.tags || []).map((tag) => (
              <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                {tag}
              </span>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="truncate max-w-[150px]" title={professional.location}>
                  {professional.location} ({professional.department})
                </span>
              </div>
              {distance !== undefined && distance !== null && distance !== Infinity && (
                 <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 whitespace-nowrap">
                   a {distance.toFixed(1)} km
                 </span>
              )}
            </div>
            
             <div className="flex items-center gap-1 text-sm text-slate-500">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{professional.availability}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-3">
             <button 
              onClick={openInMaps}
              className="flex items-center justify-center gap-2 w-full bg-slate-50 border border-slate-200 text-slate-600 py-2 rounded-lg font-medium hover:bg-slate-100 hover:text-slate-900 transition-colors text-sm"
             >
                <Map className="w-4 h-4" />
                Ver Mapa
             </button>
             <button onClick={handleContact} className="w-full bg-blue-600 border border-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm shadow-sm flex items-center justify-center gap-1">
               <MessageSquare className="w-4 h-4" /> Contactar
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
