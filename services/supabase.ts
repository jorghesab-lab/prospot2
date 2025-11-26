import { createClient } from '@supabase/supabase-js';

// Vercel automatically injects these variables when you connect a Supabase project via the Storage tab.
// We check if they exist to determine if we should run in "Cloud Mode" or "Local Mode".
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// If keys are missing (dev mode or not linked yet), supabase will be null.
// The app handles this by falling back to localStorage seamlessly.
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;