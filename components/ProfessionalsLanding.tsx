
import React, { useState } from 'react';
import { Sparkles, MapPin, HeartHandshake, ArrowRight, Search, TrendingUp, Quote, Scale, ExternalLink, Wrench, Car, Monitor, Briefcase, Heart, GraduationCap, PartyPopper, LayoutGrid } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LabelList } from 'recharts';
import { Advertisement, Category } from '../types';
import { CATEGORIES } from '../constants';

interface ProfessionalsLandingProps {
  onRegister: () => void;
  onBack: () => void;
  onStartSearching?: () => void;
  ads: Advertisement[];
}

const data = [
  { name: 'Mes 1', consultas: 120 },
  { name: 'Mes 2', consultas: 300 },
  { name: 'Mes 3', consultas: 600 },
  { name: 'Mes 4', consultas: 1200 },
  { name: 'Mes 5', consultas: 2500 },
  { name: 'Mes 6', consultas: 4800 },
];

// Helper for category icons
const getCategoryIcon = (cat: Category) => {
  switch (cat) {
    case Category.HOME_REPAIR: return <Wrench className="w-6 h-6" />;
    case Category.AUTOMOTIVE: return <Car className="w-6 h-6" />;
    case Category.TECHNOLOGY: return <Monitor className="w-6 h-6" />;
    case Category.BUSINESS: return <Briefcase className="w-6 h-6" />;
    case Category.HEALTH: return <Heart className="w-6 h-6" />;
    case Category.EDUCATION: return <GraduationCap className="w-6 h-6" />;
    case Category.EVENTS: return <PartyPopper className="w-6 h-6" />;
    default: return <LayoutGrid className="w-6 h-6" />;
  }
};

