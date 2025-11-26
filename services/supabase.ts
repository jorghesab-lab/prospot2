import { createClient } from '@supabase/supabase-js';

// NOTA: Reemplaza estos valores con los de tu proyecto en supabase.com
// Si dejas estos valores por defecto, la app usará el almacenamiento local (Híbrido).
const SUPABASE_URL = 'TU_URL_AQUI' as string; 
const SUPABASE_ANON_KEY = 'TU_CLAVE_AQUI' as string;

const isConfigured = 
  SUPABASE_URL !== 'TU_URL_AQUI' && 
  SUPABASE_ANON_KEY !== 'TU_CLAVE_AQUI' &&
  SUPABASE_URL.startsWith('http');

export const supabase = isConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;