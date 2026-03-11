import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAvailableKeys, recordUsage, markKeyAsExhausted } from './apiPool';
import { searchKnowledge } from './knowledgeBase';
import { getStorageItem } from './storage';

export interface BuildResult {
    success: boolean;
    moduleId?: string;
    label?: string;
    error?: string;
}

export const buildModuleAutomatically = async (prompt: string): Promise<BuildResult> => {
    const knowledge = searchKnowledge(prompt);
    const availableKeys = getAvailableKeys('gemini');

    if (availableKeys.length === 0) {
        return { success: false, error: 'API Anahtarı bulunamadı. Lütfen Ayarlar sayfasından bir Gemini API anahtarı ekleyin.' };
    }

    let generatedCode = '';
    let success = false;
    const bt = '```';
    let usedKeyId = '';

    for (const keyEntry of availableKeys) {
        try {
            const genAI = new GoogleGenerativeAI(keyEntry.key);
            const model = genAI.getGenerativeModel({ model: keyEntry.modelName || "gemini-1.5-flash" });

            const aiPrompt = `
          Sen bir React ve Tailwind CSS uzmanısın. Ersin Güleş'in portalı için otonom bir geliştiricisin.
          Kullanıcı şunu inşa etmeni istiyor: "${prompt}"

          ${knowledge ? `\nSİSTEM BİLGİSİ (Referans alabilirsin):\n${knowledge}\n` : ''}

          Lütfen sadece tek bir HTML dosyası (veya string) içinde çalışacak, Tailwind CSS sınıflarını kullanan, interaktif ve modern bir arayüz kodu yaz.
          Kodun içinde <script> etiketleri ile gerekli JS logicleri olabilir.
          Kodun başına ve sonuna markdown ( ${bt}html ) koyma, direkt kodu ver.
          Bu kod bir iframe içinde veya div içinde render edilecek.
          Görsel olarak "ersin-gules-portal" temasına (koyu, neon mavi/indigo) uygun olsun.
          DURUM: Simülasyon değil, GERÇEK ÇALIŞAN bir modül olmalı.
        `;

            const result = await model.generateContent(aiPrompt);
            generatedCode = result.response.text();
            usedKeyId = keyEntry.id;
            success = true;
            break;
        } catch (err: any) {
            console.error(`Auto Build Error (${keyEntry.label}):`, err);
            if (err.message?.includes('429') || err.message?.toLowerCase().includes('quota')) {
                markKeyAsExhausted(keyEntry.id);
                continue;
            } else {
                return { success: false, error: err.message };
            }
        }
    }

    if (success && generatedCode) {
        const id = Math.random().toString(36).substr(2, 9);
        const label = prompt.length > 20 ? prompt.substring(0, 20) + '...' : prompt;

        try {
            const activeModules = getStorageItem('active_dynamic_modules', []);
            activeModules.push({
                id,
                label,
                code: generatedCode,
                icon: 'fa-cube',
                timestamp: Date.now()
            });
            localStorage.setItem('active_dynamic_modules', JSON.stringify(activeModules));
            recordUsage(usedKeyId);
            return { success: true, moduleId: id, label };
        } catch (e) {
            return { success: false, error: 'Kayıt sırasında hata oluştu.' };
        }
    }

    return { success: false, error: 'Kod üretilemedi.' };
};
