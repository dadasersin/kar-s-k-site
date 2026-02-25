import type { ApiKeyEntry, SyncSettings } from '../types';

export const getAvailableKeys = (provider?: string): ApiKeyEntry[] => {
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
      isQuotaExhausted: false
    });
  }

  // 2. Get keys from local storage
  try {
    const settingsStr = localStorage.getItem('sync_settings');
    if (settingsStr) {
      const settings: SyncSettings = JSON.parse(settingsStr);
      if (settings.customApiKeys) {
        // Migration: Old model name fix
        const migratedKeys = settings.customApiKeys.map(k => {
          if (k.modelName === 'gemini-3-flash-preview') {
            return { ...k, modelName: 'gemini-1.5-flash' };
          }
          return k;
        });
        allKeys.push(...migratedKeys.filter(k => !k.isQuotaExhausted));
      }
    }
  } catch (e) {
    console.error("Failed to parse sync_settings in getAvailableKeys", e);
  }

  if (provider) {
    return allKeys.filter(k => k.provider === provider);
  }

  return allKeys;
};

export const markKeyAsExhausted = (id: string) => {
  if (id === 'env-default') return; // Cannot permanently mark env key as exhausted in localStorage

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
