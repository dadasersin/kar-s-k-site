import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Code, Play, CheckCircle2, Layout, Layers, Cpu, Terminal } from 'lucide-react';

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

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    setStagedComponent(null);
    setMergeSuccess(false);
    setLogs([]);

    addLog("İstek analiz ediliyor...");

    setTimeout(() => {
      addLog("Şema tasarımı oluşturuluyor...");
      setTimeout(() => {
        addLog("Kod enjeksiyonu ve optimizasyon tamamlandı.");
        setStagedComponent({
          id: 'comp_' + Date.now(),
          name: 'Akıllı Veri Görselleştirici v2',
          description: 'İsteğinize uygun, gerçek zamanlı veri akışını destekleyen ve responsive tasarım ilkelerine bağlı kalarak oluşturulmuş yeni bir modül.',
          type: 'widget',
          code: 'export const DataWidget = () => { ... }'
        });
        setIsProcessing(false);
      }, 1500);
    }, 1000);
  };

  const handleMerge = () => {
    setIsMerging(true);
    addLog("Site mimarisi ile senkronizasyon başlatıldı...");

    setTimeout(() => {
      addLog("Yeni modül ana navigasyona eklendi.");
      addLog("State yönetimi güncellendi.");
      setTimeout(() => {
        setIsMerging(false);
        setMergeSuccess(true);
        addLog("TEBRİKLER: Yeni özellik başarıyla siteye entegre edildi!");
      }, 1500);
    }, 1000);
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
                <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Canlı Önizleme ve Otonom Entegrasyon</p>
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
                  className="w-full bg-black/40 border border-white/10 rounded-3xl p-6 text-sm text-white focus:border-primary outline-none transition-all min-h-[150px] resize-none placeholder:text-gray-700"
                />
                <button
                  onClick={handleGenerate}
                  disabled={isProcessing || !prompt.trim()}
                  className="w-full py-4 bg-primary hover:brightness-110 disabled:bg-slate-800 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                >
                  {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Play className="w-4 h-4" />}
                  ÖZELLİĞİ TASARLA
                </button>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-black/40 shadow-xl overflow-hidden min-h-[250px] flex flex-col">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Terminal className="w-3 h-3" />
                Sistem Logları
              </h3>
              <div className="flex-1 space-y-2 font-mono text-[10px] overflow-y-auto scrollbar-hide">
                {logs.length === 0 && <p className="text-slate-800 italic uppercase font-bold tracking-tighter">İşlem bekleniyor...</p>}
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-3 text-primary animate-in slide-in-from-left-2">
                    <span className="opacity-40">→</span>
                    <span className="font-bold">{log}</span>
                  </div>
                ))}
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
                       <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                          <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                       </div>
                    </div>

                    <div className="p-10 min-h-[300px] flex flex-col items-center justify-center bg-brandDark/50">
                       <div className="w-full max-w-md p-8 bg-surface border border-white/10 rounded-3xl shadow-2xl animate-pulse">
                          <div className="w-12 h-12 bg-primary/20 rounded-xl mb-6 flex items-center justify-center text-primary">
                             <Layers className="w-6 h-6" />
                          </div>
                          <div className="h-4 bg-white/5 rounded-full w-3/4 mb-4"></div>
                          <div className="h-2 bg-white/5 rounded-full w-full mb-2"></div>
                          <div className="h-2 bg-white/5 rounded-full w-5/6 mb-8"></div>
                          <div className="h-10 bg-primary/10 rounded-xl w-full border border-primary/20"></div>
                       </div>
                       <p className="mt-8 text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] animate-pulse">Yeni Modül Render Ediliyor...</p>
                    </div>

                    <div className="p-6 bg-black/40 border-t border-white/5">
                       <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                             <CheckCircle2 className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                             <p className="text-white font-bold text-sm mb-1 italic">Nasıl Çalışır?</p>
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
                        {mergeSuccess ? 'ENTEGRE EDİLDİ' : 'ONAYLA VE SİTEYE EKLE'}
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
                   <h4 className="text-xl font-black uppercase tracking-tighter mb-2 italic">Önizleme Alanı</h4>
                   <p className="text-xs font-bold uppercase tracking-widest opacity-30 max-w-xs">Sol taraftan bir istek gönderdiğinizde, yapay zeka tarafından tasarlanan özellik burada görünecektir.</p>
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
