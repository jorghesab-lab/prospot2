
import { Category, Professional, Advertisement } from './types';

export const DEPARTMENTS = [
  'Capital', 'General Alvear', 'Godoy Cruz', 'Guaymallén', 'Junín', 
  'La Paz', 'Las Heras', 'Lavalle', 'Luján de Cuyo', 'Maipú', 
  'Malargüe', 'Rivadavia', 'San Carlos', 'San Martín', 'San Rafael', 
  'Santa Rosa', 'Tunuyán', 'Tupungato'
];

export const CATEGORIES = Object.values(Category);

// --- IMÁGENES POR DEFECTO POR CATEGORÍA (ENLACES ACTUALIZADOS) ---
export const CATEGORY_DEFAULT_IMAGES: Record<Category, string> = {
  [Category.HOME_REPAIR]: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=600', // Repair/Tools
  [Category.AUTOMOTIVE]: 'https://images.unsplash.com/photo-1486262715619-01b80250e0dc?auto=format&fit=crop&q=80&w=600', // Mechanic
  [Category.TECHNOLOGY]: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600', // Computer
  [Category.BUSINESS]: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600', // Business/Papers
  [Category.HEALTH]: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600', // Medical
  [Category.EDUCATION]: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600', // Education/Class
  [Category.EVENTS]: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600', // Events/Lights
  [Category.ALL]: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=600' // Generic
};

// --- CONFIGURACIÓN DEL FORMULARIO DE GOOGLE ---
export const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfD_placeholder_id/viewform"; 

// --- PUBLICIDAD (MOCK DATA) ---
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
    imageUrl: 'https://images.unsplash.com/photo-1535732759880-bbd5c7265e3f?auto=format&fit=crop&q=80&w=500',
    linkUrl: '#',
    position: 'feed'
  }
];

