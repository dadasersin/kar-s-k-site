import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LiveEditorView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewComponent, setPreviewComponent] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setLogs([]);
    addLog("Nöral Geliştirici başlatıldı...");
    await new Promise(r => setTimeout(r, 800));
    addLog("Portal mimarisi analiz ediliyor...");
    await new Promise(r => setTimeout(r, 1000));
    addLog("Bileşen kodu üretiliyor...");
    await new Promise(r => setTimeout(r, 1500));
    addLog("Önizleme hazırlanıyor...");
    await new Promise(r => setTimeout(r, 500));

    setPreviewComponent(prompt);
    setIsGenerating(false);
    addLog("✅ Değişiklik hazır. Onayınız bekleniyor.");
  };

  const handleMerge = () => {
    addLog("🚀 Değişiklikler ana sisteme entegre ediliyor...");
    setTimeout(() => {
      alert("Tebrikler! Yeni bileşen portalın dinamik modül havuzuna başarıyla eklendi.");
      setPreviewComponent(null);
      setPrompt('');
      addLog("✨ İşlem tamamlandı.");
    }, 2000);
  };

  return (
    <div className="flex-1 p-4 lg:p-8 flex flex-col gap-6 bg-brandDark overflow-hidden pb-32">
      <header className="space-y-1 shrink-0">
        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
          <i className="fa-solid fa-code-branch text-primary animate-pulse"></i>
          Live AI Developer
        </h2>
        <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase">Portal Üzerinde Gerçek Zamanlı AI Modifikasyonu</p>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Input & Control Panel */}
        <div className="w-full lg:w-96 flex flex-col gap-4 shrink-0">
          <div className="glass-panel p-6 rounded-[2.5rem] border border-white/5 bg-surface/30 flex flex-col gap-4">
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Geliştirme Talimatı</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Sitede ne değiştirmek istersiniz? (Örn: 'Koyu modda yeni bir grafik paneli ekle')"
              className="w-full h-40 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-primary outline-none resize-none transition-all"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all disabled:opacity-50"
            >
              {isGenerating ? <i className="fa-solid fa-spinner animate-spin"></i> : 'KODU ÜRET VE ÖNİZLE'}
            </button>
          </div>

          <div className="flex-1 glass-panel p-4 rounded-[2rem] border border-white/5 bg-black/40 overflow-hidden flex flex-col">
             <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Terminal</h3>
             <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-2 scrollbar-hide">
                {logs.map((log, i) => (
                  <p key={i} className={log.includes('✅') ? 'text-green-400' : log.includes('🚀') ? 'text-primary' : 'text-slate-400'}>{log}</p>
                ))}
             </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 glass-panel rounded-[3rem] border border-white/5 bg-slate-900/20 overflow-hidden relative flex flex-col">
          <div className="h-12 border-b border-white/5 flex items-center px-8 gap-4 bg-black/20 shrink-0">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
            </div>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-4">Canlı Önizleme (Sandboxed)</span>
          </div>

          <div className="flex-1 p-8 overflow-y-auto relative">
             <AnimatePresence>
               {previewComponent ? (
                 <motion.div
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="h-full flex flex-col items-center justify-center text-center space-y-8"
                 >
                    <div className="p-10 bg-primary/10 border border-primary/20 rounded-[3rem] shadow-2xl">
                       <i className="fa-solid fa-wand-magic-sparkles text-5xl text-primary mb-6"></i>
                       <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">{previewComponent}</h4>
                       <p className="text-slate-400 text-sm max-w-sm mx-auto">AI bu değişikliği portal mimarisine uygun olarak tasarladı. Onayladığınız takdirde sisteme eklenecektir.</p>
                    </div>

                    <div className="flex gap-4">
                       <button onClick={() => setPreviewComponent(null)} className="px-8 py-3 bg-white/5 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-white transition-all">İPTAL</button>
                       <button onClick={handleMerge} className="px-8 py-3 bg-green-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-500/20 hover:brightness-110 transition-all">DEĞİŞİKLİĞİ ONAYLA VE EKLE</button>
                    </div>
                 </motion.div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale">
                    <i className="fa-solid fa-terminal text-8xl mb-6"></i>
                    <p className="font-black uppercase tracking-[0.5em]">Giriş Bekleniyor</p>
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
