import React, { useState, useEffect } from 'react';
import { Category, Professional } from '../types';
import { DEPARTMENTS, CATEGORIES, CATEGORY_DEFAULT_IMAGES } from '../constants';
import { MapPin, Save, X, Upload, Image as ImageIcon } from 'lucide-react';

interface ServiceFormProps {
  initialData?: Professional | null;
  onSubmit: (data: Professional) => void;
  onCancel: () => void;
  isAdmin: boolean;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ initialData, onSubmit, onCancel, isAdmin }) => {
  const [formData, setFormData] = useState<Partial<Professional>>({
    name: '',
    title: '',
    category: Category.HOME_REPAIR,
    department: 'Capital',
    location: '',
    description: '',
    priceRange: '$$',
    availability: 'Lunes a Viernes',
    imageUrl: CATEGORY_DEFAULT_IMAGES[Category.HOME_REPAIR], // Init with default
    latitude: -32.8908,
    longitude: -68.8458,
    isPromoted: false,
    isVerified: false,
    rating: 5.0,
    reviewCount: 0,
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [isCustomImage, setIsCustomImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      // Determine if image is custom based on if it matches any default
      const isDefault = Object.values(CATEGORY_DEFAULT_IMAGES).includes(initialData.imageUrl);
      setIsCustomImage(!isDefault);
    }
  }, [initialData]);

  // Logic to auto-change image when category changes, IF user hasn't uploaded a custom one
  useEffect(() => {
    if (!initialData && !isCustomImage && formData.category) {
      setFormData(prev => ({
        ...prev,
        imageUrl: CATEGORY_DEFAULT_IMAGES[formData.category as Category] || CATEGORY_DEFAULT_IMAGES[Category.HOME_REPAIR]
      }));
    }
  }, [formData.category, isCustomImage, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          location: 'Ubicación actual detectada'
        }));
      });
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);

    if (file) {
      // Validations
      if (file.size > 800 * 1024) { // 800KB limit
        setUploadError("La imagen es muy pesada. Máximo 800KB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, imageUrl: base64String }));
        setIsCustomImage(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.title) {
        alert("Por favor completa el nombre y el título del servicio.");
        return;
    }
    
    const finalData: Professional = {
      id: initialData?.id || Date.now().toString(),
      name: formData.name!,
      title: formData.title!,
      category: formData.category as Category,
      department: formData.department!,
      location: formData.location!,
      description: formData.description!,
      priceRange: formData.priceRange!,
      availability: formData.availability!,
      imageUrl: formData.imageUrl!,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      isPromoted: !!formData.isPromoted,
      isVerified: isAdmin ? (formData.isVerified || true) : false,
      rating: formData.rating || 5.0,
      reviewCount: formData.reviewCount || 0,
      tags: formData.tags || []
    };

    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h3 className="text-sm font-bold text-slate-700 uppercase mb-4 border-b border-slate-200 pb-2">Información Principal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Negocio / Profesional</label>
            <input 
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" 
              placeholder="Ej: Plomería El Rápido"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Título del Servicio</label>
            <input 
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" 
              placeholder="Ej: Gasista Matriculado 24hs"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.filter(c => c !== 'Todos').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Precio Estimado</label>
            <select 
              name="priceRange"
              value={formData.priceRange}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="$">Bajo ($)</option>
              <option value="$$">Medio ($$)</option>
              <option value="$$$">Alto ($$$)</option>
              <option value="$$$$">Premium ($$$$)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h3 className="text-sm font-bold text-slate-700 uppercase mb-4 border-b border-slate-200 pb-2">Imagen de Portada</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2 space-y-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Subir Foto / Logo (Opcional)</label>
                   <div className="flex items-center gap-2">
                       <label className="cursor-pointer bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors">
                           <Upload className="w-4 h-4" />
                           Elegir archivo
                           <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                       </label>
                       <span className="text-xs text-slate-500">Máx 800KB</span>
                   </div>
                   {uploadError && <p className="text-red-500 text-xs mt-2 font-bold">{uploadError}</p>}
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">O pegar URL de imagen</label>
                    <input 
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={(e) => {
                            handleChange(e);
                            setIsCustomImage(true);
                        }}
                        className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 text-sm" 
                        placeholder="https://..."
                    />
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Vista Previa</label>
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group">
                    {formData.imageUrl ? (
                        <img 
                            src={formData.imageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback if url is broken
                                (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Error';
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-8 h-8" />
                        </div>
                    )}
                    {!isCustomImage && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-1">
                            Imagen por defecto
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h3 className="text-sm font-bold text-slate-700 uppercase mb-4 border-b border-slate-200 pb-2">Ubicación y Detalles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Departamento</label>
             <select 
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Dirección / Referencia</label>
            <div className="flex gap-2">
                <input 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" 
                  placeholder="Calle San Martin 123"
                />
                <button type="button" onClick={handleLocationClick} className="bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200" title="Usar GPS">
                    <MapPin className="w-5 h-5" />
                </button>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" 
              placeholder="Describe lo que haces, tu experiencia, etc."
            />
          </div>
           <div className="md:col-span-2">
             <label className="block text-sm font-medium text-slate-700 mb-1">Etiquetas (Presiona Enter)</label>
             <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags?.map((tag, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center gap-1">
                        {tag} <button type="button" onClick={() => removeTag(idx)}><X className="w-3 h-3" /></button>
                    </span>
                ))}
             </div>
             <input 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" 
                placeholder="Ej: Plomeria, Urgencia, Gas..."
             />
           </div>
        </div>
      </div>

      {isAdmin && (
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
             <h3 className="text-sm font-bold text-amber-800 uppercase mb-2">Opciones de Administrador</h3>
             <div className="flex gap-6">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isPromoted" checked={formData.isPromoted} onChange={handleCheckboxChange} className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm text-slate-700 font-medium">Destacado (Top of list)</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isVerified" checked={formData.isVerified} onChange={handleCheckboxChange} className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm text-slate-700 font-medium">Verificado (Blue check)</span>
                 </label>
             </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">
            Cancelar
        </button>
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2">
            <Save className="w-4 h-4" /> {initialData ? 'Guardar Cambios' : 'Publicar Servicio'}
        </button>
      </div>
    </form>
  );
};