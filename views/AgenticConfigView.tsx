import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Workflow, GitPullRequest, Code2, Play, Terminal, ShieldCheck, RefreshCw, Layers, CheckCircle2, Box } from 'lucide-react';

const AgenticConfigView: React.FC = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const stages = [
    { name: 'Planlama', icon: <Layers className="w-4 h-4" /> },
    { name: 'Tasarım', icon: <Box className="w-4 h-4" /> },
    { name: 'Kodlama', icon: <Code2 className="w-4 h-4" /> },
    { name: 'Test', icon: <ShieldCheck className="w-4 h-4" /> },
    { name: 'Dağıtım', icon: <Zap className="w-4 h-4" /> },
  ];

  const handleFullLifeCycle = () => {
    setIsExecuting(true);
    let stage = 0;
    const interval = setInterval(() => {
      setActiveStage(stage);
      stage++;
      if (stage >= stages.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsExecuting(false);
          setActiveStage(null);
        }, 2000);
      }
    }, 1500);
  };

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark text-slate-200">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.4)] border border-white/20">
                  <Workflow className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Ajanik İş Akışları</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Kompozisyonel YZ Geliştirme Sistemleri</p>
          </div>

          <button
            onClick={handleFullLifeCycle}
            disabled={isExecuting}
            className="px-8 py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl shadow-orange-600/20"
          >
            {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <GitPullRequest className="w-4 h-4" />}
            {isExecuting ? 'İŞLENİYOR...' : 'TAM YAŞAM DÖNGÜSÜ PR BAŞLAT'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="glass-panel rounded-[40px] p-8 lg:p-10 border border-white/5 bg-white/5 shadow-2xl">
               <h3 className="text-xl font-black text-white uppercase italic mb-10 flex items-center gap-3">
                  <Play className="w-6 h-6 text-orange-500" /> Orkestrasyon Durumu
               </h3>

               <div className="relative">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2"></div>
                  <div className="flex justify-between relative z-10">
                     {stages.map((stage, i) => (
                       <div key={i} className="flex flex-col items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${activeStage === i ? 'bg-orange-600 border-orange-400 shadow-lg shadow-orange-600/40 scale-110' : activeStage !== null && activeStage > i ? 'bg-emerald-600 border-emerald-400' : 'bg-black border-white/10'}`}>
                             {activeStage !== null && activeStage > i ? <CheckCircle2 className="w-6 h-6 text-white" /> : React.cloneElement(stage.icon as React.ReactElement, { className: `w-6 h-6 ${activeStage === i ? 'text-white' : 'text-slate-500'}` })}
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${activeStage === i ? 'text-orange-500' : 'text-slate-600'}`}>{stage.name}</span>
                       </div>
                     ))}
                  </div>
               </div>

               {isExecuting && (
                 <div className="mt-16 p-8 bg-black rounded-3xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                       <Terminal className="w-4 h-4 text-orange-500" />
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ajan Logları</span>
                    </div>
                    <div className="font-mono text-xs text-orange-400 space-y-1">
                       <p>&gt; Task: "Add OAuth2 support to backend"</p>
                       <p>&gt; Analyzing dependencies... DONE</p>
                       <p>&gt; Generating phased implementation plan...</p>
                       <p className="animate-pulse">&gt; Executing Stage: {stages[activeStage || 0].name}...</p>
                    </div>
                 </div>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] group hover:border-orange-500/50 transition-all cursor-pointer">
                  <h4 className="text-white font-black text-sm uppercase italic mb-2">/spec Komutu</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Tek bir aşamayı belirli bir yol üzerinde çalıştırır.</p>
               </div>
               <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] group hover:border-orange-500/50 transition-all cursor-pointer">
                  <h4 className="text-white font-black text-sm uppercase italic mb-2">/o_spec Komutu</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Tam 8 aşamalı uçtan uca iş akışını tetikler.</p>
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
             <div className="bg-gradient-to-br from-orange-600/20 to-brandDark border border-orange-600/20 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic border-b border-white/5 pb-2">Sistem Ayarları</h3>
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ajan Modu</span>
                      <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-1 rounded">OTONOM</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Paralelleştirme</span>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded">AKTİF</span>
                   </div>
                </div>
             </div>

             <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/5">
                <p className="text-[11px] text-slate-500 italic leading-relaxed">
                  "Agentic-config, projeden bağımsız ve birleştirilebilir komutlarla karmaşık geliştirme görevlerini otomatikleştirir."
                </p>
                <button className="w-full mt-6 py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5">DOKÜMANTASYONU AÇ</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgenticConfigView;
