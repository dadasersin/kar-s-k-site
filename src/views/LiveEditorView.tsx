import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Code, Play, CheckCircle2, Layout, Layers, Cpu, Terminal, Eye, Copy } from 'lucide-react';
import { callAI } from '../utils/ai';

interface StagedComponent {
  id: string;
  name: string;
  description: string;
  code: string;
  type: 'chart' | 'list' | 'widget' | 'view';
}

const LiveEditorView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stagedComponent, setStagedComponent] = useState<StagedComponent | null>(null);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeSuccess, setMergeSuccess] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [showCode, setShowCode] = useState(false);

  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    setStagedComponent(null);
    setMergeSuccess(false);
    setLogs([]);
    setShowCode(false);

    addLog("İstek analiz ediliyor...");
    addLog("Sistem mimarisi taranıyor...");

    try {
      const systemInstruction = `Sen bir kıdemli React geliştiricisisin.
      Kullanıcının isteğine göre modern, şık ve fonksiyonel bir React bileşeni tasarla.
      Yanıtını SADECE aşağıdaki JSON formatında ver:
      {
        "name": "Bileşen Adı",
        "description": "Bileşenin ne yaptığına dair kısa açıklama",
        "type": "widget|view",
        "code": "React kodu (Tailwind CSS kullan, lucide-react ikonlarını kullanabilirsin. import React from 'react' ile başla)"
      }
      Önemli: Kod çalışabilir ve tek bir dosya gibi olmalı. 'export default' kullanma, 'export const GeneratedView = ...' formatını kullan.`;

      const result = await callAI(prompt, { systemInstruction });

      addLog(`${result.provider.toUpperCase()} (${result.model}) ile bağlantı kuruldu.`);
      addLog("Kod üretimi tamamlandı.");

      // Try to parse JSON from the response (AI sometimes wraps in code blocks)
      const cleanJson = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      setStagedComponent({
        id: 'comp_' + Date.now(),
        ...parsed
      });

      addLog("Önizleme hazır.");
    } catch (error: Error) {
      addLog(`HATA: ${error.message}`);
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMerge = () => {
    if (!stagedComponent) return;
    setIsMerging(true);
    addLog("Entegrasyon süreci başlatıldı...");

    setTimeout(() => {
      // Real logic: Save to localStorage for Dynamic Module System
      const existing = JSON.parse(localStorage.getItem('dynamic_modules') || '[]');
      localStorage.setItem('dynamic_modules', JSON.stringify([...existing, stagedComponent]));

      addLog("Modül veri tabanına kaydedildi.");
      addLog("Navigasyon şeması güncellendi.");

      setTimeout(() => {
        setIsMerging(false);
        setMergeSuccess(true);
        addLog("TEBRİKLER: Yeni özellik portalın bir parçası haline geldi!");
        // Notify user to refresh or use event
        window.dispatchEvent(new CustomEvent('dynamic-module-added'));
      }, 1500);
    }, 1000);
  };

  const copyCode = () => {
    if (stagedComponent) {
      navigator.clipboard.writeText(stagedComponent.code);
      alert('Kod kopyalandı!');
    }
  };

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
        <header>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(13,89,242,0.2)]">
                <Cpu className="w-7 h-7" />
             </div>
             <div>
                <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">AI Geliştirici Stüdyosu</h1>
                <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Canlı Önizleme ve Gerçek Zamanlı Entegrasyon</p>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-surface/30 shadow-2xl">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Özellik Talebi
              </h3>
              <div className="space-y-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Hangi özelliği eklemek istersiniz? Örn: 'Borsa sayfasına alarm sistemi ekle' veya 'Hava durumu widgetı tasarla'..."
                  className="w-full bg-black/40 border border-white/10 rounded-3xl p-6 text-sm text-white focus:border-primary outline-none transition-all min-h-[150px] resize-none placeholder:text-gray-700 font-bold"
                />
                <button
                  onClick={handleGenerate}
                  disabled={isProcessing || !prompt.trim()}
                  className="w-full py-4 bg-primary hover:brightness-110 disabled:bg-slate-800 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                >
                  {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Play className="w-4 h-4" />}
                  ÖZELLİĞİ OLUŞTUR
                </button>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-black/40 shadow-xl overflow-hidden min-h-[250px] flex flex-col">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Terminal className="w-3 h-3" />
                Sistem Logları
              </h3>
              <div className="flex-1 space-y-2 font-mono text-[10px] overflow-y-auto scrollbar-hide max-h-[300px]">
                {logs.length === 0 && <p className="text-slate-800 italic uppercase font-bold tracking-tighter">İşlem bekleniyor...</p>}
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-3 text-primary animate-in slide-in-from-left-2">
                    <span className="opacity-40">→</span>
                    <span className="font-bold">{log}</span>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {stagedComponent ? (
                <motion.div
                  key="staged"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  <div className="glass-panel rounded-[40px] border border-primary/20 bg-primary/5 overflow-hidden shadow-2xl relative">
                    <div className="p-6 border-b border-white/5 bg-black/20 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Layout className="w-5 h-5 text-primary" />
                          <span className="text-xs font-black text-white uppercase italic tracking-widest">Önizleme: {stagedComponent.name}</span>
                       </div>
                       <div className="flex gap-2">
                          <button
                            onClick={() => setShowCode(!showCode)}
                            className={`p-2 rounded-lg transition-all ${showCode ? 'bg-primary text-white' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                          >
                             {showCode ? <Eye className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                          </button>
                          <div className="w-2 h-2 rounded-full bg-red-500/50 mt-3"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-500/50 mt-3"></div>
                          <div className="w-2 h-2 rounded-full bg-green-500/50 mt-3"></div>
                       </div>
                    </div>

                    <div className="min-h-[400px] flex flex-col bg-brandDark/50">
                       {showCode ? (
                         <div className="p-6 font-mono text-[11px] overflow-auto h-full max-h-[400px] text-primary/80 relative">
                            <button onClick={copyCode} className="absolute top-4 right-4 p-2 bg-white/5 rounded-lg hover:bg-white/10">
                               <Copy className="w-4 h-4" />
                            </button>
                            <pre className="whitespace-pre-wrap">{stagedComponent.code}</pre>
                         </div>
                       ) : (
                         <div className="p-10 flex flex-col items-center justify-center h-full">
                            <div className="w-full max-w-md p-8 bg-surface border border-white/10 rounded-3xl shadow-2xl relative">
                               <div className="w-12 h-12 bg-primary/20 rounded-xl mb-6 flex items-center justify-center text-primary">
                                  <Layers className="w-6 h-6" />
                               </div>
                               <h3 className="text-lg font-black text-white italic mb-2">{stagedComponent.name}</h3>
                               <p className="text-xs text-slate-500 mb-6">{stagedComponent.description}</p>
                               <div className="h-20 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center">
                                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] animate-pulse">Komponent Hazır</span>
                               </div>
                            </div>
                         </div>
                       )}
                    </div>

                    <div className="p-6 bg-black/40 border-t border-white/5">
                       <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                             <CheckCircle2 className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                             <p className="text-white font-bold text-sm mb-1 italic">Analiz Özeti</p>
                             <p className="text-xs text-slate-400 leading-relaxed font-bold uppercase tracking-tighter opacity-80">
                               {stagedComponent.description}
                             </p>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                     <button
                       onClick={handleMerge}
                       disabled={isMerging || mergeSuccess}
                       className="flex-1 py-5 bg-green-600 hover:bg-green-500 disabled:bg-slate-800 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl shadow-green-900/20 flex items-center justify-center gap-3 active:scale-95"
                     >
                        {isMerging ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <CheckCircle2 className="w-5 h-5" />}
                        {mergeSuccess ? 'MODÜL PORTALA EKLENDİ' : 'ENTEGRE ET VE AKTİF ET'}
                     </button>
                     <button
                       onClick={() => setStagedComponent(null)}
                       className="px-8 py-5 bg-white/5 hover:bg-red-500/10 hover:text-red-500 text-slate-500 font-bold uppercase tracking-widest rounded-3xl transition-all border border-white/10"
                     >
                        İPTAL
                     </button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[500px] border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center text-slate-800 p-12 text-center group">
                   <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary/5 transition-colors">
                      <Code className="w-10 h-10 group-hover:text-primary transition-colors" />
                   </div>
                   <h4 className="text-xl font-black uppercase tracking-tighter mb-2 italic">Önizleme ve İnşa Alanı</h4>
                   <p className="text-xs font-bold uppercase tracking-widest opacity-30 max-w-xs">Sol taraftan bir özellik talep ettiğinizde, gerçek AI motoru kodu üretecek ve burada simüle edecektir.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveEditorView;