// --- BASE DE DATOS LOCAL (MOCK DATA) ---
export const MOCK_PROFESSIONALS: Professional[] = [
  // --- CAPITAL ---
  {
    id: 'cap-1',
    name: 'Estudio Contable Mendoza',
    title: 'Asesoramiento Impositivo y Contable',
    category: Category.BUSINESS,
    rating: 4.8,
    reviewCount: 120,
    location: 'Av. España 1200, Ciudad',
    department: 'Capital',
    latitude: -32.8908,
    longitude: -68.8458,
    description: 'Liquidación de sueldos, monotributo y ganancias. Asesoramos a PyMEs y emprendedores.',
    priceRange: '$$$',
    imageUrl: CATEGORY_DEFAULT_IMAGES[Category.BUSINESS],
    tags: ['Contador', 'Impuestos', 'Gestoría'],
    isVerified: true,
    isPromoted: true,
    availability: 'Lun-Vie 9-18hs',
    email: 'info@estudiocm.com',
    whatsapp: '+5492615550101'
  },
  {
    id: 'cap-2',
    name: 'Centro Odontológico Sonrisas',
    title: 'Ortodoncia y Estética Dental',
    category: Category.HEALTH,
    rating: 4.9,
    reviewCount: 85,
    location: 'Necochea 450, Ciudad',
    department: 'Capital',
    latitude: -32.8950,
    longitude: -68.8400,
    description: 'Especialistas en implantes y blanqueamiento. Atendemos obras sociales y particulares.',
    priceRange: '$$$',
    imageUrl: CATEGORY_DEFAULT_IMAGES[Category.HEALTH],
    tags: ['Dentista', 'Salud', 'Urgencias'],
    isVerified: true,
    isPromoted: false,
    availability: 'Turnos Web',
    email: 'turnos@sonrisas.com',
    whatsapp: '+5492615550102'
  },

  // --- GODOY CRUZ ---
  {
    id: 'gc-1',
    name: 'Mecánica Integral Godoy',
    title: 'Service Oficial Multimarca',
    category: Category.AUTOMOTIVE,
    rating: 4.7,
    reviewCount: 210,
    location: 'San Martín Sur 200, Godoy Cruz',
    department: 'Godoy Cruz',
    latitude: -32.9252,
    longitude: -68.8444,
    description: 'Diagnóstico computarizado, tren delantero y frenos. Garantía en todos los trabajos.',
    priceRange: '$$',
    imageUrl: CATEGORY_DEFAULT_IMAGES[Category.AUTOMOTIVE],
    tags: ['Mecánico', 'Auto', 'Taller'],
    isVerified: true,
    isPromoted: true,
    availability: 'Lun-Sab',
    email: 'taller@godoymecanica.com',
    whatsapp: '+5492615550201'
  },
  {
    id: 'gc-2',
    name: 'FixIt Celulares',
    title: 'Reparación de iPhone y Android',
    category: Category.TECHNOLOGY,
    rating: 4.5,
    reviewCount: 56,
    location: 'Paso de los Andes 1000, Godoy Cruz',
    department: 'Godoy Cruz',
    latitude: -32.9150,
    longitude: -68.8550,
    description: 'Cambio de pantallas, baterías y reparación de placas en el acto.',
    priceRange: '$$',
    imageUrl: CATEGORY_DEFAULT_IMAGES[Category.TECHNOLOGY],
    tags: ['Celulares', 'Servicio Técnico', 'Apple'],
    isVerified: false,
    isPromoted: false,
    availability: '9:00 - 20:00',
    email: 'contacto@fixit.com',
    whatsapp: '+5492615550202'
  },

  // --- GUAYMALLÉN ---
  {
    id: 'g-1',
    name: 'Plomería El Cacique',
    title: 'Gasista Matriculado y Plomero',
    category: Category.HOME_REPAIR,
    rating: 4.9,
    reviewCount: 300,
    location: 'Dorrego, Guaymallén',
    department: 'Guaymallén',
    latitude: -32.9069,
    longitude: -68.8025,
    description: 'Destapes de cañerías con máquina, reparación de calefones y estufas. Urgencias 24hs.',
    priceRange: '$$',
    imageUrl: CATEGORY_DEFAULT_IMAGES[Category.HOME_REPAIR],
    tags: ['Plomero', 'Gasista', '24hs'],
    isVerified: true,
    isPromoted: false,
    availability: '24 horas',
    email: '',
    whatsapp: '+5492615550301'
  },
  {
    id: 'g-2',
    name: 'Profe Lucas Matemáticas',
    title: 'Clases Particulares Primaria/Secundaria',
    category: Category.EDUCATION,
    rating: 5.0,
    reviewCount: 22,
    location: 'Unimev, Guaymallén',
    department: 'Guaymallén',
    latitude: -32.9000,
    longitude: -68.7900,
    description: 'Preparo alumnos para ingresos universitarios y apoyo escolar. Presencial y Online.',
    priceRange: '$',
    imageUrl: CATEGORY_DEFAULT_IMAGES[Category.EDUCATION],
    tags: ['Clases', 'Matemática', 'Física'],
    isVerified: false,
    isPromoted: false,
    availability: 'Por la tarde',
    email: 'lucas@profesor.com',
    whatsapp: '+5492615550302'
  },

  // --- LAS HERAS ---
  {
    id: 'lh-1',
    name: 'Electricidad del Norte',
    title: 'Instalaciones Eléctricas Domiciliarias',
    category: Category.HOME_REPAIR,
    rating: 4.6,
    reviewCount: 45,
    location: 'San Miguel 1500, Las Heras',
    department: 'Las Heras',
    latitude: -32.8465,
    longitude: -68.8687,
    description: 'Cableados completos, colocación de luminarias y tableros. Presupuesto sin cargo.',
    priceRange: '$',
    imageUrl: CATEGORY_DEFAULT_IMAGES[Category.HOME_REPAIR],
    tags: ['Electricista', 'Obras', 'Luz'],
    isVerified: true,
    isPromoted: false,
    availability: 'Lunes a Sábado',
    email: '',
    whatsapp: '+5492615550401'
  },
  {
    id: 'lh-2',
    name: 'Gomería Los Andes',
    title: 'Venta de Neumáticos y Alineación',
    category: Category.AUTOMOTIVE,
    rating: 4.3,
    reviewCount: 90,
    location: 'Acceso Norte y Manuel A. Sáez',
    department: 'Las Heras',
    latitude: -32.8300,
    longitude: -68.8500,
    description: 'Reparación de llantas, balanceo y mecánica ligera.',
    priceRange: '$$',
    imageUrl: CATEGORY_DEFAULT_IMAGES[Category.AUTOMOTIVE],
    tags: ['Gomería', 'Ruedas', 'Auto'],
    isVerified: true,
    isPromoted: false,
    availability: 'Horario corrido',
    email: 'ventas@gomerialosandes.com',
    whatsapp: '+5492615550402'
  },

  // --- MAIPÚ ---
  {
    id: 'm-1',
    name: 'Salón de Eventos Las Viñas',
    title: 'Bodas, Cumpleaños y Corporativos',
    category: Category.EVENTS,
    rating: 4.8,
    reviewCount: 150,
    location: 'Maza 3000, Gutiérrez, Maipú',
    department: 'Maipú',
    latitude: -32.9776,
    longitude: -68.7909,
    description: 'Amplios jardines, catering propio y seguridad privada. Capacidad para 300 personas.',
    priceRange: '$$$$',
    imageUrl: CATEGORY_DEFAULT_IMAGES[Category.EVENTS],
    tags: ['Salón', 'Fiesta', 'Catering'],
    isVerified: true,
    isPromoted: true,
    availability: 'Reservas abiertas',
    email: 'eventos@lasvinas.com',
    whatsapp: '+5492615550501'
  },
  {
    id: 'm-2',
    name: 'Servicios de Jardinería Verde',
    title: 'Mantenimiento de Espacios Verdes',
    category: Category.HOME_REPAIR,
    rating: 4.5,
    reviewCount: 30,
    location: 'Luzuriaga, Maipú',
    department: 'Maipú',
    latitude: -32.9500,
    longitude: -68.8100,
    description: 'Poda, limpieza de piscinas y diseño de jardines. Abonos mensuales.',
    priceRange: '$$',
    imageUrl: CATEGORY_DEFAULT_IMAGES[Category.HOME_REPAIR],
    tags: ['Jardinero', 'Piscina', 'Paisajismo'],
    isVerified: false,
    isPromoted: false,
    availability: 'Lun a Vie',
    email: '',
    whatsapp: '+5492615550502'
  },

  // --- LUJÁN DE CUYO ---
  {
    id: 'lc-1',
    name: 'Kinesiología Chacras',
    title: 'Rehabilitación y Pilates Terapéutico',
    category: Category.HEALTH,
    rating: 5.0,
    reviewCount: 60,
    location: 'Italia 560, Chacras de Coria',
    department: 'Luján de Cuyo',
    latitude: -33.0060,
    longitude: -68.8785,
    description: 'Atención personalizada por profesionales licenciados. Obras sociales y prepagas.',
    priceRange: '$$$',
    imageUrl: CATEGORY_DEFAULT_IMAGES[Category.HEALTH],
    tags: ['Kinesiología', 'Salud', 'Pilates'],
    isVerified: true,
    isPromoted: false,
    availability: 'Con turno',
    email: 'info@kinechacras.com',
    whatsapp: '+5492615550601'
  },
  {
    id: 'lc-2',
    name: 'DJ & Sonido Luján',
    title: 'Música e Iluminación para Fiestas',
    category: Category.EVENTS,
    rating: 4.7,
    reviewCount: 40,
    location: 'Sáenz Peña, Luján de Cuyo',
    department: 'Luján de Cuyo',
    latitude: -33.0350,
    longitude: -68.8800,
    description: 'Equipos de última generación, pantallas LED y animación.',
    priceRange: '$$',
    imageUrl: CATEGORY_DEFAULT_IMAGES[Category.EVENTS],
    tags: ['DJ', 'Sonido', 'Fiesta'],
    isVerified: false,
    isPromoted: false,
    availability: 'Fines de semana',
    email: 'dj@lujanparty.com',
    whatsapp: '+5492615550602'
  }
];
