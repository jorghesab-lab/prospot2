
import React, { useState } from 'react';
import { User, UserRole, AuthMode } from '../types';
import { Mail, Lock, User as UserIcon, Briefcase, Phone, MapPin, X, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  onLogin: (user: User) => void;
  onClose: () => void;
  initialMode?: AuthMode;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLogin, onClose, initialMode = 'LOGIN' }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API Call / Registration
    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name || 'Usuario',
      email: formData.email,
      role: mode === 'REGISTER_PROVIDER' ? 'PROVIDER' : 'USER',
      phone: formData.phone,
      address: formData.address,
      createdAt: new Date().toISOString(),
      contactHistory: []
    };

    // For login mode, we'd normally validate, but for this demo we just pass a mock user
    if (mode === 'LOGIN') {
       // Mock Login
       onLogin({ ...newUser, name: 'Usuario Demo', role: 'USER' });
    } else {
       onLogin(newUser);
    }
    
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
                {mode === 'LOGIN' && 'Bienvenido a ProSpot'}
                {mode === 'REGISTER_USER' && 'Crea tu Cuenta'}
                {mode === 'REGISTER_PROVIDER' && 'Únete como Profesional'}
            </h2>
            <p className="text-slate-400 text-sm">
                {mode === 'LOGIN' && 'Ingresa para buscar y contactar servicios'}
                {mode === 'REGISTER_USER' && 'Para calificar y guardar tu historial'}
                {mode === 'REGISTER_PROVIDER' && 'Publica tus servicios y consigue clientes'}
            </p>
        </div>

        {/* Tabs for Registration */}
        {mode !== 'LOGIN' && (
            <div className="flex border-b border-slate-200">
                <button 
                    onClick={() => setMode('REGISTER_USER')}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${mode === 'REGISTER_USER' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-slate-500'}`}
                >
                    <UserIcon className="w-4 h-4" /> Usuario
                </button>
                <button 
                    onClick={() => setMode('REGISTER_PROVIDER')}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${mode === 'REGISTER_PROVIDER' ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50' : 'text-slate-500'}`}
                >
                    <Briefcase className="w-4 h-4" /> Profesional
                </button>
            </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {mode !== 'LOGIN' && (
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Completo</label>
                    <div className="relative">
                        <UserIcon className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                        <input 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Tu nombre"
                            required
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
                        placeholder="ejemplo@correo.com"
                        required
                    />
                </div>
            </div>

            {mode === 'REGISTER_PROVIDER' && (
                <>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Celular / WhatsApp</label>
                        <div className="relative">
                            <Phone className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                            <input 
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="+54 9 261..."
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Domicilio / Base</label>
                        <div className="relative">
                            <MapPin className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                            <input 
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Ciudad o Dirección"
                                required
                            />
                        </div>
                    </div>
                </>
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
                {mode === 'LOGIN' ? 'Ingresar' : 'Registrarme'} <ArrowRight className="w-5 h-5" />
            </button>
            
            <div className="text-center pt-2">
                {mode === 'LOGIN' ? (
                    <p className="text-sm text-slate-500">
                        ¿No tienes cuenta? <button type="button" onClick={() => setMode('REGISTER_USER')} className="text-blue-600 font-bold hover:underline">Regístrate</button>
                    </p>
                ) : (
                    <p className="text-sm text-slate-500">
                        ¿Ya tienes cuenta? <button type="button" onClick={() => setMode('LOGIN')} className="text-blue-600 font-bold hover:underline">Inicia Sesión</button>
                    </p>
                )}
            </div>
        </form>
      </div>
    </div>
  );
};
