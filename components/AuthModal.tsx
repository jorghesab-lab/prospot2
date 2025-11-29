
import React, { useState } from 'react';
import { User, UserRole, AuthMode } from '../types';
import { Mail, Lock, User as UserIcon, Briefcase, Phone, MapPin, X, ArrowRight, Chrome } from 'lucide-react';

interface AuthModalProps {
  onLogin: (user: User) => void;
  onClose: () => void;
  initialMode?: AuthMode;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLogin, onClose, initialMode = 'LOGIN' }) => {
  // If initial mode is LOGIN or REGISTER_USER, we default to the simple 'USER' view. 
  // If it's REGISTER_PROVIDER, we show the provider form.
  const [isProviderMode, setIsProviderMode] = useState(initialMode === 'REGISTER_PROVIDER');
  const [isLoginMode, setIsLoginMode] = useState(initialMode === 'LOGIN');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  const handleGoogleLogin = () => {
    // Simulate Google Login
    const name = 'Usuario Google';
    const googleUser: User = {
        id: 'google-' + Date.now(),
        name: name, 
        email: 'usuario@gmail.com',
        role: 'USER',
        createdAt: new Date().toISOString(),
        contactHistory: [],
        favorites: [],
        photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`
    };
    onLogin(googleUser);
    onClose();
  };

  const handleProviderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, if isLoginMode is true, we would verify password here.
    // For now we simulate success.
    
    const user: User = {
      id: isLoginMode ? 'provider-existing-id' : Date.now().toString(),
      name: formData.name || 'Profesional Registrado',
      email: formData.email,
      role: 'PROVIDER',
      phone: formData.phone || '+54 9 261 555 5555',
      address: formData.address || 'Mendoza',
      createdAt: new Date().toISOString(),
      contactHistory: [],
      favorites: [],
      photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Pro')}&background=f59e0b&color=fff`
    };

    onLogin(user);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 z-10">
          <X className="w-6 h-6" />
        </button>

        <div className="bg-slate-900 p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
                {isProviderMode 
                    ? (isLoginMode ? 'Ingreso Profesional' : 'Únete como Profesional') 
                    : (isLoginMode ? 'Bienvenido a ProSpot' : 'Crea tu Cuenta')}
            </h2>
            <p className="text-slate-400 text-sm">
                {isProviderMode 
                    ? 'Gestiona tus servicios y clientes' 
                    : 'Ingresa para buscar, contactar y calificar'}
            </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
            <button 
                onClick={() => setIsProviderMode(false)}
                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${!isProviderMode ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-slate-500'}`}
            >
                <UserIcon className="w-4 h-4" /> Usuario / Cliente
            </button>
            <button 
                onClick={() => setIsProviderMode(true)}
                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${isProviderMode ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50' : 'text-slate-500'}`}
            >
                <Briefcase className="w-4 h-4" /> Profesional
            </button>
        </div>

        <div className="p-8">
            {!isProviderMode ? (
                // USER VIEW - GOOGLE LOGIN ONLY
                <div className="text-center space-y-6">
                    <div className="bg-blue-50 p-4 rounded-xl mb-4">
                        <p className="text-sm text-slate-600 mb-2">Acceso rápido y seguro para encontrar lo que buscas.</p>
                    </div>
                    
                    <button 
                        onClick={handleGoogleLogin}
                        className="w-full bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                        Continuar con Google
                    </button>
                    
                    <p className="text-xs text-slate-400 mt-4">
                        Al continuar, aceptas nuestros términos y condiciones.
                    </p>
                </div>
            ) : (
                // PROVIDER VIEW - LOGIN OR REGISTER FORM
                <form onSubmit={handleProviderSubmit} className="space-y-4">
                    {!isLoginMode && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Responsable</label>
                            <div className="relative">
                                <UserIcon className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                                <input 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Tu nombre"
                                    required={!isLoginMode}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Correo Electrónico</label>
                        <div className="relative">
                            <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                            <input 
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="negocio@email.com"
                                required
                            />
                        </div>
                    </div>

                    {!isLoginMode && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Celular</label>
                                <input 
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="+54 9..."
                                    required={!isLoginMode}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Zona/Barrio</label>
                                <input 
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ciudad"
                                    required={!isLoginMode}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contraseña</label>
                        <div className="relative">
                            <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                            <input 
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 mt-4"
                    >
                        {isLoginMode ? 'Ingresar a mi Cuenta' : 'Crear Cuenta Profesional'} <ArrowRight className="w-5 h-5" />
                    </button>

                    <div className="text-center mt-4 pt-4 border-t border-slate-100">
                        <button 
                            type="button" 
                            onClick={() => setIsLoginMode(!isLoginMode)}
                            className="text-blue-600 text-sm font-bold hover:underline"
                        >
                            {isLoginMode ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Ingresa'}
                        </button>
                    </div>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};
