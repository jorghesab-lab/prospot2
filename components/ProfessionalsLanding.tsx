import React from 'react';
import { Sparkles, MapPin, Users, ShieldCheck, ArrowRight, ArrowLeft, Search, HeartHandshake, Quote } from 'lucide-react';

interface ProfessionalsLandingProps {
  onRegister: () => void;
  onBack: () => void;
}

export const ProfessionalsLanding: React.FC<ProfessionalsLandingProps> = ({ onRegister, onBack }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M0 100 L100 0 L0 0 Z" fill="white" />
             </svg>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <button 
            onClick={onBack}
            className="absolute top-[-3rem] left-0 text-slate-400 hover:text-white flex items-center gap-2 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </button>

          <span className="text-amber-400 font-bold tracking-wider uppercase text-sm mb-4 block">Innovación Local</span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            ¿Por qué elegir <span className="text-blue-500">ProSpot?</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Somos la única plataforma en Mendoza que combina Inteligencia Artificial y Geolocalización para conectar problemas reales con soluciones cercanas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
                onClick={onRegister}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
            >
                Publicar mi Servicio <ArrowRight className="w-5 h-5" />
            </button>
            <button 
                onClick={onBack}
                className="bg-slate-800 hover:bg-slate-700 text-white text-lg font-bold px-8 py-4 rounded-xl transition-all border border-slate-700"
            >
                Buscar Profesionales
            </button>
          </div>
        </div>
      </div>

      {/* Main Advantages Grid */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Tecnología al servicio de la comunidad</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
                Hemos eliminado las barreras tradicionales. Olvídate de directorios en papel o búsquedas interminables en redes sociales.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                    <Sparkles className="w-6 h-6 text-blue-600 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Búsqueda con IA</h3>
                <p className="text-slate-600 text-sm">
                    No necesitas saber el nombre técnico. Dinos <em>"se rompió la canilla"</em> y nuestra IA entenderá que necesitas un plomero.
                </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="bg-emerald-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors">
                    <MapPin className="w-6 h-6 text-emerald-600 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Geolocalización Real</h3>
                <p className="text-slate-600 text-sm">
                    Priorizamos lo local. Te mostramos primero a los profesionales que están en tu departamento o barrio, ahorrando tiempo y costos de traslado.
                </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="bg-amber-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-600 transition-colors">
                    <HeartHandshake className="w-6 h-6 text-amber-600 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Sin Comisiones</h3>
                <p className="text-slate-600 text-sm">
                    A diferencia de otras apps, nosotros no cobramos comisión por trabajo realizado. El trato y el pago son 100% directos entre tú y el profesional.
                </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                    <ShieldCheck className="w-6 h-6 text-purple-600 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Datos Verificados</h3>
                <p className="text-slate-600 text-sm">
                    Revisamos manualmente los perfiles destacados para asegurar que la información de contacto y ubicación sea real y segura.
                </p>
            </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-slate-50 py-20 px-4 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Historias de Mendoza</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Testimonial 1 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm relative">
                    <Quote className="w-10 h-10 text-blue-100 absolute top-6 left-6 -z-0" />
                    <p className="text-slate-600 italic mb-6 relative z-10 leading-relaxed">
                        "Se me rompió la cañería un domingo. Busqué 'plomero urgencia' en ProSpot y en 10 minutos ya estaba hablando con Mario. ¡Un genio que me salvó!"
                    </p>
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                        <img 
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100" 
                            alt="Ana María" 
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100" 
                        />
                        <div>
                            <h4 className="font-bold text-slate-900">Ana María</h4>
                            <p className="text-xs text-slate-500 font-medium">Vecina de Guaymallén</p>
                        </div>
                    </div>
                </div>

                {/* Testimonial 2 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm relative">
                    <Quote className="w-10 h-10 text-amber-100 absolute top-6 left-6 -z-0" />
                    <p className="text-slate-600 italic mb-6 relative z-10 leading-relaxed">
                        "Como electricista independiente, me costaba hacerme conocido. Desde que publiqué mi perfil acá, me llaman todas las semanas de mi zona. Sin vueltas."
                    </p>
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                        <img 
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100" 
                            alt="Roberto" 
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-100" 
                        />
                        <div>
                            <h4 className="font-bold text-slate-900">Roberto</h4>
                            <p className="text-xs text-slate-500 font-medium">Electricista en Godoy Cruz</p>
                        </div>
                    </div>
                </div>

                {/* Testimonial 3 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm relative">
                    <Quote className="w-10 h-10 text-emerald-100 absolute top-6 left-6 -z-0" />
                    <p className="text-slate-600 italic mb-6 relative z-10 leading-relaxed">
                        "Necesitaba alguien para arreglar el aire acondicionado y no confiaba en los anuncios de Facebook. Acá vi las fotos reales y la ubicación exacta. Muy seguro."
                    </p>
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                        <img 
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100" 
                            alt="Julián" 
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-100" 
                        />
                        <div>
                            <h4 className="font-bold text-slate-900">Julián</h4>
                            <p className="text-xs text-slate-500 font-medium">Capital, Mendoza</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">ProSpot vs. Otros Métodos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Traditional Way */}
                <div className="bg-slate-50 p-8 rounded-2xl border-l-4 border-slate-300 shadow-sm opacity-90">
                    <h3 className="text-xl font-bold text-slate-500 mb-6 flex items-center gap-2">
                        <Search className="w-5 h-5" /> Búsqueda Tradicional
                    </h3>
                    <ul className="space-y-4 text-slate-500">
                        <li className="flex items-start gap-3">
                            <span className="text-red-400 font-bold">✕</span>
                            <span>Resultados desordenados en Google Maps.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-red-400 font-bold">✕</span>
                            <span>Preguntar en grupos de Facebook y esperar horas.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-red-400 font-bold">✕</span>
                            <span>Números de teléfono desactualizados.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-red-400 font-bold">✕</span>
                            <span>Sin referencias claras de qué hacen.</span>
                        </li>
                    </ul>
                </div>

                {/* ProSpot Way */}
                <div className="bg-white p-8 rounded-2xl border-l-4 border-blue-500 shadow-xl transform md:scale-105">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                         <span className="text-blue-500 font-extrabold">ProSpot</span> Mendoza
                    </h3>
                    <ul className="space-y-4 text-slate-700 font-medium">
                        <li className="flex items-start gap-3">
                            <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <span>Catálogo organizado por rubros y zonas.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <span>Contacto inmediato por WhatsApp.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <span>Fotos reales de trabajos anteriores.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <span>IA que entiende tu problema.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </div>
      
      {/* Final CTA */}
      <div className="bg-slate-900 py-16 px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">¿Listo para encontrar u ofrecer soluciones?</h2>
          <div className="flex justify-center gap-4">
              <button 
                  onClick={onRegister}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-3 rounded-lg transition-colors"
              >
                  Publicar Servicio
              </button>
              <button 
                  onClick={onBack}
                  className="bg-transparent border border-white text-white hover:bg-white/10 font-bold px-8 py-3 rounded-lg transition-colors"
              >
                  Volver al Buscador
              </button>
          </div>
      </div>
    </div>
  );
};

// Helper Icon for this component
const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
);
