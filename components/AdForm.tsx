import React, { useState, useEffect } from 'react';
import { Advertisement } from '../types';
import { Save, X, Image as ImageIcon } from 'lucide-react';

interface AdFormProps {
  initialData?: Advertisement | null;
  onSubmit: (data: Advertisement) => void;
  onCancel: () => void;
}

export const AdForm: React.FC<AdFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Advertisement>>({
    title: '',
    advertiserName: '',
    linkUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=500',
    position: 'sidebar'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.advertiserName || !formData.imageUrl) {
        alert("Por favor completa los campos obligatorios.");
        return;
    }

    const finalData: Advertisement = {
      id: initialData?.id || Date.now().toString(),
      title: formData.title!,
      advertiserName: formData.advertiserName!,
      linkUrl: formData.linkUrl || '#',
      imageUrl: formData.imageUrl!,
      position: formData.position as 'sidebar' | 'feed'
    };

    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">
        {initialData ? 'Editar Publicidad' : 'Nueva Publicidad'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Anunciante</label>
                <input 
                    name="advertiserName"
                    value={formData.advertiserName}
                    onChange={handleChange}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" 
                    placeholder="Ej: Ferretería El Tornillo"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título / Frase Principal</label>
                <input 
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" 
                    placeholder="Ej: 20% Descuento en Pinturas"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Enlace de Destino (WhatsApp/Web)</label>
                <input 
                    name="linkUrl"
                    value={formData.linkUrl}
                    onChange={handleChange}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" 
                    placeholder="https://..."
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Posición</label>
                <select 
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                    <option value="sidebar">Barra Lateral (Desktop)</option>
                    <option value="feed">Entre Resultados (Feed)</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">
                    Sidebar: Visible siempre a la derecha (solo PC). Feed: Aparece después del 3er resultado.
                </p>
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL de la Imagen</label>
            <div className="flex gap-2 mb-2">
                 <input 
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" 
                    placeholder="https://..."
                    required
                />
            </div>
            
            <label className="block text-sm font-medium text-slate-700 mb-1">Vista Previa</label>
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 relative group h-48">
                {formData.imageUrl ? (
                    <>
                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white">
                            <p className="text-xs text-amber-400 font-bold uppercase">{formData.advertiserName || 'Anunciante'}</p>
                            <p className="font-bold text-sm truncate">{formData.title || 'Título del anuncio'}</p>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                        <ImageIcon className="w-8 h-8" />
                    </div>
                )}
            </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-200">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">
            Cancelar
        </button>
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2">
            <Save className="w-4 h-4" /> Guardar Publicidad
        </button>
      </div>
    </form>
  );
};