
import React, { useState, useEffect } from 'react';
import { Briefcase, Share2, X, Lock, LayoutDashboard, UserCircle, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  onAdminLogin: () => void;
  isAdmin: boolean;
  onOpenPublishModal: () => void;
  onOpenAdminPanel: () => void;
  onGoToProfessionals: () => void;
  onGoHome: () => void;
  // New Auth Props
  currentUser: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onGoToProfile: () => void; // New prop
  adminPasswordHash: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  onAdminLogin, isAdmin, onOpenPublishModal, onOpenAdminPanel, onGoToProfessionals, onGoHome,
  currentUser, onOpenLogin, onLogout, onGoToProfile, adminPasswordHash
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setClickCount(0), 2000);
    return () => clearTimeout(timer);
  }, [clickCount]);

  const handleLogoClick = () => {
    if (isAdmin) return;
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) {
      setShowLoginModal(true);
      setClickCount(0);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === adminPasswordHash) {
      onAdminLogin();
      setShowLoginModal(false);
      setPassword('');
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'ProSpot Mendoza',
      text: 'Encontrá profesionales y oficios cerca de tu casa en Mendoza.',
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else await navigator.clipboard.writeText(window.location.href);
    } catch (err) { console.error('Error al compartir', err); }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer select-none" 
              onClick={() => { onGoHome(); window.scrollTo(0, 0); handleLogoClick(); }}
            >
              <div className="p-2 rounded-lg flex items-center justify-center transition-colors bg-slate-900">
                <div className="relative">
                   <Briefcase className="w-6 h-6 text-white" />
                   <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-slate-900"></div>
                </div>
              </div>
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-slate-900">Pro</span>
                <span className="text-amber-500">Spot</span>
              </span>
            </div>

            <nav className="hidden md:flex space-x-8 items-center">
              <button onClick={onGoHome} className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Inicio</button>
            </nav>

            <div className="flex items-center gap-4">
              {isAdmin && (
                <button onClick={onOpenAdminPanel} className="hidden md:flex items-center gap-2 text-slate-700 hover:text-blue-600 font-bold">
                    <LayoutDashboard className="w-5 h-5" /> Ir al Panel
                </button>
              )}

              {(isAdmin || currentUser?.role === 'PROVIDER') && (
                  <button 
                    onClick={onOpenPublishModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <span className="hidden sm:inline">Publicar Servicio</span>
                    <span className="sm:hidden">Publicar</span>
                  </button>
              )}
              
              {currentUser ? (
                <div className="flex items-center gap-4 border-l border-slate-200 pl-4">
                    <div className="flex items-center gap-2 cursor-pointer group relative" onClick={onGoToProfile}>
                        {currentUser.photoUrl ? (
                             <img 
                                src={currentUser.photoUrl} 
                                alt={currentUser.name} 
                                className="w-9 h-9 rounded-full object-cover border-2 border-slate-100 shadow-sm group-hover:border-blue-300 transition-colors"
                             />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold group-hover:bg-blue-200 transition-colors">
                                {currentUser.name.charAt(0)}
                            </div>
                        )}
                        <div className="hidden sm:block text-xs group-hover:text-blue-600">
                            <p className="font-bold text-slate-800">{currentUser.name}</p>
                            <p className="text-slate-500 capitalize flex items-center gap-1">
                                {currentUser.role === 'PROVIDER' ? 'Profesional' : 'Usuario'} <UserIcon className="w-3 h-3" />
                            </p>
                        </div>
                    </div>
                    <button onClick={onLogout} title="Cerrar Sesión" className="text-slate-400 hover:text-red-500">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
              ) : (
                <button onClick={onOpenLogin} className="text-slate-700 font-bold hover:text-blue-600 flex items-center gap-2">
                    <UserCircle className="w-5 h-5" /> Ingresar
                </button>
              )}

              <button onClick={handleShare} className="md:hidden p-2 text-slate-600"><Share2 className="w-6 h-6" /></button>
            </div>
          </div>
        </div>
      </header>

      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-slate-900 p-6 flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center gap-2"><Lock className="w-5 h-5 text-amber-400" /> Acceso Administrativo</h3>
              <button onClick={() => setShowLoginModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleLoginSubmit} className="p-6">
              <div className="mb-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  autoFocus
                />
                {error && <p className="text-red-500 text-xs mt-2 font-bold">Contraseña incorrecta. Intenta: admin123</p>}
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white font-bold py-2 rounded-lg hover:bg-slate-800 transition-colors">Ingresar</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
