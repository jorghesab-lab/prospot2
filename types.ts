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
}

export interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string; // WhatsApp or Website
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

export type ViewMode = 'HOME' | 'ADMIN_DASHBOARD' | 'PROFESSIONALS_LANDING';