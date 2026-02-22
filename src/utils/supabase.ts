// Supabase Client Utility

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('VITE_SUPABASE_URL');

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('VITE_SUPABASE_ANON_KEY');

// In a real implementation with @supabase/supabase-js:
// import { createClient } from '@supabase/supabase-js'
// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getSupabaseStatus = () => {
  return (supabaseUrl && supabaseAnonKey) ? 'connected' : 'disconnected';
};