export const ProfessionalsLanding: React.FC<ProfessionalsLandingProps> = ({ onRegister, onBack, onStartSearching, ads }) => {
  const [activeTab, setActiveTab] = useState<'SERVICES' | 'ABOUT'>('SERVICES');
  
  const handleSearchClick = onStartSearching || onBack;
  const bannerAd = ads.length > 0 ? ads[0] : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex">
          <button
            onClick={() => setActiveTab('SERVICES')}
            className={`flex-1 md:flex-none md:w-48 py-4 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'SERVICES' 
                ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Search className="w-4 h-4" /> Servicios
          </button>
          <button
            onClick={() => setActiveTab('ABOUT')}
            className={`flex-1 md:flex-none md:w-48 py-4 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'ABOUT' 
                ? 'border-amber-500 text-amber-600 bg-amber-50/50' 
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Qué es ProSpot
          </button>
        </div>
      </div>

      {/* --- TAB: SERVICIOS (Nueva Home) --- */}
      {activeTab === 'SERVICES' && (
        <div className="flex-grow animate-in fade-in duration-300">
          {/* Hero Search */}
          <div className="bg-slate-900 py-16 px-4 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                 <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 100 L100 0 L0 0 Z" fill="white" /></svg>
            </div>
            <div className="max-w-3xl mx-auto relative z-10">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
                Encuentra el profesional ideal <br/>
                <span className="text-amber-400">cerca de ti.</span>
              </h1>
              <div className="bg-white p-2 rounded-xl shadow-xl flex gap-2 max-w-xl mx-auto">
                 <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="¿Qué estás buscando hoy?" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none text-slate-900"
                      onClick={handleSearchClick}
                      readOnly
                    />
                 </div>
                 <button onClick={handleSearchClick} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                    Buscar
                 </button>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-blue-600" /> Categorías Populares
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATEGORIES.filter(c => c !== 'Todos').map((cat) => (
                <button 
                  key={cat}
                  onClick={handleSearchClick}
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 hover:-translate-y-1 transition-all group text-left"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    {getCategoryIcon(cat as Category)}
                  </div>
                  <h3 className="font-bold text-slate-800 group-hover:text-blue-700">{cat}</h3>
                  <p className="text-xs text-slate-500 mt-1">Ver profesionales</p>
                </button>
              ))}
            </div>
          </div>

          {/* Ad Banner inside Services */}
          {bannerAd && (
            <div className="max-w-7xl mx-auto px-4 mb-12">
               <a href={bannerAd.linkUrl} target="_blank" rel="noopener noreferrer" className="block relative overflow-hidden rounded-xl bg-slate-100 h-40 md:h-56 group">
                   <img src={bannerAd.imageUrl} alt={bannerAd.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                   <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent flex flex-col justify-center px-8">
                      <span className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">{bannerAd.advertiserName}</span>
                      <h3 className="text-2xl font-bold text-white max-w-md">{bannerAd.title}</h3>
                   </div>
                   <div className="absolute top-2 right-2 bg-white/20 text-[10px] text-white px-1 rounded">Publicidad</div>
               </a>
            </div>
          )}

          {/* CTA Register */}
          <div className="bg-blue-50 py-12 px-4 border-t border-blue-100">
             <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">¿Ofreces un servicio u oficio?</h2>
                <p className="text-slate-600 mb-6">Únete a la red de profesionales más grande de Mendoza y haz crecer tu negocio.</p>
                <button onClick={onRegister} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 shadow-lg inline-flex items-center gap-2">
                   Publicar mi Servicio Gratis <ArrowRight className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>
      )}

      {/* --- TAB: QUÉ ES PROSPOT (Contenido Original) --- */}
      {activeTab === 'ABOUT' && (
        <div className="animate-in fade-in duration-300">
          <div className="bg-slate-900 text-white pt-16 pb-16 px-4 relative overflow-hidden">
             <div className="max-w-4xl mx-auto text-center relative z-10">
                <span className="text-amber-400 font-bold tracking-wider uppercase text-sm mb-4 block">Innovación Local</span>
                <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">¿Por qué elegir <span className="text-blue-500">ProSpot?</span></h2>
                <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">Somos la única plataforma en Mendoza que combina Inteligencia Artificial y Geolocalización para conectar problemas reales con soluciones cercanas.</p>
             </div>
          </div>

          {/* Impact Section */}
          <div className="bg-white py-16 px-4 border-b border-slate-200">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-6 h-6 text-amber-500" />
                            <span className="text-amber-600 font-bold uppercase tracking-wider text-sm">Crecimiento Exponencial</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-6">
                            El alcance que tu negocio <br/>
                            <span className="text-blue-600">estaba esperando.</span>
                        </h2>
                        <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                            Olvídate de repartir volantes o depender solo del "boca a boca". Con ProSpot, tu servicio es visible para miles de personas justo en el momento en que tienen una urgencia.
                        </p>
                        <div className="flex items-center gap-6 mb-8">
                            <div>
                                <span className="block text-4xl font-extrabold text-slate-900">+25,000</span>
                                <span className="text-sm font-bold text-slate-500 uppercase">Clientes Potenciales</span>
                            </div>
                            <div className="h-12 w-px bg-slate-200"></div>
                            <div>
                                <span className="block text-4xl font-extrabold text-blue-600">100%</span>
                                <span className="text-sm font-bold text-slate-500 uppercase">Digital y Medible</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-inner">
                        <div className="mb-6 flex justify-between items-end">
                            <h3 className="text-sm font-bold text-slate-600 uppercase">Crecimiento de Consultas</h3>
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">+400% Digital</span>
                        </div>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#2563eb" stopOpacity={1}/>
                                            <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                                    <YAxis hide />
                                    <Tooltip 
                                        cursor={{fill: 'transparent'}}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <ReferenceLine y={500} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'insideTopRight', value: 'Alcance Tradicional', fill: '#d97706', fontSize: 10, fontWeight: 'bold' }} />
                                    <Bar dataKey="consultas" fill="url(#colorBar)" radius={[4, 4, 0, 0]} barSize={24}>
                                      <LabelList dataKey="consultas" position="top" style={{ fill: '#2563eb', fontSize: 10, fontWeight: 'bold' }} formatter={(value: number) => value > 1000 ? `+${(value/1000).toFixed(1)}k` : value} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">IA Inteligente</h3>
                    <p className="text-slate-600">No necesitas saber la categoría exacta. Solo escribe "mi auto hace ruido" y nuestra IA te conectará con el mecánico adecuado.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Cerca de Ti</h3>
                    <p className="text-slate-600">Priorizamos los servicios de tu barrio. Ahorra tiempo y dinero en traslados conectando con vecinos expertos.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                        <HeartHandshake className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Sin Intermediarios</h3>
                    <p className="text-slate-600">Trato directo. ProSpot no cobra comisiones por contratación.</p>
                </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-slate-100 py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Lo que dicen en Mendoza</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            name: "Mariana L.",
                            role: "Usuaria de Godoy Cruz",
                            text: "Se rompió una cañería un domingo. Usé el botón 'Cerca de mí' y en 15 minutos tenía un plomero del barrio arreglándolo. ¡Increíble!",
                            img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                        },
                        {
                            name: "Roberto F.",
                            role: "Mecánico en Guaymallén",
                            text: "Desde que publiqué mi taller en ProSpot, me llegan clientes de la zona que no sabían que yo existía. Muy fácil de usar.",
                            img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
                        },
                        {
                            name: "Lucía M.",
                            role: "Emprendedora",
                            text: "Buscaba alguien para reparar mi PC y encontré un técnico excelente a dos cuadras. Me ahorré el viaje al centro.",
                            img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
                        }
                    ].map((testimonial, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-slate-200 relative">
                            <Quote className="w-8 h-8 text-blue-100 absolute top-4 right-4" />
                            <div className="flex items-center gap-4 mb-4">
                                <img src={testimonial.img} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                                <div>
                                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                                    <p className="text-xs text-slate-500">{testimonial.role}</p>
                                </div>
                            </div>
                            <p className="text-slate-600 text-sm italic">"{testimonial.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="bg-slate-950 text-slate-500 py-12 px-4 border-t border-slate-900">
              <div className="max-w-4xl mx-auto text-center md:text-left">
                  <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                      <Scale className="w-5 h-5 text-slate-400" />
                      <h4 className="text-slate-300 font-bold uppercase tracking-wider text-sm">Exención de Responsabilidad Legal</h4>
                  </div>
                  <p className="text-xs md:text-sm leading-relaxed mb-4">
                      <strong>ProSpot</strong> actúa exclusivamente como una plataforma digital de intermediación y directorio.
                  </p>
                  <p className="text-xs md:text-sm leading-relaxed mb-4">
                      ProSpot, sus desarrolladores, administradores y personal asociado <strong>NO emplean, avalan, garantizan ni supervisan</strong> a los profesionales.
                  </p>
                  <div className="mt-8 pt-8 border-t border-slate-900 text-center text-xs">
                      &copy; {new Date().getFullYear()} ProSpot Mendoza. Todos los derechos reservados.
                  </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};
