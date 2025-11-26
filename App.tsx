import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { ServiceCard } from './components/ServiceCard';
import { MarketStats } from './components/MarketStats';
import { AdCard, SidebarAd } from './components/AdCard';
import { AdminDashboard } from './components/AdminDashboard';
import { ServiceForm } from './components/ServiceForm';
import { ProfessionalsLanding } from './components/ProfessionalsLanding';
import { MOCK_PROFESSIONALS, DEPARTMENTS, MOCK_ADS } from './constants';
import { Category, Professional, Coordinates, ViewMode, Advertisement } from './types';
import { Search, Sparkles, Filter, AlertCircle, MapPin, Wand2, ArrowRight, ShieldCheck, LogOut, X } from 'lucide-react';
import { getIntelligentRecommendations } from './services/geminiService';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  // --- STATE ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('HOME');
  
  // Data State
  const [professionals, setProfessionals] = useState<Professional[]>(MOCK_PROFESSIONALS);
  const [ads, setAds] = useState<Advertisement[]>(MOCK_ADS);

  // --- HYBRID DATA LOADING ---
  useEffect(() => {
    const loadData = async () => {
      // 1. Try Loading from LocalStorage first (Instant)
      try {
        const localPros = localStorage.getItem('prospot_professionals');
        if (localPros) {
            const parsed = JSON.parse(localPros);
            if(Array.isArray(parsed)) setProfessionals(parsed);
        }
        
        const localAds = localStorage.getItem('prospot_ads');
        if (localAds) {
            const parsed = JSON.parse(localAds);
            if(Array.isArray(parsed)) setAds(parsed);
        }
      } catch(e) { console.error("Local storage error", e); }

      // 2. Try Loading from Supabase (Server) if configured
      if (supabase) {
        try {
          const { data: proData, error: proError } = await supabase.from('professionals').select('*');
          if (proData && !proError) {
             setProfessionals(proData as unknown as Professional[]);
             // Update local storage cache
             localStorage.setItem('prospot_professionals', JSON.stringify(proData));
          }

          const { data: adData, error: adError } = await supabase.from('ads').select('*');
          if (adData && !adError) {
             setAds(adData as unknown as Advertisement[]);
             localStorage.setItem('prospot_ads', JSON.stringify(adData));
          }
        } catch (err) {
          console.log("Supabase connection skipped or failed, using local data.");
        }
      }
    };
    loadData();
  }, []);

  // Sync to LocalStorage on Change (Cache mechanism)
  useEffect(() => {
    localStorage.setItem('prospot_professionals', JSON.stringify(professionals));
  }, [professionals]);

  useEffect(() => {
    localStorage.setItem('prospot_ads', JSON.stringify(ads));
  }, [ads]);
  
  // Search State
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.ALL);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPros, setFilteredPros] = useState<Professional[]>([]);
  
  // AI & Geo State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Modal State
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Filter Ads
  const feedAds = (ads || []).filter(ad => ad.position === 'feed');
  const sidebarAds = (ads || []).filter(ad => ad.position === 'sidebar');

  // --- CRUD OPERATIONS (HYBRID) ---
  const handleAddProfessional = async (newPro: Professional) => {
    // Optimistic Update
    setProfessionals(prev => [newPro, ...prev]);
    
    // DB Update
    if (supabase) {
        await supabase.from('professionals').insert([newPro]);
    }

    if (!isAdmin) {
        alert("¡Gracias! Tu servicio ha sido enviado.");
        setIsPublishModalOpen(false);
    }
  };

  const handleUpdateProfessional = async (updatedPro: Professional) => {
    setProfessionals(prev => prev.map(p => p.id === updatedPro.id ? updatedPro : p));
    
    if (supabase) {
        await supabase.from('professionals').update(updatedPro).eq('id', updatedPro.id);
    }
  };

  const handleDeleteProfessional = async (id: string) => {
    setProfessionals(prev => prev.filter(p => p.id !== id));
    
    if (supabase) {
        await supabase.from('professionals').delete().eq('id', id);
    }
  };

  // --- ADS CRUD ---
  const handleAddAd = async (newAd: Advertisement) => {
      setAds(prev => [...prev, newAd]);
      if (supabase) await supabase.from('ads').insert([newAd]);
  };

  const handleUpdateAd = async (updatedAd: Advertisement) => {
      setAds(prev => prev.map(a => a.id === updatedAd.id ? updatedAd : a));
      if (supabase) await supabase.from('ads').update(updatedAd).eq('id', updatedAd.id);
  };

  const handleDeleteAd = async (id: string) => {
      setAds(prev => prev.filter(a => a.id !== id));
      if (supabase) await supabase.from('ads').delete().eq('id', id);
  };

  // Haversine formula
  const calculateDistance = (lat1?: number, lon1?: number, lat2?: number, lon2?: number) => {
    if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return Infinity;
    
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    const d = R * c; 
    return d;
  };

  const handleNearMe = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Tu navegador no soporta geolocalización");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setIsLocating(false);
        setSelectedDepartment('Todos');
      },
      (error) => {
        console.error(error);
        setLocationError("No pudimos obtener tu ubicación.");
        setIsLocating(false);
      }
    );
  };

  // Filter & Sort Logic
  useEffect(() => {
    let result = professionals || [];

    if (selectedCategory !== Category.ALL) {
      result = result.filter(pro => pro.category === selectedCategory);
    }

    if (selectedDepartment !== 'Todos') {
      result = result.filter(pro => pro.department === selectedDepartment);
    }

    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(pro => 
        (pro.name || '').toLowerCase().includes(lowerQuery) ||
        (pro.title || '').toLowerCase().includes(lowerQuery) ||
        (pro.description || '').toLowerCase().includes(lowerQuery) ||
        (pro.tags || []).some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }
    
    result.sort((a, b) => {
      if (!a || !b) return 0;
      
      if (a.isPromoted && !b.isPromoted) return -1;
      if (!a.isPromoted && b.isPromoted) return 1;

      if (userLocation) {
        const distA = calculateDistance(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude);
        const distB = calculateDistance(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude);
        return distA - distB;
      }
      return (b.rating || 0) - (a.rating || 0);
    });

    setFilteredPros([...result]);
  }, [selectedCategory, searchQuery, selectedDepartment, userLocation, professionals]);

  const handleAiSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsAiLoading(true);
    setAiReasoning(null);
    
    try {
      const recommendation = await getIntelligentRecommendations(searchQuery);
      
      if (recommendation) {
        if (recommendation.targetCategory !== 'Unknown' && Object.values(Category).includes(recommendation.targetCategory as Category)) {
             setSelectedCategory(recommendation.targetCategory as Category);
        } else {
             setSelectedCategory(Category.ALL);
        }
        setAiReasoning(recommendation.reasoning);
      }
    } catch (error) {
      console.error("Failed AI search", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const clearFilters = () => {
      setSearchQuery('');
      setSelectedCategory(Category.ALL);
      setSelectedDepartment('Todos');
      setAiReasoning(null);
      setUserLocation(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-16">
      <Header 
        onAdminLogin={() => { setIsAdmin(true); setViewMode('ADMIN_DASHBOARD'); }} 
        isAdmin={isAdmin} 
        onOpenPublishModal={() => setIsPublishModalOpen(true)}
        onOpenAdminPanel={() => setViewMode('ADMIN_DASHBOARD')}
        onGoToProfessionals={() => setViewMode('PROFESSIONALS_LANDING')}
        onGoHome={() => setViewMode('HOME')}
      />

      {/* --- PUBLISH SERVICE MODAL --- */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
                 <div className="flex justify-between items-center p-6 border-b border-slate-100">
                     <h3 className="text-xl font-bold text-slate-900">Publicar Servicio</h3>
                     <button onClick={() => setIsPublishModalOpen(false)} className="text-slate-400 hover:text-slate-800">
                         <X className="w-6 h-6" />
                     </button>
                 </div>
                 <div className="p-6">
                    <ServiceForm 
                        onSubmit={handleAddProfessional} 
                        onCancel={() => setIsPublishModalOpen(false)} 
                        isAdmin={isAdmin}
                    />
                 </div>
             </div>
        </div>
      )}

      {/* --- VIEW: ADMIN DASHBOARD --- */}
      {viewMode === 'ADMIN_DASHBOARD' && isAdmin ? (
        <AdminDashboard 
            professionals={professionals}
            ads={ads}
            onAdd={handleAddProfessional}
            onUpdate={handleUpdateProfessional}
            onDelete={handleDeleteProfessional}
            onAddAd={handleAddAd}
            onUpdateAd={handleUpdateAd}
            onDeleteAd={handleDeleteAd}
            onClose={() => setViewMode('HOME')}
        />
      ) : viewMode === 'PROFESSIONALS_LANDING' ? (
        /* --- VIEW: PROFESSIONALS LANDING --- */
        <ProfessionalsLanding 
            onRegister={() => setIsPublishModalOpen(true)}
            onBack={() => setViewMode('HOME')}
        />
      ) : (
        /* --- VIEW: HOME (SEARCH) --- */
        <>
        {/* Hero Section */}
        <div className="bg-slate-900 pt-16 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex-shrink-0">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                 <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                     <path d="M0 100 L100 0 L0 0 Z" fill="white" />
                 </svg>
            </div>
            
            <div className="max-w-4xl mx-auto relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                Lo que necesitas, <br/>
                <span className="text-amber-400">hecho por quien sabe.</span>
            </h1>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                Desde reparaciones del hogar hasta consultoría de negocios. Conectamos talento local con necesidades reales.
            </p>

            <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
                <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="¿Qué necesitas? Ej: 'Mi lavadora no funciona'"
                    className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                />
                </div>
                
                <div className="flex gap-2">
                    <button 
                    onClick={handleNearMe}
                    className={`
                        px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border-2 text-blue-600 md:text-white hover:bg-slate-800
                        ${isLocating ? 'animate-pulse' : ''}
                        ${userLocation ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white md:bg-slate-700 border-transparent'}
                    `}
                    >
                    {isLocating ? (
                        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    ) : userLocation ? (
                        <MapPin className="w-5 h-5" />
                    ) : (
                        <Wand2 className="w-5 h-5" />
                    )}
                    <span className="hidden md:inline">{userLocation ? 'Ubicación Activa' : 'Cerca de mí'}</span>
                    </button>

                    <button 
                    onClick={handleAiSearch}
                    disabled={isAiLoading}
                    className={`
                        bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                        ${isAiLoading ? 'opacity-70 cursor-wait' : ''}
                    `}
                    >
                    {isAiLoading ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                        <Sparkles className="w-5 h-5" />
                    )}
                    <span className="hidden sm:inline">Buscar IA</span>
                    </button>
                </div>
            </div>
            
            {locationError && (
                <div className="mt-4 inline-block bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium animate-bounce">
                    {locationError}
                </div>
            )}

            {aiReasoning && (
                <div className="mt-6 inline-flex items-start gap-3 bg-slate-800/80 backdrop-blur-md text-slate-200 px-6 py-4 rounded-xl border border-slate-700 text-left max-w-2xl animate-fade-in">
                    <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-white mb-1">Sugerencia IA:</p>
                        <p className="text-sm opacity-90">{aiReasoning}</p>
                        <button onClick={() => setAiReasoning(null)} className="text-xs text-amber-300 hover:text-white mt-2 underline">Ocultar</button>
                    </div>
                </div>
            )}
            </div>
        </div>

        {/* Main Content Grid - 3 Column Layout */}
        <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 flex-grow pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Filters (Desktop) */}
            <aside className="hidden lg:block lg:col-span-3 xl:col-span-2 space-y-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 sticky top-24">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-slate-600" />
                        <h3 className="font-bold text-slate-800">Filtros</h3>
                    </div>

                    {/* Department Filter */}
                    <div className="mb-6">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Departamento</label>
                        <select 
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        >
                            <option value="Todos">Todos los departamentos</option>
                            {DEPARTMENTS.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Categoría</label>
                        {Object.values(Category).map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    selectedCategory === cat 
                                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                
                <MarketStats />
            </aside>

            {/* CENTER COLUMN: Listings */}
            <section className="lg:col-span-9 xl:col-span-8">
                {/* Mobile Categories (Visible only on small screens) */}
                <div className="lg:hidden space-y-4 mb-6">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
                        <select 
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="w-full bg-transparent text-slate-800 font-medium focus:outline-none"
                        >
                            <option value="Todos">📍 Todos los departamentos</option>
                            {DEPARTMENTS.map(dept => (
                                <option key={dept} value={dept}>📍 {dept}</option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                        <CategoryFilter 
                            selectedCategory={selectedCategory} 
                            onSelectCategory={setSelectedCategory} 
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {selectedCategory === Category.ALL ? 'Profesionales Destacados' : selectedCategory}
                        </h2>
                        {userLocation && (
                            <p className="text-sm text-emerald-600 flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" />
                                Ordenado por cercanía a tu ubicación
                            </p>
                        )}
                    </div>
                    <span className="text-slate-500 text-sm font-medium bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                        {filteredPros.length} resultados
                    </span>
                </div>
                
                {filteredPros.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm">
                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No encontramos resultados</h3>
                        <p className="text-slate-500 mb-6">Intenta cambiar los filtros o busca con otras palabras clave.</p>
                        <button 
                            onClick={clearFilters}
                            className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                        >
                            Limpiar búsqueda
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredPros.map((pro, index) => (
                            <React.Fragment key={pro.id}>
                                <ServiceCard 
                                    professional={pro} 
                                    distance={userLocation ? calculateDistance(userLocation.latitude, userLocation.longitude, pro.latitude, pro.longitude) : null}
                                    isAdmin={isAdmin}
                                />
                                {index === 2 && feedAds.length > 0 && (
                                    <AdCard ad={feedAds[0]} isAdmin={isAdmin} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </section>

            {/* RIGHT COLUMN: Sidebar Ads (Visible on XL screens) */}
            <aside className="hidden xl:block xl:col-span-2 space-y-6">
                <div className="sticky top-24 space-y-6">
                    {sidebarAds.map(ad => (
                         <SidebarAd key={ad.id} ad={ad} isAdmin={isAdmin} />
                    ))}
                    {sidebarAds.length === 0 && (
                        <div className="p-4 bg-slate-100 rounded-lg text-center text-slate-400 text-sm border border-dashed border-slate-300">
                            Espacio Publicitario
                        </div>
                    )}
                </div>
            </aside>

            </div>
        </main>

        {/* CTA Footer */}
        <footer className="bg-slate-900 text-slate-300 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-white mb-2">¿Ofreces un servicio en Mendoza?</h3>
                    <p className="text-slate-400 mb-4 max-w-md">Únete a nuestra base de datos verificada y llega a más clientes.</p>
                    <button 
                        onClick={() => setIsPublishModalOpen(true)}
                        className="inline-flex items-center gap-2 text-white font-bold hover:text-amber-400 transition-colors"
                    >
                        Registrar mi negocio <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-sm">
                    <h4 className="font-bold text-white mb-2">Cómo funciona</h4>
                    <ol className="text-sm space-y-2 text-slate-400 list-decimal list-inside">
                        <li>Completa el formulario de registro.</li>
                        <li>Nosotros validamos tu ubicación y datos.</li>
                        <li>Tu negocio aparecerá en el mapa y búsquedas.</li>
                    </ol>
                </div>
            </div>
        </footer>
        </>
      )}

      {/* ADMIN FLOATING BAR */}
      {isAdmin && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 text-white px-6 py-3 shadow-2xl flex justify-between items-center animate-slide-up border-t border-slate-700">
            <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span className="font-bold tracking-wide">MODO ADMIN ACTIVO</span>
            </div>
            <div className="flex items-center gap-4">
                {viewMode === 'HOME' ? (
                     <button onClick={() => setViewMode('ADMIN_DASHBOARD')} className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm transition-colors">
                        Ir al Panel
                     </button>
                ) : (
                     <button onClick={() => setViewMode('HOME')} className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm transition-colors">
                        Ver Sitio
                     </button>
                )}
                
                <button 
                  onClick={() => { setIsAdmin(false); setViewMode('HOME'); }} 
                  className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded text-sm font-bold flex items-center gap-2 transition-colors"
                >
                    <LogOut className="w-4 h-4" /> Salir
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;