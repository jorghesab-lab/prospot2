
import React from 'react';
import { Sparkles, MapPin, ShieldCheck, ArrowRight, ArrowLeft, Search, HeartHandshake, Quote, CheckCircle, Scale, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProfessionalsLandingProps {
  onRegister: () => void;
  onBack: () => void;
  onStartSearching?: () => void;
}

const data = [
  { name: 'Mes 1', consultas: 120 },
  { name: 'Mes 2', consultas: 300 },
  { name: 'Mes 3', consultas: 600 },
  { name: 'Mes 4', consultas: 1200 },
  { name: 'Mes 5', consultas: 2500 },
  { name: 'Mes 6', consultas: 4800 },
];

export const ProfessionalsLanding: React.FC<ProfessionalsLandingProps> = ({ onRegister, onBack, onStartSearching }) => {
  const handleSearchClick = onStartSearching || onBack;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 100 L100 0 L0 0 Z" fill="white" /></svg>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-amber-400 font-bold tracking-wider uppercase text-sm mb-4 block">Innovación Local</span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">¿Por qué elegir <span className="text-blue-500">ProSpot?</span></h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">Somos la única plataforma en Mendoza que combina Inteligencia Artificial y Geolocalización para conectar problemas reales con soluciones cercanas.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleSearchClick} className="bg-white text-slate-900 hover:bg-slate-100 text-lg font-bold px-8 py-4 rounded-xl shadow-lg flex items-center justify-center gap-2">
               <Search className="w-5 h-5 text-blue-600" /> Explorar Servicios
            </button>
            <button onClick={onRegister} className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-4 rounded-xl border border-blue-500 flex items-center justify-center gap-2">
               Publicar mi Servicio <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Impact & Reach Section (NEW) */}
      <div className="bg-white py-16 px-4 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-6 h-6 text-amber-500" />
                        <span className="text-amber-600 font-bold uppercase tracking-wider text-sm">Crecimiento Exponencial</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
                        El alcance que tu negocio <br/>
                        <span className="text-blue-600">estaba esperando.</span>
                    </h2>
                    <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                        Olvídate de repartir volantes o depender solo del "boca a boca". Con ProSpot, tu servicio es visible para miles de personas justo en el momento en que tienen una urgencia.
                    </p>
                    
                    <div className="flex items-center gap-6 mb-8">
                        <div>
                            <span className="block text-4xl md:text-5xl font-extrabold text-slate-900">+25,000</span>
                            <span className="text-sm font-bold text-slate-500 uppercase">Clientes Potenciales</span>
                        </div>
                        <div className="h-12 w-px bg-slate-200"></div>
                        <div>
                            <span className="block text-4xl md:text-5xl font-extrabold text-blue-600">100%</span>
                            <span className="text-sm font-bold text-slate-500 uppercase">Digital y Medible</span>
                        </div>
                    </div>

                    <button onClick={onRegister} className="text-blue-600 font-bold hover:text-blue-800 flex items-center gap-2">
                        Ver planes para profesionales <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-inner">
                    <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 text-center">Proyección de Consultas Mensuales</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorConsultas" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <YAxis hide />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="consultas" stroke="#2563eb" fillOpacity={1} fill="url(#colorConsultas)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Tecnología al servicio de Mendoza</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                    <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">IA Inteligente</h3>
                <p className="text-slate-600">No necesitas saber la categoría exacta. Solo escribe "mi auto hace ruido" y nuestra IA te conectará con el mecánico adecuado.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                    <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Cerca de Ti</h3>
                <p className="text-slate-600">Priorizamos los servicios de tu barrio. Ahorra tiempo y dinero en traslados conectando con vecinos expertos.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                    <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Sin Intermediarios</h3>
                <p className="text-slate-600">Trato directo. ProSpot no cobra comisiones por contratación. El acuerdo es 100% entre tú y el profesional.</p>
            </div>
        </div>
      </div>

      {/* Testimonials Section */}
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

      {/* Final CTA */}
      <div className="bg-slate-900 py-16 px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">¿Listo para encontrar u ofrecer soluciones?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={onRegister} className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-3 rounded-lg">Publicar Servicio</button>
              <button onClick={handleSearchClick} className="bg-transparent border border-white text-white hover:bg-white hover:text-slate-900 font-bold px-8 py-3 rounded-lg">Buscar Ahora</button>
          </div>
      </div>

      {/* LEGAL NOTICE / DISCLAIMER */}
      <div className="bg-slate-950 text-slate-500 py-12 px-4 border-t border-slate-900">
          <div className="max-w-4xl mx-auto text-center md:text-left">
              <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                  <Scale className="w-5 h-5 text-slate-400" />
                  <h4 className="text-slate-300 font-bold uppercase tracking-wider text-sm">Exención de Responsabilidad Legal</h4>
              </div>
              <p className="text-xs md:text-sm leading-relaxed mb-4">
                  <strong>ProSpot</strong> actúa exclusivamente como una plataforma digital de intermediación y directorio ("Bolsa de Trabajo") que facilita el contacto entre usuarios y proveedores de servicios independientes.
              </p>
              <p className="text-xs md:text-sm leading-relaxed mb-4">
                  ProSpot, sus desarrolladores, administradores y personal asociado <strong>NO emplean, avalan, garantizan ni supervisan</strong> a los profesionales o negocios listados en esta aplicación. La contratación de cualquier servicio es un acuerdo privado y directo entre el Usuario y el Proveedor.
              </p>
              <p className="text-xs md:text-sm leading-relaxed">
                  En consecuencia, ProSpot <strong>no se hace responsable</strong> por daños, perjuicios, mala praxis, incumplimientos, robos, o cualquier conflicto de índole civil, penal o comercial que pudiera surgir derivado de los servicios contactados a través de esta plataforma. Recomendamos a los usuarios solicitar credenciales, matrículas y referencias antes de contratar.
              </p>
              
              <div className="mt-8 pt-8 border-t border-slate-900 text-center text-xs">
                  &copy; {new Date().getFullYear()} ProSpot Mendoza. Todos los derechos reservados.
              </div>
          </div>
      </div>
    </div>
  );
};
