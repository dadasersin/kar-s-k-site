import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAvailableKeys, incrementUsage, markKeyAsExhausted } from './apiPool';
import type { ChatMessage, ApiKeyEntry } from '../types';

export const callOpenAiCompatible = async (keyEntry: ApiKeyEntry, text: string, history: ChatMessage[]) => {
  const url = keyEntry.baseUrl || 'https://api.openai.com/v1';
  const formattedHistory = history.map(m => ({
    role: m.role === 'model' ? 'assistant' : 'user',
    content: m.text
  }));

  const response = await fetch(`${url}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${keyEntry.key}`
    },
    body: JSON.stringify({
      model: keyEntry.modelName,
      messages: [...formattedHistory, { role: 'user', content: text }],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `HTTP ${response.status} hatası`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

export const callAI = async (text: string, options?: { systemInstruction?: string, history?: ChatMessage[] }) => {
  const availableKeys = getAvailableKeys();
  if (availableKeys.length === 0) {
    throw new Error('Kullanılabilir API anahtarı kalmadı.');
  }

  for (const keyEntry of availableKeys) {
    try {
      let aiResponse = '';

      if (keyEntry.provider === 'gemini') {
        const genAI = new GoogleGenerativeAI(keyEntry.key);
        const model = genAI.getGenerativeModel({
          model: keyEntry.modelName,
          systemInstruction: options?.systemInstruction,
        });

        const chat = model.startChat({
          history: options?.history?.map(m => ({
            role: m.role === 'model' ? 'model' : 'user',
            parts: [{ text: m.text }]
          })) || [],
        });

        const result = await chat.sendMessage(text);
        aiResponse = result.response.text();
      } else {
        aiResponse = await callOpenAiCompatible(keyEntry, text, options?.history || []);
      }

      incrementUsage(keyEntry.id);
      return { text: aiResponse, model: keyEntry.modelName, provider: keyEntry.provider };
    } catch (error: Error) {
      console.error(`API hatası [${keyEntry.label}]:`, error);
      if (error.message?.includes('429') || error.message?.toLowerCase().includes('quota')) {
        markKeyAsExhausted(keyEntry.id);
        continue;
      } else {
        throw error;
      }
    }
  }
  throw new Error('Tüm API anahtarları denendi fakat sonuç alınamadı.');
};
