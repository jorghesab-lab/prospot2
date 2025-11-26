import { Category, Professional, Advertisement } from './types';

export const DEPARTMENTS = [
  'Capital', 'General Alvear', 'Godoy Cruz', 'Guaymallén', 'Junín', 
  'La Paz', 'Las Heras', 'Lavalle', 'Luján de Cuyo', 'Maipú', 
  'Malargüe', 'Rivadavia', 'San Carlos', 'San Martín', 'San Rafael', 
  'Santa Rosa', 'Tunuyán', 'Tupungato'
];

export const CATEGORIES = Object.values(Category);

// --- IMÁGENES POR DEFECTO POR CATEGORÍA ---
export const CATEGORY_DEFAULT_IMAGES: Record<Category, string> = {
  [Category.HOME_REPAIR]: 'https://images.unsplash.com/photo-1581094794329-cd11179a28fa?auto=format&fit=crop&q=80&w=600', // Tools/Repair
  [Category.AUTOMOTIVE]: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80&w=600', // Mechanic
  [Category.TECHNOLOGY]: 'https://images.unsplash.com/photo-1531297461136-8208b50b6614?auto=format&fit=crop&q=80&w=600', // Tech/Computer
  [Category.BUSINESS]: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600', // Office
  [Category.HEALTH]: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600', // Health/Medical
  [Category.EDUCATION]: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600', // Books/Education
  [Category.EVENTS]: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600', // Event/Party
  [Category.ALL]: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=600' // Generic
};

// --- CONFIGURACIÓN DEL FORMULARIO DE GOOGLE ---
export const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfD_placeholder_id/viewform"; 

// --- PUBLICIDAD (MOCK DATA) ---
// Aquí cargas los banners que vendes a empresas locales
export const MOCK_ADS: Advertisement[] = [
  {
    id: 'ad-sidebar-1',
    title: '¡Asegurá tu Herramienta!',
    advertiserName: 'Seguros Cuyo',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=500',
    linkUrl: '#',
    position: 'sidebar'
  },
  {
    id: 'ad-feed-1',
    title: 'Materiales de Construcción al Mejor Precio',
    advertiserName: 'Corralón El Constructor',
    imageUrl: 'https://images.unsplash.com/photo-1581094794329-cd11179a28fa?auto=format&fit=crop&q=80&w=500',
    linkUrl: '#',
    position: 'feed'
  }
];

