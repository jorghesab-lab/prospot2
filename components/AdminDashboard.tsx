
import React, { useState } from 'react';
import { Professional, Category, Advertisement, User } from '../types';
import { ServiceForm } from './ServiceForm';
import { AdForm } from './AdForm';
import { Trash2, Pencil, Search, Upload, Plus, FileSpreadsheet, Megaphone, Users, Shield, Key } from 'lucide-react';
import { DEPARTMENTS } from '../constants';

interface AdminDashboardProps {
  professionals: Professional[];
  ads: Advertisement[];
  users: User[];
  onAdd: (pro: Professional) => void;
  onUpdate: (pro: Professional) => void;
  onDelete: (id: string) => void;
  onAddAd: (ad: Advertisement) => void;
  onUpdateAd: (ad: Advertisement) => void;
  onDeleteAd: (id: string) => void;
  onDeleteUser: (id: string) => void;
  onChangeAdminPassword: (newPass: string) => void;
  onClose: () => void;
}

type Tab = 'LIST' | 'CREATE' | 'IMPORT' | 'ADS' | 'USERS' | 'SETTINGS';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    professionals, ads, users,
    onAdd, onUpdate, onDelete, 
    onAddAd, onUpdateAd, onDeleteAd,
    onDeleteUser, onChangeAdminPassword,
    onClose 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('LIST');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [csvText, setCsvText] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // LIST TAB LOGIC
  const filteredPros = professionals.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (id: string) => {
    setEditingId(id);
    setActiveTab('CREATE');
  };

  const handleFormSubmit = (data: Professional) => {
    if (editingId) {
        onUpdate(data);
        setEditingId(null);
    } else {
        onAdd(data);
    }
    setActiveTab('LIST');
  };

  const handleAdSubmit = (data: Advertisement) => {
      if (editingId) {
          onUpdateAd(data);
      } else {
          onAddAd(data);
      }
      setEditingId(null);
  };

  const handleCsvImport = () => {
    if (!csvText.trim()) return;

    const lines = csvText.split('\n');
    let addedCount = 0;

    lines.forEach(line => {
        const cols = line.split(',');
        if (cols.length >= 3) {
            const newPro: Professional = {
                id: Date.now().toString() + Math.random(),
                name: cols[0]?.trim() || 'Imported Service',
                category: Object.values(Category).includes(cols[1]?.trim() as Category) ? (cols[1].trim() as Category) : Category.HOME_REPAIR,
                department: DEPARTMENTS.includes(cols[2]?.trim()) ? cols[2].trim() : 'Capital',
                description: cols[3]?.trim() || 'Servicio importado desde Excel',
                priceRange: cols[4]?.trim() || '$$',
                title: 'Profesional Verificado',
                rating: 5.0,
                reviewCount: 1,
                location: 'Oficina Central',
                latitude: -32.8908 + (Math.random() * 0.05), 
                longitude: -68.8458 + (Math.random() * 0.05),
                imageUrl: `https://picsum.photos/400/400?random=${Math.floor(Math.random()*500)}`,
                tags: ['Importado'],
                isVerified: true,
                isPromoted: false,
                availability: 'Consultar',
                email: 'contacto@prospot.app',
                whatsapp: ''
            };
            onAdd(newPro);
            addedCount++;
        }
    });

    alert(`Se importaron ${addedCount} servicios correctamente.`);
    setCsvText('');
    setActiveTab('LIST');
  };

  const renderAdsTab = () => {
    if (editingId) {
        return (
            <div className="max-w-3xl mx-auto">
                <AdForm 
                    initialData={editingId === 'NEW' ? null : ads.find(a => a.id === editingId)}
                    onSubmit={handleAdSubmit}
                    onCancel={() => setEditingId(null)}
                />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Banners Activos</h2>
                <button 
                    onClick={() => setEditingId('NEW')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4" /> Nuevo Anuncio
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ads.map(ad => (
                    <div key={ad.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm relative group">
                         <div className="h-32 overflow-hidden relative">
                             <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                                <button onClick={() => setEditingId(ad.id)} className="bg-white p-2 rounded-full text-blue-600 hover:bg-blue-50">
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => { if(window.confirm('¿Borrar anuncio?')) onDeleteAd(ad.id) }} className="bg-white p-2 rounded-full text-red-600 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                             </div>
                         </div>
                         <div className="p-4">
                             <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-amber-500 uppercase">{ad.advertiserName}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${ad.position === 'sidebar' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {ad.position}
                                </span>
                             </div>
                             <h4 className="font-bold text-slate-900 leading-tight">{ad.title}</h4>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Panel de Administración</h1>
            <p className="text-slate-500">Gestiona los servicios, usuarios y seguridad.</p>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-800 font-medium">
            Volver al Inicio
        </button>
      </div>

      <div className="flex gap-4 mb-6 border-b border-slate-200 pb-1 overflow-x-auto">
        <button onClick={() => { setActiveTab('LIST'); setEditingId(null); }} className={`px-4 py-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap ${activeTab === 'LIST' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}><Search className="w-4 h-4" /> Mis Servicios</button>
        <button onClick={() => { setActiveTab('CREATE'); setEditingId(null); }} className={`px-4 py-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap ${activeTab === 'CREATE' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}><Plus className="w-4 h-4" /> Nuevo Servicio</button>
        <button onClick={() => { setActiveTab('ADS'); setEditingId(null); }} className={`px-4 py-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap ${activeTab === 'ADS' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}><Megaphone className="w-4 h-4" /> Publicidad</button>
        <button onClick={() => { setActiveTab('USERS'); setEditingId(null); }} className={`px-4 py-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap ${activeTab === 'USERS' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}><Users className="w-4 h-4" /> Usuarios</button>
        <button onClick={() => { setActiveTab('IMPORT'); setEditingId(null); }} className={`px-4 py-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap ${activeTab === 'IMPORT' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}><FileSpreadsheet className="w-4 h-4" /> Importar</button>
        <button onClick={() => { setActiveTab('SETTINGS'); setEditingId(null); }} className={`px-4 py-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap ${activeTab === 'SETTINGS' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}><Key className="w-4 h-4" /> Seguridad</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[500px] p-6">
        
        {/* LIST VIEW */}
        {activeTab === 'LIST' && (
            <>
                <div className="mb-4 relative">
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre o categoría..." 
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Categoría</th>
                                <th className="p-3">Contacto</th>
                                <th className="p-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPros.map(pro => (
                                <tr key={pro.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="p-3">
                                        <div className="font-bold text-slate-900">{pro.name}</div>
                                        <div className="text-xs text-slate-500">{pro.title}</div>
                                    </td>
                                    <td className="p-3">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">{pro.category}</span>
                                    </td>
                                    <td className="p-3 text-xs text-slate-600">
                                        {pro.whatsapp ? '✅ WhatsApp' : '❌'}<br/>
                                        {pro.email ? '✅ Email' : ''}
                                    </td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => handleEditClick(pro.id)} className="text-blue-600 hover:bg-blue-50 p-2 rounded mr-1"><Pencil className="w-4 h-4" /></button>
                                        <button onClick={() => { if(window.confirm('¿Eliminar servicio?')) onDelete(pro.id) }} className="text-red-600 hover:bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        )}

        {/* USERS TAB */}
        {activeTab === 'USERS' && (
            <div>
                 <h2 className="text-xl font-bold mb-4">Gestión de Usuarios</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                                <th className="p-3">Usuario</th>
                                <th className="p-3">Rol</th>
                                <th className="p-3">Fecha Registro</th>
                                <th className="p-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="p-3">
                                        <div className="font-bold text-slate-900">{u.name}</div>
                                        <div className="text-xs text-slate-500">{u.email}</div>
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'PROVIDER' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-3 text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => { if(window.confirm('¿Borrar usuario?')) onDeleteUser(u.id) }} className="text-red-600 hover:bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'SETTINGS' && (
            <div className="max-w-xl mx-auto">
                 <h2 className="text-xl font-bold mb-4">Seguridad de Administrador</h2>
                 <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                     <label className="block text-sm font-bold text-slate-700 mb-2">Cambiar Contraseña Maestra</label>
                     <div className="flex gap-2">
                         <input 
                            type="text"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                            placeholder="Nueva contraseña..."
                         />
                         <button 
                            onClick={() => {
                                if (newPassword.trim().length > 3) {
                                    onChangeAdminPassword(newPassword.trim());
                                    alert('Contraseña actualizada correctamente.');
                                    setNewPassword('');
                                } else {
                                    alert('La contraseña debe tener al menos 4 caracteres.');
                                }
                            }}
                            className="bg-slate-900 text-white px-4 py-2 rounded font-bold hover:bg-slate-800"
                         >
                             Actualizar
                         </button>
                     </div>
                     <p className="text-xs text-slate-500 mt-2">
                         Esta contraseña se usa para entrar al modo oculto (5 clicks en logo).
                     </p>
                 </div>
            </div>
        )}

        {/* CREATE / EDIT SERVICE VIEW */}
        {activeTab === 'CREATE' && (
            <div className="max-w-2xl mx-auto">
                <h2 className="text-xl font-bold mb-6">{editingId ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}</h2>
                <ServiceForm 
                    initialData={editingId ? professionals.find(p => p.id === editingId) : null}
                    onSubmit={handleFormSubmit}
                    onCancel={() => { setActiveTab('LIST'); setEditingId(null); }}
                    isAdmin={true}
                />
            </div>
        )}

        {/* PUBLICIDAD / ADS VIEW */}
        {activeTab === 'ADS' && renderAdsTab()}

        {/* IMPORT VIEW */}
        {activeTab === 'IMPORT' && (
            <div className="max-w-3xl mx-auto text-center">
                 <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 border-dashed">
                    <FileSpreadsheet className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Importar masivamente desde Excel/CSV</h2>
                    <textarea 
                        className="w-full h-48 p-4 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-green-500 mb-4"
                        placeholder={`Ejemplo: Nombre,Categoría...`}
                        value={csvText}
                        onChange={(e) => setCsvText(e.target.value)}
                    />
                    <button onClick={handleCsvImport} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 flex items-center gap-2 mx-auto"><Upload className="w-4 h-4" /> Procesar Datos</button>
                 </div>
            </div>
        )}

      </div>
    </div>
  );
};
