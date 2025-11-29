
export enum Category {
  ALL = 'Todos',
  HOME_REPAIR = 'Reparaciones del Hogar',
  AUTOMOTIVE = 'Automotriz',
  TECHNOLOGY = 'Tecnología',
  BUSINESS = 'Negocios y Tiendas',
  HEALTH = 'Salud y Bienestar',
  EDUCATION = 'Educación',
  EVENTS = 'Eventos'
}

export interface Professional {
  id: string;
  name: string;
  title: string;
  category: Category;
  rating: number;
  reviewCount: number;
  location: string;
  department: string;
  latitude: number;
  longitude: number;
  description: string;
  priceRange: string; 
  imageUrl: string;
  tags: string[];
  isVerified: boolean;
  isPromoted: boolean;
  availability: string;
  // New Contact Fields
  email: string;
  whatsapp: string;
}

export interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: 'sidebar' | 'feed';
  advertiserName: string;
}

export interface SearchState {
  query: string;
  category: Category;
}

export interface AISearchResult {
  recommendedKeywords: string[];
  reasoning: string;
  targetCategory: Category | 'Unknown';
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type ViewMode = 'HOME' | 'ADMIN_DASHBOARD' | 'PROFESSIONALS_LANDING' | 'USER_PROFILE' | 'CREATE_SERVICE';

// --- AUTH & USER TYPES ---

export type UserRole = 'VISITOR' | 'USER' | 'PROVIDER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;    // Only for Providers
  address?: string;  // Only for Providers
  contactHistory: string[]; // IDs of professionals contacted
  favorites: string[]; // IDs of favorite professionals
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  professionalId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type AuthMode = 'LOGIN' | 'REGISTER_USER' | 'REGISTER_PROVIDER';