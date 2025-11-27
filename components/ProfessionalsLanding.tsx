
import React from 'react';
import { Sparkles, MapPin, ShieldCheck, ArrowRight, ArrowLeft, Search, HeartHandshake, Quote, CheckCircle } from 'lucide-react';

interface ProfessionalsLandingProps {
  onRegister: () => void;
  onBack: () => void;
}

export const ProfessionalsLanding: React.FC<ProfessionalsLandingProps> = ({ onRegister, onBack }) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-900 text-white pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 100 L100 0 L0 0 Z" fill="white" /></svg>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <button onClick={onBack} className="absolute top-[-3rem] left-0 text-slate-400 hover:text-white flex items-center gap-2 font-medium"><ArrowLeft className="w-4 h-4" /> Volver al Inicio</button>
          <span className="text-amber-400 font-bold tracking-wider uppercase text-sm mb-4 block">Innovación Local</span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">¿Por qué elegir <span className="text-blue-500">ProSpot?</span></h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">Somos la única plataforma en Mendoza que combina Inteligencia Artificial y Geolocalización para conectar problemas reales con soluciones cercanas.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onRegister} className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg flex items-center justify-center gap-2">Publicar mi Servicio <ArrowRight className="w-5 h-5" /></button>
            <button onClick={onBack} className="bg-slate-800 hover:bg-slate-700 text-white text-lg font-bold px-8 py-4 rounded-xl border border-slate-700">Buscar Profesionales</button>
          </div>
        </div>
      </div>
      {/* Content remains mostly same, just ensuring buttons call onRegister correctly */}
      <div className="bg-slate-900 py-16 px-4 text-center mt-auto">
          <h2 className="text-3xl font-bold text-white mb-6">¿Listo para encontrar u ofrecer soluciones?</h2>
          <div className="flex justify-center gap-4">
              <button onClick={onRegister} className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-3 rounded-lg">Publicar Servicio</button>
          </div>
      </div>
    </div>
  );
};
