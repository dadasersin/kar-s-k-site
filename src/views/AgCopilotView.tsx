import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Code, Cpu, RefreshCw, CheckCircle2, ShieldCheck, Zap, Layers, Sparkles, Terminal, MessageSquare, Bot } from 'lucide-react';

const AgCopilotView: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeCopilot, setActiveCopilot] = useState(true);

  const features = [
    { name: 'Kod Tamamlama', status: 'Aktif', icon: <Code className="w-4 h-4" /> },
    { name: 'Birim Test Üretimi', status: 'Aktif', icon: <ShieldCheck className="w-4 h-4" /> },
    { name: 'Refaktör Önerileri', status: 'Beklemede', icon: <Layers className="w-4 h-4" /> },
    { name: 'Dökümantasyon Yardımı', status: 'Aktif', icon: <Terminal className="w-4 h-4" /> },
  ];

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark text-slate-200">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-slate-900 flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.4)] border border-white/20">
                  <Bot className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Ag-Copilot Entegrasyonu</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Antigravity & GitHub Copilot Hibrit Motoru</p>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Copilot Servisi</span>
                <button
                  onClick={() => setActiveCopilot(!activeCopilot)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${activeCopilot ? 'bg-indigo-600' : 'bg-slate-800'}`}
                >
                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${activeCopilot ? 'left-7' : 'left-1'}`}></div>
                </button>
             </div>
             <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/10 flex items-center gap-3">
                <Github className="w-4 h-4" /> AUTH GITHUB
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
             <div className="glass-panel rounded-[40px] p-8 lg:p-10 border border-white/5 bg-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                   <Zap className="w-48 h-48 text-indigo-500" />
                </div>

                <div className="flex justify-between items-center mb-12">
                   <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-indigo-500" /> Hibrit Zeka Modülü
                   </h3>
                   <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                      <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">ÇAPRAZ SORGULAMA AKTİF</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {features.map(f => (
                     <div key={f.name} className="p-6 bg-black/40 border border-white/5 rounded-3xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                              {f.icon}
                           </div>
                           <div>
                              <p className="text-xs font-bold text-white">{f.name}</p>
                              <p className={`text-[9px] font-black uppercase tracking-widest ${f.status === 'Aktif' ? 'text-emerald-500' : 'text-slate-600'}`}>{f.status}</p>
                           </div>
                        </div>
                        {f.status === 'Aktif' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                     </div>
                   ))}
                </div>

                <div className="mt-12 p-8 bg-indigo-600/5 border border-indigo-500/20 rounded-[2.5rem]">
                   <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Kod Örneği (Hibrit Çıktı)</h4>
                   <pre className="font-mono text-xs text-slate-400 leading-relaxed overflow-x-auto custom-scrollbar-hidden">
{`// Antigravity bağlamı + Copilot mantığı
async function optimizedFetch(url: string) {
  const cache = await getLocalCache(); // Antigravity Suggestion
  if (cache.has(url)) return cache.get(url);

  return fetch(url).then(r => r.json()); // Copilot completion
}`}
                   </pre>
                </div>
             </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
             <div className="bg-gradient-to-br from-indigo-600/20 to-brandDark border border-indigo-600/20 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic border-b border-white/5 pb-2">İstatistikler</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Kabul Oranı</span>
                      <span className="text-xs font-black text-white italic">%78.2</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tasarruf Edilen Süre</span>
                      <span className="text-xs font-black text-indigo-500 italic">12.5 Saat</span>
                   </div>
                </div>
             </div>

             <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/5 space-y-4">
                <div className="flex items-center gap-3">
                   <MessageSquare className="w-5 h-5 text-indigo-500" />
                   <p className="text-[10px] font-black text-white uppercase tracking-widest">Nasıl Çalışır?</p>
                </div>
                <p className="text-[11px] text-slate-500 italic leading-relaxed">
                  "Ag-copilot, Antigravity'nin derin proje bağlamı ile GitHub Copilot'un devasa kod bilgisini birleştirerek size en doğru önerileri sunar."
                </p>
                <button className="w-full py-4 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">GELİŞMİŞ AYARLAR</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgCopilotView;
