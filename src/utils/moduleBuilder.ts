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
    const bt = "```";
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
        return registerDynamicModule(id, label, generatedCode, usedKeyId);
    }

    return { success: false, error: 'Kod üretilemedi.' };
};

export const integrateLinkAutomatically = async (url: string, originalText: string): Promise<BuildResult> => {
    const id = Math.random().toString(36).substr(2, 9);
    const nameMatch = originalText.match(/(?:bana\s+)?(.+?)\s+(?:linkini|sitesini)/i);
    const label = nameMatch ? nameMatch[1].trim() : 'Link Entegrasyonu';

    const code = `
      <div class="w-full h-full flex flex-col bg-slate-950 rounded-[2.8rem] overflow-hidden shadow-2xl border border-white/10">
        <div class="flex items-center justify-between p-6 border-b border-white/5 bg-slate-900/40">
           <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                 <i class="fa-solid fa-link text-lg"></i>
              </div>
              <div>
                 <h3 class="text-base font-black text-white uppercase tracking-widest italic leading-tight">${label}</h3>
                 <p class="text-[10px] text-slate-500 font-bold tracking-tight">${url}</p>
              </div>
           </div>
           <div class="flex gap-3">
              <a href="${url}" target="_blank" class="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> DIŞA AKTAR
              </a>
           </div>
        </div>
        <div class="flex-1 bg-white relative">
           <iframe src="${url}" class="absolute inset-0 w-full h-full border-none"></iframe>
        </div>
        <div class="p-3 bg-slate-900/60 border-t border-white/5 flex justify-center">
           <p class="text-[8px] font-black text-slate-600 uppercase tracking-widest">Otonom Köprü Entegrasyonu v1.0 • Ersin Güleş</p>
        </div>
      </div>
    `;

    return registerDynamicModule(id, label, code);
};

const registerDynamicModule = (id: string, label: string, code: string, keyId?: string): BuildResult => {
    try {
        const activeModules = getStorageItem('active_dynamic_modules', []);
        activeModules.push({
            id,
            label,
            code,
            icon: 'fa-cube',
            timestamp: Date.now()
        });
        localStorage.setItem('active_dynamic_modules', JSON.stringify(activeModules));
        if (keyId) recordUsage(keyId);
        return { success: true, moduleId: id, label };
    } catch (e) {
        return { success: false, error: 'Kayıt sırasında hata oluştu.' };
    }
};
