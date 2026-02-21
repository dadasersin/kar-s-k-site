import type { ApiKeyEntry, SyncSettings, ApiProvider } from '../types';

const getEnvKeys = (): ApiKeyEntry[] => {
  const envKeys: ApiKeyEntry[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const env = (import.meta as any).env;

  const mapping = [
    { key: 'VITE_GEMINI_API_KEY', provider: 'gemini', model: 'gemini-1.5-pro', label: 'System Gemini' },
    { key: 'VITE_OPENAI_API_KEY', provider: 'openai', model: 'gpt-4o', label: 'System OpenAI' },
    { key: 'VITE_DEEPSEEK_API_KEY', provider: 'deepseek', model: 'deepseek-chat', label: 'System DeepSeek' },
    { key: 'VITE_GROK_API_KEY', provider: 'grok', model: 'grok-1', label: 'System Grok' },
  ];

  mapping.forEach(m => {
    const val = env[m.key];
    if (val && val.length > 5) {
      const usageKey = `usage_${m.key}`;
      const usage = localStorage.getItem(usageKey) || '0';
      envKeys.push({
        id: m.key,
        key: val,
        label: m.label,
        provider: m.provider as ApiProvider,
        modelName: m.model,
        isQuotaExhausted: false,
        usageCount: parseInt(usage, 10)
      });
    }
  });

  return envKeys;
};

export const getAvailableKeys = (provider?: string): ApiKeyEntry[] => {
  const allKeys: ApiKeyEntry[] = getEnvKeys();

  // 2. Get keys from local storage
  const settingsStr = localStorage.getItem('sync_settings');
  if (settingsStr) {
    try {
      const settings: SyncSettings = JSON.parse(settingsStr);
      if (settings.customApiKeys) {
        allKeys.push(...settings.customApiKeys.map(k => ({
          ...k,
          usageCount: k.usageCount || 0
        })));
      }
    } catch (e) {
      console.error("Failed to parse sync_settings", e);
    }
  }

  if (provider) {
    return allKeys.filter(k => k.provider === provider && !k.isQuotaExhausted);
  }

  return allKeys.filter(k => !k.isQuotaExhausted);
};

export const getAllKeys = (): ApiKeyEntry[] => {
  const allKeys: ApiKeyEntry[] = getEnvKeys();

  // Custom keys
  const settingsStr = localStorage.getItem('sync_settings');
  if (settingsStr) {
    try {
      const settings: SyncSettings = JSON.parse(settingsStr);
      if (settings.customApiKeys) {
        allKeys.push(...settings.customApiKeys.map(k => ({
          ...k,
          usageCount: k.usageCount || 0
        })));
      }
    } catch (e) {
      console.error("Failed to parse sync_settings", e);
    }
  }

  return allKeys;
};

export const incrementUsage = (id: string) => {
  if (id.startsWith('VITE_')) {
    const usageKey = `usage_${id}`;
    const current = parseInt(localStorage.getItem(usageKey) || '0', 10);
    localStorage.setItem(usageKey, (current + 1).toString());
    return;
  }

  const settingsStr = localStorage.getItem('sync_settings');
  if (!settingsStr) return;

  try {
    const settings: SyncSettings = JSON.parse(settingsStr);
    const updatedKeys = settings.customApiKeys.map(k =>
      k.id === id ? { ...k, usageCount: (k.usageCount || 0) + 1, lastUsed: Date.now() } : k
    );
    localStorage.setItem('sync_settings', JSON.stringify({ ...settings, customApiKeys: updatedKeys }));
  } catch (e) {
    console.error("Failed to update usage count", e);
  }
};

export const markKeyAsExhausted = (id: string) => {
  if (id.startsWith('VITE_')) return;

  const settingsStr = localStorage.getItem('sync_settings');
  if (!settingsStr) return;

  try {
    const settings: SyncSettings = JSON.parse(settingsStr);
    const updatedKeys = settings.customApiKeys.map(k =>
      k.id === id ? { ...k, isQuotaExhausted: true } : k
    );
    localStorage.setItem('sync_settings', JSON.stringify({ ...settings, customApiKeys: updatedKeys }));
  } catch (e) {
    console.error("Failed to update key status", e);
  }
};
