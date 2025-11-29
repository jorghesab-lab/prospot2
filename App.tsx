
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { ServiceCard } from './components/ServiceCard';
import { AdCard, SidebarAd } from './components/AdCard';
import { AdminDashboard } from './components/AdminDashboard';
import { ServiceForm } from './components/ServiceForm';
import { ProfessionalsLanding } from './components/ProfessionalsLanding';
import { AuthModal } from './components/AuthModal';
import { UserProfile } from './components/UserProfile';
import { MOCK_PROFESSIONALS, DEPARTMENTS, MOCK_ADS, CATEGORY_DEFAULT_IMAGES } from './constants';
import { Category, Professional, Coordinates, ViewMode, Advertisement, User, AuthMode, Review } from './types';
import { Search, Sparkles, Filter, AlertCircle, MapPin, Wand2, ArrowRight, ShieldCheck, LogOut, X, Lock, ExternalLink } from 'lucide-react';
import { getIntelligentRecommendations } from './services/geminiService';
import { supabase } from './services/supabase';

// Change this version string whenever you update MOCK data in constants.ts to force a client refresh
const DATA_VERSION = 'v4-ai-unlocked'; 

const App: React.FC = () => {
  // --- AUTH STATE ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]); 
  const [adminPassword, setAdminPassword] = useState('admin123');
  
  // --- APP STATE ---
  const [viewMode, setViewMode] = useState<ViewMode>('PROFESSIONALS_LANDING'); 
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // --- MODAL STATE ---
  // isPublishModalOpen REMOVED - Using full page view
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('LOGIN');

  // --- DATA LOADING ---
  useEffect(() => {
    const loadData = async () => {
      // 0. CHECK DATA VERSION (Force Refresh Logic)
      const currentVersion = localStorage.getItem('prospot_data_version');
      let shouldForceReload = false;

      if (currentVersion !== DATA_VERSION) {
          console.log("Nueva versión detectada. Actualizando directorio...");
          // We clear content data, but keep user accounts/auth
          localStorage.removeItem('prospot_professionals');
          localStorage.removeItem('prospot_ads');
          localStorage.setItem('prospot_data_version', DATA_VERSION);
          shouldForceReload = true;
      }

      // 1. Load Auth/User Data (Persisted)
      const savedPass = localStorage.getItem('prospot_admin_pass');
      if (savedPass) setAdminPassword(savedPass);

      const savedUsers = localStorage.getItem('prospot_users');
      if (savedUsers) setUsers(JSON.parse(savedUsers));

      const savedReviews = localStorage.getItem('prospot_reviews');
      if (savedReviews) setReviews(JSON.parse(savedReviews));

      // 2. Load Services/Ads (Hybrid)
      if (supabase && !shouldForceReload) {
          // If we have supabase connection and didn't just force a reset
          try {
              const { data: prosData } = await supabase.from('professionals').select('*');
              const { data: adsData } = await supabase.from('ads').select('*');
              
              if (prosData && prosData.length > 0) {
                  setProfessionals(fixImages(prosData as Professional[]));
              } else {
                  loadLocalData('pros');
              }

              if (adsData && adsData.length > 0) {
                  setAds(adsData as Advertisement[]);
              } else {
                  loadLocalData('ads');
              }
              return;
          } catch (err) { console.error("Error conectando a Supabase:", err); }
      }
      
      // Fallback to local data (or if forced reload)
      loadLocalData('all', shouldForceReload);
    };

    const loadLocalData = (type: 'pros' | 'ads' | 'all', forceReset = false) => {
        if (type === 'pros' || type === 'all') {
            const localPros = localStorage.getItem('prospot_professionals');
            if (localPros && !forceReset) {
                const parsed = JSON.parse(localPros);
                if (Array.isArray(parsed) && parsed.length > 0) setProfessionals(fixImages(parsed));
                else setProfessionals(MOCK_PROFESSIONALS);
            } else {
                setProfessionals(MOCK_PROFESSIONALS); // Load new Mendoza data
            }
        }
        if (type === 'ads' || type === 'all') {
            const localAds = localStorage.getItem('prospot_ads');
            if (localAds && !forceReset) {
                const parsed = JSON.parse(localAds);
                setAds(Array.isArray(parsed) ? parsed : MOCK_ADS);
            } else {
                setAds(MOCK_ADS); // Load new Ads
            }
        }
    };
    loadData();
  }, []);

  const fixImages = (pros: Professional[]): Professional[] => {
      return pros.map(p => {
          if (!p.imageUrl || p.imageUrl.includes('picsum.photos') || p.imageUrl.includes('placehold.co')) {
              return { ...p, imageUrl: CATEGORY_DEFAULT_IMAGES[p.category] || CATEGORY_DEFAULT_IMAGES[Category.ALL] };
          }
          return p;
      });
  };

  // --- PERSISTENCE ---
  useEffect(() => {
    if (professionals.length > 0) localStorage.setItem('prospot_professionals', JSON.stringify(professionals));
  }, [professionals]);
  useEffect(() => {
    if (ads.length > 0) localStorage.setItem('prospot_ads', JSON.stringify(ads));
  }, [ads]);
  useEffect(() => {
    localStorage.setItem('prospot_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('prospot_admin_pass', adminPassword);
  }, [adminPassword]);
  useEffect(() => {
    localStorage.setItem('prospot_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // --- SEARCH STATE ---
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.ALL);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPros, setFilteredPros] = useState<Professional[]>([]);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);

  // --- AUTH ACTIONS ---
  const handleLogin = (user: User) => {
    // Check if user exists in our "DB", if not add them
    const existingIndex = users.findIndex(u => u.email === user.email);
    let finalUser = user;
    
    if (existingIndex === -1) {
        setUsers(prev => [...prev, user]);
    } else {
        // If exists, load their full profile (history, id, etc)
        finalUser = users[existingIndex];
        // Ensure favorites array exists for old users
        if (!finalUser.favorites) finalUser.favorites = [];
    }
    setCurrentUser(finalUser);
    setIsAuthModalOpen(false);
    // If just registered/logged in and is provider, maybe prompt to create service?
    if (finalUser.role === 'PROVIDER') setViewMode('USER_PROFILE'); 
    else setViewMode('HOME');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setViewMode('PROFESSIONALS_LANDING'); 
  };

  const handleDeleteUser = (id: string) => {
      setUsers(prev => prev.filter(u => u.id !== id));
  };

  // --- CONTACT HISTORY LOGIC ---
  const handleContactProfessional = (proId: string) => {
      if (!currentUser) return; // Should allow guest? No, requireAuth handled view.
      
      // Prevent duplicates in history
      if (!currentUser.contactHistory.includes(proId)) {
          const updatedUser = { ...currentUser, contactHistory: [...currentUser.contactHistory, proId] };
          setCurrentUser(updatedUser);
          setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      }
  };

  // --- FAVORITES LOGIC ---
  const handleToggleFavorite = (proId: string) => {
      if (!currentUser) {
          setAuthMode('LOGIN');
          setIsAuthModalOpen(true);
          return;
      }

      const isFav = (currentUser.favorites || []).includes(proId);
      let newFavorites = [];
      
      if (isFav) {
          newFavorites = (currentUser.favorites || []).filter(id => id !== proId);
      } else {
          newFavorites = [...(currentUser.favorites || []), proId];
      }

      const updatedUser = { ...currentUser, favorites: newFavorites };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  // --- REVIEWS LOGIC ---
  const handleSubmitReview = (proId: string, rating: number, comment: string) => {
      if (!currentUser) return;
      const newReview: Review = {
          id: Date.now().toString(),
          userId: currentUser.id,
          professionalId: proId,
          rating,
          comment,
          createdAt: new Date().toISOString()
      };
      setReviews(prev => [...prev, newReview]);
      alert("¡Gracias por tu calificación!");
  };

  // --- CORE FEATURES BLOCKED IF NOT LOGGED IN ---
  const requireAuth = (action: () => void) => {
      if (!currentUser && !isAdmin) {
          setAuthMode('LOGIN');
          setIsAuthModalOpen(true);
      } else {
          action();
      }
  };

  const handleNearMe = () => {
      // Unlocked for everyone (Search is free)
      setIsLocating(true);
      if (!navigator.geolocation) {
        setIsLocating(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
          setIsLocating(false);
          setSelectedDepartment('Todos');
        },
        (error) => { console.error(error); setIsLocating(false); }
      );
  };

  const handleAiSearch = async () => {
    // Unlocked for everyone (Search is free)
    if (!searchQuery.trim()) return;
    setIsAiLoading(true);
    try {
      const recommendation = await getIntelligentRecommendations(searchQuery);
      if (recommendation) {
        if (recommendation.targetCategory !== 'Unknown' && Object.values(Category).includes(recommendation.targetCategory as Category)) {
             setSelectedCategory(recommendation.targetCategory as Category);
        }
        setAiReasoning(recommendation.reasoning);
      }
    } catch (error) { console.error("AI Error", error); } 
    finally { setIsAiLoading(false); }
  };

  // --- CRUD OPERATIONS ---
  const handleAddProfessional = async (newPro: Professional) => {
    setProfessionals(prev => [newPro, ...prev]);
    if (supabase) await supabase.from('professionals').insert([newPro]);
    
    alert("¡Felicidades! Tu servicio ha sido publicado exitosamente.");
    if (!isAdmin) {
        setViewMode('USER_PROFILE'); // Go back to profile after publishing
    }
  };
  const handleUpdateProfessional = async (updatedPro: Professional) => {
    setProfessionals(prev => prev.map(p => p.id === updatedPro.id ? updatedPro : p));
    if (supabase) await supabase.from('professionals').update(updatedPro).eq('id', updatedPro.id);
  };
  const handleDeleteProfessional = async (id: string) => {
    setProfessionals(prev => prev.filter(p => p.id !== id));
    if (supabase) await supabase.from('professionals').delete().eq('id', id);
  };
  const handleAddAd = (newAd: Advertisement) => setAds(prev => [...prev, newAd]);
  const handleUpdateAd = (updatedAd: Advertisement) => setAds(prev => prev.map(a => a.id === updatedAd.id ? updatedAd : a));
  const handleDeleteAd = (id: string) => setAds(prev => prev.filter(a => a.id !== id));

  const calculateDistance = (lat1?: number, lon1?: number, lat2?: number, lon2?: number) => {
    if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return Infinity;
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    return R * c; 
  };

  // --- FILTER LOGIC ---
  useEffect(() => {
    let result = professionals || [];
    if (selectedCategory !== Category.ALL) result = result.filter(pro => pro.category === selectedCategory);
    if (selectedDepartment !== 'Todos') result = result.filter(pro => pro.department === selectedDepartment);
    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(pro => 
        (pro.name || '').toLowerCase().includes(lowerQuery) ||
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

  // Select ads for banners
  const topBannerAd = ads.length > 0 ? ads[0] : null;
  const bottomBannerAd = ads.length > 1 ? ads[1] : (ads.length > 0 ? ads[0] : null);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-16">
      <Header 
        onAdminLogin={() => { setIsAdmin(true); setViewMode('ADMIN_DASHBOARD'); }} 
        isAdmin={isAdmin} 
        onOpenPublishModal={() => setViewMode('CREATE_SERVICE')}
        onOpenAdminPanel={() => setViewMode('ADMIN_DASHBOARD')}
        onGoToProfessionals={() => setViewMode('PROFESSIONALS_LANDING')}
        onGoHome={() => setViewMode('PROFESSIONALS_LANDING')} 
        currentUser={currentUser}
        onOpenLogin={() => { setAuthMode('LOGIN'); setIsAuthModalOpen(true); }}
        onLogout={handleLogout}
        onGoToProfile={() => setViewMode('USER_PROFILE')}
        adminPasswordHash={adminPassword}
      />

      {isAuthModalOpen && (
        <AuthModal 
            onLogin={handleLogin} 
            onClose={() => setIsAuthModalOpen(false)}
            initialMode={authMode} 
        />
      )}

      {/* --- VIEWS --- */}
      {viewMode === 'ADMIN_DASHBOARD' && isAdmin ? (
        <AdminDashboard 
            professionals={professionals}
            ads={ads}
            users={users}
            onAdd={handleAddProfessional}
            onUpdate={handleUpdateProfessional}
            onDelete={handleDeleteProfessional}
            onAddAd={handleAddAd}
            onUpdateAd={handleUpdateAd}
            onDeleteAd={handleDeleteAd}
            onDeleteUser={handleDeleteUser}
            onChangeAdminPassword={setAdminPassword}
            onClose={() => setViewMode('PROFESSIONALS_LANDING')}
        />
      ) : viewMode === 'USER_PROFILE' && currentUser ? (
        <UserProfile 
            user={currentUser}
            professionals={professionals}
            reviews={reviews}
            onSubmitReview={handleSubmitReview}
            onGoHome={() => setViewMode('HOME')}
            onPublishService={() => setViewMode('CREATE_SERVICE')}
        />
      ) : viewMode === 'CREATE_SERVICE' ? (
        <div className="py-12 px-4 max-w-5xl mx-auto">
            <ServiceForm 
                onSubmit={handleAddProfessional} 
                onCancel={() => setViewMode(currentUser ? 'USER_PROFILE' : 'HOME')} 
                isAdmin={isAdmin} 
            />
        </div>
      ) : viewMode === 'PROFESSIONALS_LANDING' ? (
        <ProfessionalsLanding 
            onRegister={() => { setAuthMode('REGISTER_PROVIDER'); setIsAuthModalOpen(true); }}
            onStartSearching={() => setViewMode('HOME')}
            onBack={() => setViewMode('HOME')} 
            ads={ads}
        />
      ) : (
        /* HOME VIEW (SEARCH) */
        <>
        {/* TOP BANNER AD (FIXED BELOW MENU) */}
        <div className="bg-slate-50 pt-16">
            {topBannerAd && (
                 <div className="max-w-7xl mx-auto px-4 py-2">
                     <a href={topBannerAd.linkUrl} target="_blank" rel="noopener noreferrer" className="block relative overflow-hidden rounded-xl shadow-md group">
                         <div className="h-20 sm:h-24 overflow-hidden relative">
                             <img src={topBannerAd.imageUrl} alt={topBannerAd.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                             <div className="absolute inset-0 bg-black/40 flex items-center px-6">
                                 <div>
                                     <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">{topBannerAd.advertiserName}</span>
                                     <h3 className="text-white font-bold text-lg leading-tight">{topBannerAd.title}</h3>
                                 </div>
                                 <ExternalLink className="w-5 h-5 text-white ml-auto opacity-70 group-hover:opacity-100" />
                             </div>
                             <div className="absolute top-1 right-1 bg-white/20 text-[9px] text-white px-1.5 rounded uppercase font-bold">Publicidad</div>
                         </div>
                     </a>
                 </div>
            )}
        </div>

        <div className="bg-slate-900 py-12 px-4 relative overflow-hidden flex-shrink-0">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                 <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 100 L100 0 L0 0 Z" fill="white" /></svg>
            </div>
            <div className="max-w-4xl mx-auto relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Lo que necesitas, <span className="text-amber-400">hecho por quien sabe.</span></h1>
            
            <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="¿Qué necesitas? (Ej: 'Mi lavadora no funciona')"
                        className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-900 focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                        // Search unlocked, removed click handler that required auth
                    />
                </div>
                <div className="flex gap-2">
                    <button onClick={handleNearMe} className={`px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border-2 text-blue-600 md:text-white ${isLocating ? 'animate-pulse' : ''} ${userLocation ? 'bg-emerald-500 border-emerald-500' : 'bg-white md:bg-slate-700 border-transparent'}`}>
                       {userLocation ? <MapPin className="w-5 h-5" /> : <Wand2 className="w-5 h-5" />} <span className="hidden md:inline">Cerca de mí</span>
                    </button>
                    <button onClick={handleAiSearch} disabled={isAiLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                        {isAiLoading ? <span className="animate-spin w-5 h-5 border-2 border-white rounded-full"></span> : <Sparkles className="w-5 h-5" />} <span className="hidden sm:inline">Buscar IA</span>
                    </button>
                </div>
            </div>
            {aiReasoning && <div className="mt-6 inline-flex bg-slate-800/80 backdrop-blur-md text-slate-200 px-6 py-4 rounded-xl border border-slate-700"><p>{aiReasoning}</p></div>}
            </div>
        </div>

        <main className="max-w-[1600px] mx-auto px-4 -mt-12 relative z-20 flex-grow">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="hidden lg:block lg:col-span-3 xl:col-span-2 space-y-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 sticky top-48">
                    <div className="mb-6"><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Departamento</label><select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm">{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}<option value="Todos">Todos</option></select></div>
                    <div className="space-y-1">{Object.values(Category).map(cat => <button key={cat} onClick={() => setSelectedCategory(cat)} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedCategory === cat ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>{cat}</button>)}</div>
                </div>
            </aside>

            <section className="lg:col-span-9 xl:col-span-8">
                {/* REMOVED LOCK SCREEN - Search results are always visible */}
                <>
                    <div className="lg:hidden space-y-4 mb-6">
                        <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                        {filteredPros.map((pro, index) => (
                            <React.Fragment key={pro.id}>
                                <ServiceCard 
                                    professional={pro} 
                                    distance={userLocation ? calculateDistance(userLocation.latitude, userLocation.longitude, pro.latitude, pro.longitude) : null}
                                    isAdmin={isAdmin}
                                    onContact={() => requireAuth(() => handleContactProfessional(pro.id))} // Block Contact
                                    isAuthenticated={!!currentUser || isAdmin} // Pass auth state to card to hide address/map
                                    onRequireAuth={() => requireAuth(() => {})} // Pass auth trigger
                                    isFavorite={(currentUser?.favorites || []).includes(pro.id)}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                                {index === 2 && (ads.filter(a => a.position === 'feed')[0]) && <AdCard ad={ads.filter(a => a.position === 'feed')[0]} isAdmin={isAdmin} />}
                            </React.Fragment>
                        ))}
                    </div>
                </>
            </section>

            <aside className="hidden xl:block xl:col-span-2 space-y-6">
                <div className="sticky top-48 space-y-6">
                    {ads.filter(a => a.position === 'sidebar').map(ad => <SidebarAd key={ad.id} ad={ad} isAdmin={isAdmin} />)}
                </div>
            </aside>
            </div>
            
            {/* BOTTOM BANNER (ABAJO DE TODO) */}
            {bottomBannerAd && (
                <div className="mt-16 mb-8 max-w-5xl mx-auto">
                    <a href={bottomBannerAd.linkUrl} target="_blank" rel="noopener noreferrer" className="block relative overflow-hidden rounded-2xl shadow-lg group h-48 sm:h-64">
                        <img src={bottomBannerAd.imageUrl} alt={bottomBannerAd.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent flex flex-col justify-center px-8 sm:px-12">
                            <span className="text-amber-400 font-bold uppercase tracking-wider text-sm mb-2">{bottomBannerAd.advertiserName}</span>
                            <h3 className="text-3xl font-extrabold text-white mb-4 leading-tight max-w-md">{bottomBannerAd.title}</h3>
                            <div className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-4 py-2 rounded-lg self-start text-sm hover:bg-slate-100 transition-colors">
                                Ver Más <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur px-2 py-1 rounded text-[10px] text-white font-bold uppercase border border-white/30">
                            Publicidad
                        </div>
                    </a>
                </div>
            )}
        </main>
        
        <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">¿Ofreces un servicio?</h3>
                    <button onClick={() => { setAuthMode('REGISTER_PROVIDER'); setIsAuthModalOpen(true); }} className="inline-flex items-center gap-2 text-white font-bold hover:text-amber-400">Registrar mi negocio <ArrowRight className="w-4 h-4" /></button>
                </div>
                <div className="text-sm text-slate-500">
                    &copy; 2024 ProSpot Mendoza. Todos los derechos reservados.
                </div>
            </div>
        </footer>
        </>
      )}

      {isAdmin && (
        <div className="fixed bottom-0 w-full bg-slate-900 text-white px-6 py-3 flex justify-between items-center z-50 border-t border-slate-700">
            <div className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-amber-400" /><span className="font-bold">MODO ADMIN</span></div>
            <div className="flex gap-4">
                <button onClick={() => setViewMode(viewMode === 'HOME' ? 'ADMIN_DASHBOARD' : 'HOME')} className="bg-slate-700 px-3 py-1 rounded text-sm">{viewMode === 'HOME' ? 'Panel' : 'Ver Web'}</button>
                <button onClick={() => { setIsAdmin(false); setViewMode('PROFESSIONALS_LANDING'); }} className="bg-red-600 px-4 py-1.5 rounded text-sm font-bold flex gap-2"><LogOut className="w-4 h-4" /> Salir</button>
            </div>
        </div>
      )}
    </div>
  );
};
export default App;