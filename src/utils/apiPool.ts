import { GoogleGenerativeAI } from '@google/generative-ai';
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
        isQuotaExhausted: localStorage.getItem(`exhausted_env_${conf.provider}`) === 'true',
        usageCount: Number(localStorage.getItem(`usage_env_${conf.provider}`) || 0),
        quotaLimit: conf.provider === 'gemini' ? 1500 : 500
      });
    }
  });

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
    window.dispatchEvent(new Event('storage'));
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
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error("Failed to update usage count", e);
  }
};

export const markKeyAsExhausted = (id: string) => {
  if (id.startsWith('env-')) {
    const provider = id.replace('env-', '');
    localStorage.setItem(`exhausted_env_${provider}`, 'true');
    window.dispatchEvent(new Event('storage'));
    return;
  }

  try {
    const settingsStr = localStorage.getItem('sync_settings');
    if (!settingsStr) return;

    const settings: SyncSettings = JSON.parse(settingsStr);
    const updatedKeys = settings.customApiKeys.map(k =>
      k.id === id ? { ...k, isQuotaExhausted: true } : k
    );
    localStorage.setItem('sync_settings', JSON.stringify({ ...settings, customApiKeys: updatedKeys }));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error("Failed to update key status", e);
  }
};

export interface AiRequestOptions {
  systemInstruction?: string;
  history?: { role: 'user' | 'model' | 'assistant'; text: string }[];
  provider?: string;
}

export const executeAiRequest = async (prompt: string, options?: AiRequestOptions): Promise<{ text: string; keyInfo: ApiKeyEntry }> => {
  const availableKeys = getAvailableKeys(options?.provider);

  if (availableKeys.length === 0) {
    throw new Error("Aktif API anahtarı bulunamadı.");
  }

  for (const keyEntry of availableKeys) {
    try {
      let responseText = '';

      // Update global "last used" state for UI tracking
      localStorage.setItem('last_ai_usage_info', JSON.stringify({
          label: keyEntry.label,
          usage: (keyEntry.usageCount || 0) + 1,
          limit: keyEntry.quotaLimit || 500,
          provider: keyEntry.provider,
          timestamp: Date.now()
      }));
      window.dispatchEvent(new Event('storage'));

      if (keyEntry.provider === 'gemini') {
        const genAI = new GoogleGenerativeAI(keyEntry.key);
        const model = genAI.getGenerativeModel({
          model: keyEntry.modelName || 'gemini-2.0-flash',
          systemInstruction: options?.systemInstruction
        });

        const geminiHistory = (options?.history || []).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
        }));

        const chat = model.startChat({ history: geminiHistory });
        const result = await chat.sendMessage(prompt);
        responseText = result.response.text();
      } else if (keyEntry.provider === 'anthropic') {
         const response = await fetch('https://api.anthropic.com/v1/messages', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             'x-api-key': keyEntry.key,
             'anthropic-version': '2023-06-01',
             'dangerously-allow-browser': 'true'
           },
           body: JSON.stringify({
             model: keyEntry.modelName || 'claude-3-5-sonnet-latest',
             max_tokens: 2048,
             system: options?.systemInstruction,
             messages: [...(options?.history || []).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })), { role: 'user', content: prompt }]
           })
         });
         const data = await response.json();
         if (data.error) throw new Error(data.error.message);
         responseText = data.content[0].text;
      } else {
        const baseUrl = keyEntry.baseUrl || 'https://api.openai.com/v1';
        const response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${keyEntry.key}`
          },
          body: JSON.stringify({
            model: keyEntry.modelName,
            messages: [
              ...(options?.systemInstruction ? [{ role: 'system', content: options.systemInstruction }] : []),
              ...(options?.history || []).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
              { role: 'user', content: prompt }
            ]
          })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        responseText = data.choices[0].message.content;
      }

      recordUsage(keyEntry.id);
      return { text: responseText, keyInfo: keyEntry };
    } catch (error: any) {
      console.error(`Error with key ${keyEntry.label}:`, error);
      if (error.message?.includes('429') || error.message?.includes('limit')) {
        markKeyAsExhausted(keyEntry.id);
      }
      continue;
    }
  }

  throw new Error("Tüm API anahtarları denendi fakat yanıt alınamadı.");
};
