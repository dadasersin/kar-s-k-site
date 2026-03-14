import { createClient } from '@supabase/supabase-js';
import { getStorageItem } from './storage';

const getSupabaseConfig = () => {
  const saved = getStorageItem('supabase_config', { url: '', anonKey: '' });

  // Latest provided credentials
  const defaultUrl = 'https://uqregdoryxbuojefpdgs.supabase.co';
  const defaultAnonKey = 'sb_publishable_lpqWufc9faM-xjRMWW8L7Q_dV-h-pe8';

  return {
    url: (import.meta as any).env?.VITE_SUPABASE_URL || saved.url || defaultUrl,
    anonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || saved.anonKey || defaultAnonKey
  };
};

const { url, anonKey } = getSupabaseConfig();

export const supabase = (url && anonKey)
  ? createClient(url, anonKey)
  : null;

export const isSupabaseConfigured = () => !!supabase;
