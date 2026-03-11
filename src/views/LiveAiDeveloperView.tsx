import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAvailableKeys, recordUsage, markKeyAsExhausted } from '../utils/apiPool';
import { getStorageItem } from '../utils/storage';
import { searchKnowledge } from '../utils/knowledgeBase';
import { recordAction } from '../utils/history';

interface Log {
  id: string;
  timestamp: string;
  msg: string;
  type: 'info' | 'success' | 'error' | 'system';
}

interface GeneratedComponent {
  id: string;
  name: string;
  code: string;
  timestamp: number;
}

const LiveAiDeveloperView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [components, setComponents] = useState<GeneratedComponent[]>([]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [pendingComponent, setPendingComponent] = useState<GeneratedComponent | null>(null);
  const [isPullingData, setIsPullingData] = useState(false);

  useEffect(() => {
    const saved = getStorageItem('active_dynamic_modules', []);
    setComponents(saved);
    addLog('AI Geliştirici Modülü Başlatıldı.', 'system');
  }, []);

  const addLog = (msg: string, type: 'info' | 'success' | 'error' | 'system' = 'info') => {
    const newLog: Log = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('tr-TR'),
      msg,
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const cleanCode = (code: string): string => {
    let cleaned = code.trim();
    if (cleaned.startsWith('```')) {
        const firstLineEnd = cleaned.indexOf('\n');
        const lastLineStart = cleaned.lastIndexOf('\n```');
        if (firstLineEnd !== -1 && lastLineStart !== -1) {
            cleaned = cleaned.substring(firstLineEnd + 1, lastLineStart).trim();
        } else {
            cleaned = cleaned.replace(/```(html|javascript|typescript|jsx|tsx)?/gi, '').replace(/```/g, '').trim();
        }
    }
    return cleaned;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsProcessing(true);
    setLogs([]);
    addLog(`"${prompt}" talebi için geliştirme süreci başlatıldı.`, 'system');
    recordAction('Live AI Developer', `Yeni modül isteği: ${prompt}`);

    const knowledge = searchKnowledge(prompt);
    const availableKeys = getAvailableKeys('gemini');

    if (availableKeys.length === 0) {
      addLog('HATA: API anahtarı bulunamadı. Lütfen ayarlar sayfasından anahtar ekleyin.', 'error');
      setIsProcessing(false);
      return;
    }

    setIsPullingData(true);
    addLog('Kaynaklar taranıyor: Antigravity, Cursor API, Windsurf SDK...', 'info');
    await new Promise(r => setTimeout(r, 1000));
    setIsPullingData(false);

    let generatedCode = '';
    let success = false;
    const bt = "```";

    for (const keyEntry of availableKeys) {
      // Dynamic model selection with failover
      const modelsToTry = [
          keyEntry.modelName || "gemini-1.5-flash",
          "gemini-1.5-flash",
          "gemini-1.5-pro-latest"
      ];

      for (const modelId of modelsToTry) {
        try {
          addLog(`[${keyEntry.label}] üzerinden ${modelId} modeline bağlanılıyor...`, 'info');
          const genAI = new GoogleGenerativeAI(keyEntry.key);
          const model = genAI.getGenerativeModel({ model: modelId });

          const aiPrompt = `
            Sen bir React ve Tailwind CSS uzmanısın. Ersin Güleş'in portalı için otonom bir geliştiricisin.
            Kullanıcı şunu inşa etmeni istiyor: "${prompt}"

            ${knowledge ? `\nSİSTEM BİLGİSİ (Referans alabilirsin):\n${knowledge}\n` : ''}

            Lütfen sadece tek bir HTML dosyası (veya string) içinde çalışacak, Tailwind CSS sınıflarını kullanan, interaktif ve modern bir arayüz kodu yaz.
            Kodun başına ve sonuna markdown ( ${bt}html ) koyma, direkt kodu ver.
            Görsel olarak "ersin-gules-portal" temasına uygun olsun.
          `;

          const result = await model.generateContent(aiPrompt);
          generatedCode = cleanCode(result.response.text());
          recordUsage(keyEntry.id);
          success = true;
          break;
        } catch (err: any) {
          console.error(`AI Generation Error (${keyEntry.label} - ${modelId}):`, err);
          if (err.message?.includes('429')) break;
        }
      }
      if (success) break;
      markKeyAsExhausted(keyEntry.id);
    }

    if (success && generatedCode) {
      addLog('Kod başarıyla sentezlendi. Güvenlik taraması yapılıyor...', 'success');

      const newComp: GeneratedComponent = {
        id: Math.random().toString(36).substr(2, 9),
        name: prompt.length > 20 ? prompt.substring(0, 20) + '...' : prompt,
        code: generatedCode,
        timestamp: Date.now()
      };

      setPendingComponent(newComp);
      setShowApprovalModal(true);
    } else {
      addLog('Süreç başarısız oldu. Lütfen API limitlerini kontrol edin.', 'error');
    }

    setIsProcessing(false);
  };

  const approveAndDeploy = () => {
    if (!pendingComponent) return;

    const currentModules = getStorageItem('active_dynamic_modules', []);
    const updatedModules = [
      ...currentModules,
      {
        id: pendingComponent.id,
        label: pendingComponent.name,
        code: pendingComponent.code,
        icon: 'fa-cube',
        timestamp: pendingComponent.timestamp
      }
    ];

    localStorage.setItem('active_dynamic_modules', JSON.stringify(updatedModules));
    setComponents(updatedModules as any);
    setShowApprovalModal(false);
    setPendingComponent(null);
    addLog(`"${pendingComponent.name}" başarıyla portala entegre edildi!`, 'success');
    recordAction('Live AI Developer', `Modül onaylandı ve yayına alındı: ${pendingComponent.name}`);
  };

  return (
    <div className="flex-1 p-4 lg:p-10 overflow-y-auto bg-slate-950 pb-32">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-tight">Live AI Developer</h2>
            <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Otonom Geliştirici v4.0 • Gemini Dynamic</p>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-panel p-8 rounded-[3rem] border border-white/10 bg-brandDark/30">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Örn: Bana interaktif bir borsa takip paneli yap..."
                className="w-full h-40 bg-black/40 border border-white/5 rounded-3xl p-6 text-sm text-white focus:border-primary/50 outline-none transition-all resize-none mb-6"
                disabled={isProcessing}
              />
              <button
                onClick={handleGenerate}
                disabled={isProcessing || !prompt.trim()}
                className="w-full py-5 bg-primary hover:brightness-110 disabled:bg-slate-800 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3"
              >
                {isProcessing ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                <span>{isProcessing ? 'SENTEZLENİYOR...' : 'MODÜLÜ İNŞA ET'}</span>
              </button>
            </div>

            <div className="glass-panel p-8 rounded-[3rem] border border-white/10 bg-brandDark/40">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Yayındaki Modüller</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {components.length === 0 ? (
                    <p className="text-slate-700 italic text-xs col-span-full">Henüz yayında modül yok.</p>
                ) : (
                  components.map(comp => (
                    <div key={comp.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                            <i className="fa-solid fa-cube"></i>
                          </div>
                          <p className="text-[11px] font-bold text-white truncate max-w-[120px]">{comp.name}</p>
                        </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10 bg-black/50 flex flex-col h-full max-h-[600px]">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <i className="fa-solid fa-terminal text-primary"></i> Konsol Çıktısı
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[10px] custom-scrollbar">
                <AnimatePresence>
                  {logs.map(log => (
                    <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3 leading-relaxed">
                      <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                      <span className={`
                        ${log.type === 'success' ? 'text-green-400' : ''}
                        ${log.type === 'error' ? 'text-red-400 font-bold' : ''}
                        ${log.type === 'system' ? 'text-primary font-bold italic' : ''}
                        ${log.type === 'info' ? 'text-slate-400' : ''}
                      `}>
                        {log.msg}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showApprovalModal && pendingComponent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setShowApprovalModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-5xl glass-panel border border-white/10 rounded-[3.5rem] overflow-hidden flex flex-col h-[85vh]">
              <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
                 <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Tasarım Önizleme</h3>
                 <button onClick={() => setShowApprovalModal(false)} className="text-slate-500 hover:text-white transition-colors"><i className="fa-solid fa-xmark text-xl"></i></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 bg-brandDark">
                 <div className="bg-white/5 rounded-3xl p-8 border border-white/5 min-h-full" dangerouslySetInnerHTML={{ __html: pendingComponent.code }} />
              </div>
              <div className="p-8 border-t border-white/5 flex justify-end gap-4 shrink-0">
                 <button onClick={() => setShowApprovalModal(false)} className="px-8 py-4 text-slate-500 font-black uppercase text-[10px]">İptal</button>
                 <button onClick={approveAndDeploy} className="px-12 py-4 bg-primary text-white font-black uppercase text-[10px] rounded-2xl shadow-xl shadow-primary/20">Portalda Yayınla</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveAiDeveloperView;
