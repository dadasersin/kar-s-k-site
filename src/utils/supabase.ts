import { createClient } from '@supabase/supabase-js';
import { getStorageItem } from './storage';

const getSupabaseConfig = () => {
  const saved = getStorageItem('supabase_config', { url: '', anonKey: '' });

  // Provided token from user: sbp_v0_a8427122d22c4380ffcb1e0f9b21083bdf1b4767
  const defaultAnonKey = 'sbp_v0_a8427122d22c4380ffcb1e0f9b21083bdf1b4767';

  return {
    url: (import.meta as any).env?.VITE_SUPABASE_URL || saved.url || 'https://b6a2f6ba220b4cb79120f130847064d7.supabase.co', // Inferred URL or fallback
    anonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || saved.anonKey || defaultAnonKey
  };
};

const { url, anonKey } = getSupabaseConfig();

export const supabase = (url && anonKey)
  ? createClient(url, anonKey)
  : null;

export const isSupabaseConfigured = () => !!supabase;
