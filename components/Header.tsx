import React, { useState, useEffect } from 'react';
import { Briefcase, Menu, PlusCircle, ExternalLink, Share2, X, Lock, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  onAdminLogin: () => void;
  isAdmin: boolean;
  onOpenPublishModal: () => void;
  onOpenAdminPanel: () => void;
  onGoToProfessionals: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onAdminLogin, isAdmin, onOpenPublishModal, onOpenAdminPanel, onGoToProfessionals, onGoHome 
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  // Reset click count if idle for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setClickCount(0), 2000);
    return () => clearTimeout(timer);
  }, [clickCount]);

  const handleLogoClick = () => {
    if (isAdmin) return; // Already logged in
    
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount >= 5) {
      setShowLoginModal(true);
      setClickCount(0);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trim whitespace to prevent copy-paste errors
    if (password.trim() === 'admin123') {
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
      text: 'Encontrá profesionales y oficios cerca de tu casa en Mendoza. ¡Está genial!',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('¡Enlace copiado al portapapeles!');
      }
    } catch (err) {
      console.error('Error al compartir:', err);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer select-none" 
              onClick={() => {
                onGoHome();
                window.scrollTo(0, 0);
                handleLogoClick();
              }}
              title={isAdmin ? "Modo Admin Activo" : "Haz clic 5 veces para admin"}
            >
              {/* Logo Icon Area - Updated to use Slate-900 always to match new theme */}
              <div className="p-2 rounded-lg flex items-center justify-center transition-colors bg-slate-900">
                <div className="relative">
                   <Briefcase className="w-6 h-6 text-white" />
                   <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-slate-900"></div>
                </div>
              </div>
              {/* Logo Text: Pro(Slate-900)Spot(Amber) */}
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-slate-900">Pro</span>
                <span className="text-amber-500">Spot</span>
              </span>
            </div>

            <nav className="hidden md:flex space-x-8">
              <button onClick={onGoHome} className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Explorar</button>
              <button onClick={onGoToProfessionals} className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Por qué elegirnos</button>
              <button onClick={handleShare} className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-1">
                 <Share2 className="w-4 h-4" /> Compartir
              </button>
            </nav>

            <div className="flex items-center gap-4">
              {isAdmin && (
                <button 
                    onClick={onOpenAdminPanel}
                    className="hidden md:flex items-center gap-2 text-slate-700 hover:text-blue-600 font-bold"
                >
                    <LayoutDashboard className="w-5 h-5" /> Ir al Panel
                </button>
              )}

              <button 
                onClick={onOpenPublishModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                title="Publicar Servicio Gratis"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Publicar Servicio</span>
                <span className="sm:hidden">Publicar</span>
              </button>
              
              {/* Mobile Share Button */}
              <button onClick={handleShare} className="md:hidden p-2 text-slate-600">
                 <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Secret Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-slate-900 p-6 flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                Acceso Administrativo
              </h3>
              <button onClick={() => setShowLoginModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleLoginSubmit} className="p-6">
              <p className="text-sm text-slate-600 mb-4">Ingresa la contraseña maestra para editar el sitio.</p>
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
              <button 
                type="submit"
                className="w-full bg-slate-900 text-white font-bold py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Ingresar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};