// --- BASE DE DATOS LOCAL ---
export const MOCK_PROFESSIONALS: Professional[] = [
  // --- CARGADO POR ADMIN (SIMULACIÓN EXCEL) ---
  {
    id: 'admin-1',
    name: 'Constructora Andina Premium',
    title: 'Reformas Integrales y Sismorresistentes',
    category: Category.HOME_REPAIR,
    rating: 5.0,
    reviewCount: 342,
    location: 'Av. San Martín 1200, Ciudad de Mendoza',
    department: 'Capital',
    latitude: -32.8908,
    longitude: -68.8458,
    description: 'Empresa líder en construcción y reformas en la zona cuyana. Especialistas en estructuras sismorresistentes. Socio oficial.',
    priceRange: '$$$$',
    imageUrl: 'https://picsum.photos/400/400?random=101',
    tags: ['Construcción', 'Premium', 'Arquitectura'],
    isVerified: true,
    isPromoted: true,
    availability: 'Agenda Abierta'
  },
  {
    id: 'admin-2',
    name: 'Centro Automotriz Cuyo',
    title: 'Mecánica Oficial Toyota/Ford',
    category: Category.AUTOMOTIVE,
    rating: 4.9,
    reviewCount: 215,
    location: 'Beltrán 450, Godoy Cruz',
    department: 'Godoy Cruz',
    latitude: -32.9252,
    longitude: -68.8444,
    description: 'Service oficial multimarca en el corazón de Godoy Cruz. Garantía escrita en todas las reparaciones.',
    priceRange: '$$$',
    imageUrl: 'https://picsum.photos/400/400?random=102',
    tags: ['Oficial', 'Garantía', 'Mecánica'],
    isVerified: true,
    isPromoted: true,
    availability: 'Lunes a Sábado'
  },
  {
    id: 'admin-3',
    name: 'Servicios Ya! Mendoza',
    title: 'Red de Plomeros y Gasistas Matriculados',
    category: Category.HOME_REPAIR,
    rating: 4.8,
    reviewCount: 500,
    location: 'Dorrego, Guaymallén',
    department: 'Guaymallén',
    latitude: -32.9069,
    longitude: -68.8025,
    description: 'Llegamos en menos de 1 hora a cualquier punto del Gran Mendoza. Gasistas matriculados para habilitaciones.',
    priceRange: '$$',
    imageUrl: 'https://picsum.photos/400/400?random=103',
    tags: ['Gasista', 'Urgencias', '24hs'],
    isVerified: true,
    isPromoted: true,
    availability: '24/7'
  },

  // --- REGISTRADOS POR FORMULARIO (SIMULACIÓN) ---
  {
    id: '1',
    name: 'Carlos Ruiz',
    title: 'Electricista Certificado',
    category: Category.HOME_REPAIR,
    rating: 4.8,
    reviewCount: 124,
    location: 'Calle Independencia 500, Las Heras',
    department: 'Las Heras',
    latitude: -32.8465,
    longitude: -68.8687,
    description: 'Especialista en instalaciones eléctricas residenciales e industriales en zona norte.',
    priceRange: '$$',
    imageUrl: 'https://picsum.photos/400/400?random=1',
    tags: ['Electricidad', 'Emergencias', 'Hogar'],
    isVerified: true,
    isPromoted: false,
    availability: 'Disponible hoy'
  },
  {
    id: '2',
    name: 'Taller Mecánico San Rafael',
    title: 'Reparación General de Camionetas',
    category: Category.AUTOMOTIVE,
    rating: 4.5,
    reviewCount: 89,
    location: 'Av. Hipólito Yrigoyen 2000, San Rafael',
    department: 'San Rafael',
    latitude: -34.6177,
    longitude: -68.3301,
    description: 'Expertos en vehículos 4x4 y diesel. Servicio completo para turismo aventura y trabajo.',
    priceRange: '$$$',
    imageUrl: 'https://picsum.photos/400/400?random=2',
    tags: ['Mecánica', '4x4', 'Taller'],
    isVerified: true,
    isPromoted: false,
    availability: 'Lunes a Sábado'
  },
  {
    id: '3',
    name: 'TechSolutions Este',
    title: 'Venta y Reparación de PC',
    category: Category.TECHNOLOGY,
    rating: 4.9,
    reviewCount: 210,
    location: '25 de Mayo 150, San Martín',
    department: 'San Martín',
    latitude: -33.0811,
    longitude: -68.4711,
    description: 'Soporte técnico para empresas y agroindustria en la zona Este.',
    priceRange: '$$',
    imageUrl: 'https://picsum.photos/400/400?random=3',
    tags: ['Computadoras', 'Agro-Tech', 'Tienda'],
    isVerified: true,
    isPromoted: false,
    availability: 'Abierto ahora'
  },
  {
    id: '4',
    name: 'Dra. Elena Gómez',
    title: 'Fisioterapia y Kinesiología',
    category: Category.HEALTH,
    rating: 5.0,
    reviewCount: 56,
    location: 'Italia 560, Chacras de Coria',
    department: 'Luján de Cuyo',
    latitude: -33.0060,
    longitude: -68.8785,
    description: 'Tratamientos personalizados, pilates terapéutico y rehabilitación post-operatoria en Chacras.',
    priceRange: '$$$',
    imageUrl: 'https://picsum.photos/400/400?random=4',
    tags: ['Salud', 'Kinesiología', 'Bienestar'],
    isVerified: true,
    isPromoted: false,
    availability: 'Cita previa'
  },
  {
    id: '5',
    name: 'Plomería Maipú 24/7',
    title: 'Servicios de Agua y Cloacas',
    category: Category.HOME_REPAIR,
    rating: 4.2,
    reviewCount: 34,
    location: 'Maza 200, Gutiérrez, Maipú',
    department: 'Maipú',
    latitude: -32.9776,
    longitude: -68.7909,
    description: 'Destape de cañerías, limpieza de tanques y reparación de bombas de agua para riego.',
    priceRange: '$',
    imageUrl: 'https://picsum.photos/400/400?random=5',
    tags: ['Plomería', 'Riego', 'Agua'],
    isVerified: false,
    isPromoted: false,
    availability: '24 Horas'
  },
  {
    id: '6',
    name: 'Consultoría Vitivinícola Pérez',
    title: 'Asesoría para Bodegas',
    category: Category.BUSINESS,
    rating: 4.7,
    reviewCount: 15,
    location: 'Peatonal Sarmiento, Ciudad',
    department: 'Capital',
    latitude: -32.8950,
    longitude: -68.8350,
    description: 'Ayudamos a pequeñas bodegas a exportar y optimizar sus procesos de logística.',
    priceRange: '$$$$',
    imageUrl: 'https://picsum.photos/400/400?random=6',
    tags: ['Consultoría', 'Vino', 'Negocios'],
    isVerified: true,
    isPromoted: false,
    availability: 'Lunes a Viernes'
  },
  {
    id: '7',
    name: 'Academia de Música "El Valle"',
    title: 'Clases de Guitarra y Folklore',
    category: Category.EDUCATION,
    rating: 4.9,
    reviewCount: 78,
    location: 'San Martín 800, Tunuyán',
    department: 'Tunuyán',
    latitude: -33.5786,
    longitude: -69.0152,
    description: 'Aprende música en el Valle de Uco. Clases de guitarra criolla y canto.',
    priceRange: '$$',
    imageUrl: 'https://picsum.photos/400/400?random=7',
    tags: ['Música', 'Folklore', 'Arte'],
    isVerified: true,
    isPromoted: false,
    availability: 'Cupos limitados'
  },
  {
    id: '8',
    name: 'Eventos del Sol',
    title: 'Organización de Bodas en Bodegas',
    category: Category.EVENTS,
    rating: 4.6,
    reviewCount: 102,
    location: 'Ruta 60, Rivadavia',
    department: 'Rivadavia',
    latitude: -33.1912,
    longitude: -68.4610,
    description: 'Especialistas en casamientos al aire libre y eventos corporativos en la zona este.',
    priceRange: '$$$$',
    imageUrl: 'https://picsum.photos/400/400?random=8',
    tags: ['Eventos', 'Bodas', 'Catering'],
    isVerified: true,
    isPromoted: false,
    availability: 'Reserva con 1 mes'
  },
  {
    id: '9',
    name: 'Talabartería "El Arriero"',
    title: 'Artículos de Cuero y Campo',
    category: Category.BUSINESS,
    rating: 4.4,
    reviewCount: 45,
    location: 'Av. San Martín 300, Malargüe',
    department: 'Malargüe',
    latitude: -35.4752,
    longitude: -69.5855,
    description: 'Venta y reparación de monturas, botas y artículos regionales de cuero.',
    priceRange: '$',
    imageUrl: 'https://picsum.photos/400/400?random=9',
    tags: ['Cuero', 'Campo', 'Tienda'],
    isVerified: false,
    isPromoted: false,
    availability: 'Lun-Sab 9-18h'
  }
];