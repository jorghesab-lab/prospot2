
import React, { useState, useEffect } from 'react';
import { Category, Professional } from '../types';
import { DEPARTMENTS, CATEGORIES, CATEGORY_DEFAULT_IMAGES } from '../constants';
import { MapPin, Save, X, Upload, Image as ImageIcon, Phone, Mail, Wand2, Sparkles } from 'lucide-react';
import { generateServiceContent } from '../services/geminiService';

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
    imageUrl: CATEGORY_DEFAULT_IMAGES[Category.HOME_REPAIR],
    latitude: -32.8908,
    longitude: -68.8458,
    isPromoted: false,
    isVerified: false,
    rating: 5.0,
    reviewCount: 0,
    tags: [],
    email: '',
    whatsapp: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [isCustomImage, setIsCustomImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      const isDefault = Object.values(CATEGORY_DEFAULT_IMAGES).includes(initialData.imageUrl);
      setIsCustomImage(!isDefault);
    }
  }, [initialData]);

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
      if (file.size > 800 * 1024) { 
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

  const handleAiGeneration = async () => {
    if (!formData.name || !formData.title || !formData.category) {
        alert("Por favor completa al menos el Nombre, Título y Categoría para que la IA pueda ayudarte.");
        return;
    }
    
    setIsGenerating(true);
    try {
        const result = await generateServiceContent(formData.name, formData.category, formData.title);
        if (result) {
            setFormData(prev => ({
                ...prev,
                description: result.description,
                tags: result.tags
            }));
        } else {
            alert("No se pudo conectar con el asistente. Intenta de nuevo.");
        }
    } catch (e) {
        console.error(e);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.title || !formData.whatsapp) {
        alert("Por favor completa el nombre, título y WhatsApp del servicio.");
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
      tags: formData.tags || [],
      email: formData.email || '',
      whatsapp: formData.whatsapp!
    };

    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10 border border-slate-100">
      <div className="flex justify-between items-center border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{initialData ? 'Editar Servicio' : 'Nuevo Servicio'}</h2>
            <p className="text-slate-500">Completa la información para que los clientes te encuentren.</p>
          </div>
          <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-800"><X className="w-6 h-6" /></button>
      </div>

      {/* Basic Info */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-8 h-1 bg-blue-600 rounded-full"></span> Información Básica
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Negocio / Profesional</label>
            <input 
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
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
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
              placeholder="Ej: Gasista Matriculado 24hs"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
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
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="$">Bajo ($)</option>
              <option value="$$">Medio ($$)</option>
              <option value="$$$">Alto ($$$)</option>
              <option value="$$$$">Premium ($$$$)</option>
            </select>
          </div>
        </div>
      </div>

      {/* AI Assistant Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-24 h-24 text-blue-600" />
          </div>
          <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                  <div>
                      <h3 className="text-blue-800 font-bold flex items-center gap-2">
                          <Wand2 className="w-5 h-5" /> Asistente IA de Redacción
                      </h3>
                      <p className="text-blue-600/80 text-sm">Completa los campos de arriba y deja que la IA escriba por ti.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleAiGeneration}
                    disabled={isGenerating}
                    className="bg-white text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 px-4 py-2 rounded-lg font-bold shadow-sm transition-all flex items-center gap-2"
                  >
                      {isGenerating ? <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span> : <Sparkles className="w-4 h-4" />}
                      Generar Descripción
                  </button>
              </div>

              <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white/80" 
                      placeholder="La IA escribirá una descripción atractiva aquí..."
                    />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Etiquetas Sugeridas</label>
                     <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
                        {formData.tags?.map((tag, idx) => (
                            <span key={idx} className="bg-white border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                                {tag} <button type="button" onClick={() => removeTag(idx)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                            </span>
                        ))}
                     </div>
                     <input 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white/80" 
                        placeholder="Escribe una etiqueta y presiona Enter..."
                     />
                   </div>
              </div>
          </div>
      </div>

      {/* Contact & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
             <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-8 h-1 bg-emerald-500 rounded-full"></span> Contacto
             </h3>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                   <Phone className="w-4 h-4 text-emerald-600" /> WhatsApp / Celular
                </label>
                <input 
                  required
                  name="whatsapp"
                  type="tel"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="+54 9 261..."
                />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                   <Mail className="w-4 h-4 text-blue-600" /> Email (Opcional)
               </label>
               <input 
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="contacto@..."
               />
            </div>
          </div>

          <div className="space-y-6">
             <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-8 h-1 bg-amber-500 rounded-full"></span> Ubicación
             </h3>
             <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Departamento</label>
                 <select 
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
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
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="Calle San Martin 123"
                    />
                    <button type="button" onClick={handleLocationClick} className="bg-slate-100 text-slate-600 p-3 rounded-xl hover:bg-slate-200 border border-slate-200" title="Usar GPS">
                        <MapPin className="w-5 h-5" />
                    </button>
                </div>
             </div>
          </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-8 h-1 bg-purple-500 rounded-full"></span> Imagen de Portada
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2 space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
                   <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                   <p className="text-sm text-slate-600 mb-2">Arrastra una imagen o haz clic para subir</p>
                   <input type="file" className="hidden" id="file-upload" accept="image/*" onChange={handleImageUpload} />
                   <label htmlFor="file-upload" className="cursor-pointer bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm inline-block shadow-sm">
                       Elegir Archivo
                   </label>
                   <p className="text-xs text-slate-400 mt-2">Máximo 800KB</p>
                   {uploadError && <p className="text-red-500 text-xs mt-2 font-bold">{uploadError}</p>}
                </div>
                
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs font-bold uppercase">URL</span>
                    <input 
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={(e) => {
                            handleChange(e);
                            setIsCustomImage(true);
                        }}
                        className="w-full pl-12 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                        placeholder="https://..."
                    />
                </div>
            </div>
            
            <div className="h-full min-h-[160px]">
                <div className="w-full h-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative shadow-sm">
                    {formData.imageUrl ? (
                        <img 
                            src={formData.imageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Error';
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-8 h-8" />
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {isAdmin && (
        <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
             <h3 className="text-sm font-bold text-amber-800 uppercase mb-4">Opciones de Administrador</h3>
             <div className="flex gap-6">
                 <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" name="isPromoted" checked={formData.isPromoted} onChange={handleCheckboxChange} className="w-5 h-5 text-blue-600 rounded" />
                    <span className="text-slate-800 font-medium">Destacado (Top of list)</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" name="isVerified" checked={formData.isVerified} onChange={handleCheckboxChange} className="w-5 h-5 text-blue-600 rounded" />
                    <span className="text-slate-800 font-medium">Verificado (Blue check)</span>
                 </label>
             </div>
        </div>
      )}

      <div className="flex justify-between pt-6 border-t border-slate-200 items-center">
        <button type="button" onClick={onCancel} className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-bold">
            Cancelar
        </button>
        <button type="submit" className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <Save className="w-5 h-5" /> {initialData ? 'Guardar Cambios' : 'Publicar Ahora'}
        </button>
      </div>
    </form>
  );
};
