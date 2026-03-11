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

  // 1. Get system default key (Gemini)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const systemKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (systemKey && systemKey.length > 5) {
    allKeys.push({
      id: 'env-default',
      key: systemKey,
      label: 'Sistem Gemini',
      provider: 'gemini',
      modelName: 'gemini-1.5-flash',
      isQuotaExhausted: false,
      usageCount: Number(localStorage.getItem('usage_env_default') || 0),
      quotaLimit: 1500 // Simulated for free tier
    });
  }

  // 2. Get keys from local storage
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
  if (id === 'env-default') {
    const current = Number(localStorage.getItem('usage_env_default') || 0);
    localStorage.setItem('usage_env_default', (current + 1).toString());
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
  if (id === 'env-default') return;

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
