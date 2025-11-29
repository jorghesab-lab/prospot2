
import React, { useState } from 'react';
import { User, Professional, Review } from '../types';
import { Star, Clock, MapPin, MessageSquare, Heart, Bookmark, History, PenTool, LayoutGrid } from 'lucide-react';
import { ServiceCard } from './ServiceCard';

interface UserProfileProps {
  user: User;
  professionals: Professional[];
  reviews: Review[];
  onSubmitReview: (proId: string, rating: number, comment: string) => void;
  onGoHome: () => void;
}

type ProfileTab = 'HISTORY' | 'FAVORITES' | 'REVIEWS';

export const UserProfile: React.FC<UserProfileProps> = ({ user, professionals, reviews, onSubmitReview, onGoHome }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('HISTORY');
  const [ratingInput, setRatingInput] = useState<number>(0);
  const [commentInput, setCommentInput] = useState('');
  const [selectedProId, setSelectedProId] = useState<string | null>(null);

  // Get professionals the user has contacted
  const contactedPros = professionals.filter(p => user.contactHistory.includes(p.id));
  
  // Get favorites
  const favoritePros = professionals.filter(p => (user.favorites || []).includes(p.id));

  // Filter out pros that have already been reviewed by this user
  const pendingReviews = contactedPros.filter(p => !reviews.some(r => r.userId === user.id && r.professionalId === p.id));
  
  // Get past reviews
  const myReviews = reviews.filter(r => r.userId === user.id);

  const handleSubmit = (proId: string) => {
    if (ratingInput === 0) return alert("Por favor selecciona una calificación");
    onSubmitReview(proId, ratingInput, commentInput);
    setRatingInput(0);
    setCommentInput('');
    setSelectedProId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Info */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center sticky top-24">
             <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold mx-auto mb-4">
               {user.name.charAt(0)}
             </div>
             <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
             <p className="text-slate-500 text-sm mb-6">{user.email}</p>
             
             <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                   <span className="block text-2xl font-bold text-slate-900">{user.contactHistory.length}</span>
                   <span className="text-xs text-slate-500 uppercase">Contactos</span>
                </div>
                <div>
                   <span className="block text-2xl font-bold text-slate-900">{favoritePros.length}</span>
                   <span className="text-xs text-slate-500 uppercase">Favoritos</span>
                </div>
             </div>
             
             <button onClick={onGoHome} className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-sm">
               Volver a Buscar
             </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 space-y-6">
           
           {/* PENDING REVIEWS ALERT */}
           {pendingReviews.length > 0 && (
             <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 mb-8">
                <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-600 text-amber-600" /> Calificaciones Pendientes
                </h3>
                <div className="space-y-4">
                  {pendingReviews.map(pro => (
                    <div key={pro.id} className="bg-white p-4 rounded-lg shadow-sm border border-amber-100">
                       <div className="flex items-start gap-4 mb-4">
                          <img src={pro.imageUrl} alt={pro.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <h4 className="font-bold text-slate-900">{pro.name}</h4>
                            <p className="text-xs text-slate-500">{pro.category}</p>
                          </div>
                       </div>
                       
                       {selectedProId === pro.id ? (
                         <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex gap-2 mb-3 justify-center">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} onClick={() => setRatingInput(star)} className="focus:outline-none transition-transform hover:scale-110">
                                  <Star className={`w-8 h-8 ${ratingInput >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                                </button>
                              ))}
                            </div>
                            <textarea 
                              className="w-full p-3 border border-slate-300 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-amber-500 outline-none"
                              placeholder="Cuéntanos tu experiencia..."
                              value={commentInput}
                              onChange={(e) => setCommentInput(e.target.value)}
                            />
                            <div className="flex gap-2">
                               <button onClick={() => handleSubmit(pro.id)} className="flex-1 bg-amber-500 text-white py-2 rounded-lg font-bold hover:bg-amber-600">Enviar Calificación</button>
                               <button onClick={() => setSelectedProId(null)} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">Cancelar</button>
                            </div>
                         </div>
                       ) : (
                         <button onClick={() => setSelectedProId(pro.id)} className="w-full bg-white border border-amber-300 text-amber-600 font-bold py-2 rounded-lg hover:bg-amber-50 transition-colors">
                            Calificar Servicio
                         </button>
                       )}
                    </div>
                  ))}
                </div>
             </div>
           )}

           {/* TABS */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="flex border-b border-slate-200">
                   <button 
                    onClick={() => setActiveTab('HISTORY')}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'HISTORY' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-slate-500 hover:bg-slate-50'}`}
                   >
                       <History className="w-4 h-4" /> Historial
                   </button>
                   <button 
                    onClick={() => setActiveTab('FAVORITES')}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'FAVORITES' ? 'text-red-600 border-b-2 border-red-600 bg-red-50' : 'text-slate-500 hover:bg-slate-50'}`}
                   >
                       <Heart className="w-4 h-4" /> Favoritos ({favoritePros.length})
                   </button>
                   <button 
                    onClick={() => setActiveTab('REVIEWS')}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'REVIEWS' ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50' : 'text-slate-500 hover:bg-slate-50'}`}
                   >
                       <Star className="w-4 h-4" /> Mis Reseñas
                   </button>
               </div>

               <div className="p-6">
                    {/* HISTORY TAB */}
                    {activeTab === 'HISTORY' && (
                        <div>
                             {contactedPros.length === 0 ? (
                                <div className="text-center py-12">
                                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500 font-medium">Aún no has contactado a ningún profesional.</p>
                                </div>
                             ) : (
                                <div className="grid grid-cols-1 gap-4">
                                {contactedPros.map(pro => (
                                    <div key={pro.id} className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow flex items-center gap-4">
                                        <img src={pro.imageUrl} alt={pro.name} className="w-16 h-16 rounded-lg object-cover" />
                                        <div className="flex-grow">
                                            <h4 className="font-bold text-slate-900">{pro.name}</h4>
                                            <p className="text-xs text-blue-600 font-bold uppercase mb-1">{pro.category}</p>
                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                <MapPin className="w-3 h-3" /> {pro.location}
                                            </div>
                                        </div>
                                        <a href={`https://wa.me/${pro.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100" title="Contactar de nuevo">
                                            <MessageSquare className="w-5 h-5" />
                                        </a>
                                    </div>
                                ))}
                                </div>
                             )}
                        </div>
                    )}

                    {/* FAVORITES TAB */}
                    {activeTab === 'FAVORITES' && (
                        <div>
                            {favoritePros.length === 0 ? (
                                <div className="text-center py-12">
                                    <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500 font-medium">No tienes favoritos guardados.</p>
                                    <p className="text-xs text-slate-400">Dale al corazón en las tarjetas para guardarlos aquí.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {favoritePros.map(pro => (
                                        <div key={pro.id} className="h-full">
                                            <ServiceCard 
                                                professional={pro} 
                                                isAuthenticated={true} // In profile, user is always auth
                                                isFavorite={true}
                                                // We don't need toggling here to avoid accidental removal, or we can add it later
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* REVIEWS TAB */}
                    {activeTab === 'REVIEWS' && (
                        <div>
                             {myReviews.length === 0 ? (
                                <div className="text-center py-12">
                                    <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500 font-medium">Aún no has escrito reseñas.</p>
                                </div>
                             ) : (
                                <div className="space-y-4">
                                {myReviews.map(review => {
                                    const pro = professionals.find(p => p.id === review.professionalId);
                                    return (
                                        <div key={review.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-800">{pro?.name || 'Servicio eliminado'}</h4>
                                                <div className="flex text-amber-400">
                                                    {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                                </div>
                                            </div>
                                            <p className="text-slate-600 text-sm italic">"{review.comment}"</p>
                                            <p className="text-xs text-slate-400 mt-2 text-right">{new Date(review.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    );
                                })}
                                </div>
                             )}
                        </div>
                    )}
               </div>
           </div>

        </div>
      </div>
    </div>
  );
};