import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getConfig } from './config';

// Priority: 1. Runtime config (Render env → /api/config), 2. Local Storage
const getSupabaseConfig = () => {
  const envUrl = getConfig('VITE_SUPABASE_URL');
  const envKey = getConfig('VITE_SUPABASE_ANON_KEY');

  const localUrl = localStorage.getItem('VITE_SUPABASE_URL');
  const localKey = localStorage.getItem('VITE_SUPABASE_ANON_KEY');

  return {
    url: envUrl || localUrl || '',
    key: envKey || localKey || ''
  };
};

// Lazy client — re-created when config changes
let _client: SupabaseClient | null = null;
let _clientUrl = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const config = getSupabaseConfig();
  if (!config.url || !config.key) return null;
  // Re-create client if URL changed (e.g. user updated settings)
  if (!_client || _clientUrl !== config.url) {
    _client = createClient(config.url, config.key);
    _clientUrl = config.url;
  }
  return _client;
};

// Legacy export for backward compatibility - evaluates at call time
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase henüz yapılandırılmadı. Lütfen ayarlardan URL ve Key girin.');
    return (client as unknown as Record<string | symbol, unknown>)[prop];
  }
});

export const isSupabaseConfigured = () => {
  const current = getSupabaseConfig();
  return !!(current.url && current.key);
};
