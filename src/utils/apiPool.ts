import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ApiKeyEntry, SyncSettings } from '../types';
import { getRegistryKnowledge } from './moduleRegistry';

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
    { key: 'VITE_GEMINI_API_KEY', provider: 'gemini', label: 'Render Gemini', model: 'gemini-1.5-flash' },
    { key: 'VITE_OPENAI_API_KEY', provider: 'openai', label: 'Render OpenAI', model: 'gpt-4o-mini' },
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

const getSystemPrompt = () => {
    const registry = getRegistryKnowledge();
    return `
Sen Ersin Güleş'in özel yapay zeka portalı için çalışan profesyonel ve yardımsever bir asistansın.
Adın Jules. Kullanıcılara her zaman Türkçe cevap ver.
Portalın sahibi Ersin Güleş'tir ve ona sadıksın.
Teknik hatalardan bahsetme, her zaman çözüm odaklı ol.
Eğer bir görsel oluşturman istenirse, bunun için 'Görsel Stüdyo' modülünü kullanmalarını öner.

PORTAL YETENEKLERİ (İhtiyaç duyarsan yönlendir):
${registry}

KURALLAR:
1. Kısa ve öz cevaplar ver.
2. Kullanıcının sorusuna doğrudan odaklan.
3. Portal içinde olmayan bir özellik istenirse 'gelecek güncellemelerde eklenebilir' de.
`;
};

const sanitizeHistory = (history: any[]) => {
    if (!history || history.length === 0) return [];
    const result: any[] = [];
    let lastRole = '';

    history.forEach(m => {
        const role = m.role === 'user' ? 'user' : 'model';
        if (role !== lastRole) {
            result.push({ role, parts: [{ text: m.text }] });
            lastRole = role;
        } else {
            result[result.length - 1].parts[0].text += '\\n' + m.text;
        }
    });

    if (result.length > 0 && result[0].role !== 'user') result.shift();
    return result;
};

export const executeAiRequest = async (prompt: string, options?: AiRequestOptions): Promise<{ text: string; keyInfo: ApiKeyEntry }> => {
  const availableKeys = getAvailableKeys(options?.provider);

  if (availableKeys.length === 0) {
    throw new Error("Sistem yoğunluğu nedeniyle şu anda yanıt verilemiyor.");
  }

  const sortedKeys = [...availableKeys].sort((a, b) => {
    if (a.provider === 'gemini') return -1;
    if (b.provider === 'gemini') return 1;
    return 0;
  });

  const systemPrompt = options?.systemInstruction || getSystemPrompt();

  for (const keyEntry of sortedKeys) {
    try {
      let responseText = '';

      if (keyEntry.provider === 'gemini') {
        const genAI = new GoogleGenerativeAI(keyEntry.key);
        const modelsToTry = [
          keyEntry.modelName || 'gemini-1.5-flash',
          'gemini-1.5-flash-latest',
          'gemini-2.0-flash-exp',
          'gemini-1.5-pro'
        ];

        let lastError = null;
        for (const modelId of modelsToTry) {
          try {
            const model = genAI.getGenerativeModel({ model: modelId, systemInstruction: systemPrompt });
            const geminiHistory = sanitizeHistory(options?.history || []);
            const chat = model.startChat({ history: geminiHistory });
            const result = await chat.sendMessage(prompt);
            responseText = result.response.text();
            if (responseText) break;
          } catch (e: any) {
            lastError = e;
            if (e.message?.toLowerCase().includes('not found') || e.message?.includes('404')) continue;
            throw e;
          }
        }
        if (!responseText && lastError) throw lastError;

      } else {
         try {
             if (keyEntry.provider === 'anthropic') {
                const response = await fetch('https://api.anthropic.com/v1/messages', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'x-api-key': keyEntry.key, 'anthropic-version': '2023-06-01', 'dangerously-allow-browser': 'true' },
                  body: JSON.stringify({
                    model: keyEntry.modelName || 'claude-3-5-sonnet-latest',
                    max_tokens: 2048,
                    system: systemPrompt,
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
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${keyEntry.key}` },
                  body: JSON.stringify({
                    model: keyEntry.modelName || 'gpt-4o-mini',
                    messages: [
                      { role: 'system', content: systemPrompt },
                      ...(options?.history || []).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
                      { role: 'user', content: prompt }
                    ]
                  })
                });
                const data = await response.json();
                if (data.error) throw new Error(data.error.message);
                responseText = data.choices[0].message.content;
             }
         } catch (fetchErr: any) {
             console.warn(`Provider ${keyEntry.provider} failed:`, fetchErr.message);
             continue;
         }
      }

      if (responseText) {
        recordUsage(keyEntry.id);
        localStorage.setItem('last_ai_usage_info', JSON.stringify({
            label: keyEntry.label,
            usage: (keyEntry.usageCount || 0) + 1,
            limit: keyEntry.quotaLimit || 500,
            provider: keyEntry.provider,
            timestamp: Date.now()
        }));
        window.dispatchEvent(new Event('storage'));
        return { text: responseText, keyInfo: keyEntry };
      }
    } catch (error: any) {
      if (error.message?.includes('429') || error.message?.includes('limit') || error.message?.includes('quota')) {
        markKeyAsExhausted(keyEntry.id);
      }
      continue;
    }
  }

  throw new Error("Şu anda nöral ağlar çok yoğun. Lütfen Ayarlar kısmından anahtarlarınızı kontrol edin.");
};
