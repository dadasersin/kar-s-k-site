import type { ApiKeyEntry, SyncSettings } from '../types';

export const getAvailableKeys = (provider?: string): ApiKeyEntry[] => {
  const allKeys = getAllKeys();
  const available = allKeys.filter(k => !k.isQuotaExhausted);

  if (provider) {
    return available.filter(k => k.provider === provider);
  }

  return available;
};

export const getAllKeys = (): ApiKeyEntry[] => {
  const allKeys: ApiKeyEntry[] = [];
  const env = (import.meta as any).env;

  // 1. Get system keys from environment (Render / .env)
  const envConfigs = [
    { key: 'VITE_GEMINI_API_KEY', provider: 'gemini', label: 'Render Gemini', model: 'gemini-2.0-flash' },
    { key: 'VITE_OPENAI_API_KEY', provider: 'openai', label: 'Render OpenAI', model: 'gpt-4o' },
    { key: 'VITE_ANTHROPIC_API_KEY', provider: 'anthropic', label: 'Render Anthropic', model: 'claude-3-5-sonnet-latest' },
    { key: 'VITE_DEEPSEEK_API_KEY', provider: 'deepseek', label: 'Render DeepSeek', model: 'deepseek-chat' },
    { key: 'VITE_GROK_API_KEY', provider: 'grok', label: 'Render Grok', model: 'grok-beta' }
  ];

  envConfigs.forEach(conf => {
    const val = env?.[conf.key];
    if (val && val.length > 5) {
      allKeys.push({
        id: `env-${conf.provider}`,
        key: val,
        label: conf.label,
        provider: conf.provider as any,
        modelName: conf.model,
        isQuotaExhausted: false,
        usageCount: Number(localStorage.getItem(`usage_env_${conf.provider}`) || 0),
        quotaLimit: conf.provider === 'gemini' ? 1500 : 500
      });
    }
  });

  // 2. Get keys from local storage (Sync Settings)
  try {
    const settingsStr = localStorage.getItem('sync_settings');
    if (settingsStr) {
      const settings: SyncSettings = JSON.parse(settingsStr);
      if (settings.customApiKeys) {
        allKeys.push(...settings.customApiKeys.map(k => ({
          ...k,
          usageCount: k.usageCount || 0,
          quotaLimit: k.quotaLimit || (k.provider === 'gemini' ? 1500 : 500)
        })));
      }
    }
  } catch (e) {
    console.error("Failed to parse sync_settings in getAllKeys", e);
  }

  return allKeys;
};

export const recordUsage = (id: string) => {
  if (id.startsWith('env-')) {
    const provider = id.replace('env-', '');
    const current = Number(localStorage.getItem(`usage_env_${provider}`) || 0);
    localStorage.setItem(`usage_env_${provider}`, (current + 1).toString());
    return;
  }

  try {
    const settingsStr = localStorage.getItem('sync_settings');
    if (!settingsStr) return;

    const settings: SyncSettings = JSON.parse(settingsStr);
    const updatedKeys = settings.customApiKeys.map(k =>
      k.id === id ? { ...k, usageCount: (k.usageCount || 0) + 1 } : k
    );
    localStorage.setItem('sync_settings', JSON.stringify({ ...settings, customApiKeys: updatedKeys }));
  } catch (e) {
    console.error("Failed to update usage count", e);
  }
};

export const markKeyAsExhausted = (id: string) => {
  if (id.startsWith('env-')) return;

  try {
    const settingsStr = localStorage.getItem('sync_settings');
    if (!settingsStr) return;

    const settings: SyncSettings = JSON.parse(settingsStr);
    const updatedKeys = settings.customApiKeys.map(k =>
      k.id === id ? { ...k, isQuotaExhausted: true } : k
    );
    localStorage.setItem('sync_settings', JSON.stringify({ ...settings, customApiKeys: updatedKeys }));
  } catch (e) {
    console.error("Failed to update key status", e);
  }
};
