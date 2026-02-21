import { createClient } from '@supabase/supabase-js';

// Priority: 1. Environment Variables, 2. Local Storage
const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const localUrl = localStorage.getItem('VITE_SUPABASE_URL');
  const localKey = localStorage.getItem('VITE_SUPABASE_ANON_KEY');

  return {
    url: envUrl || localUrl || '',
    key: envKey || localKey || ''
  };
};

const config = getSupabaseConfig();

// Only create the client if we have the required parameters
export const supabase = (config.url && config.key)
  ? createClient(config.url, config.key)
  : null;

export const isSupabaseConfigured = () => {
  // Re-check config in case it was updated in the same session (though client won't re-init without refresh)
  const current = getSupabaseConfig();
  return !!(current.url && current.key);
};
