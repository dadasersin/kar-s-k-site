import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Cpu, Terminal, RefreshCw, AlertTriangle, ShieldCheck, Power, Settings, HardDrive, List, Play, Trash2, CheckCircle2 } from 'lucide-react';

const AntigravityLauncherView: React.FC = () => {
  const [isCleaning, setIsCleaning] = useState(false);
  const [processes, setProcesses] = useState([
    { pid: 14502, name: 'Antigravity Core', memory: '1.2 GB', status: 'Running' },
    { pid: 14588, name: 'Language Server', memory: '450 MB', status: 'Running' },
    { pid: 15612, name: 'Cloud Code Bridge', memory: '89 MB', status: 'Running' },
    { pid: 9921, name: 'Zombie Helper', memory: '512 MB', status: 'Zombie' },
  ]);

  const handleCleanMemory = () => {
    setIsCleaning(true);
    setTimeout(() => {
      setProcesses(prev => prev.filter(p => p.status !== 'Zombie'));
      setIsCleaning(false);
    }, 2000);
  };

  const killAll = () => {
    setIsCleaning(true);
    setTimeout(() => {
      setProcesses([]);
      setIsCleaning(false);
    }, 1500);
  };

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark text-slate-200">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)] border border-white/20">
                  <Power className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">AG Başlatıcı & Sabitleyici</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Bellek Sızıntısı ve Süreç Yönetim Aracı</p>
          </div>

          <div className="flex gap-4">
             <button
               onClick={killAll}
               className="px-6 py-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-red-600/30 flex items-center gap-2"
             >
                <Trash2 className="w-4 h-4" /> TÜMÜNÜ SONLANDIR
             </button>
             <button
               onClick={() => window.location.reload()}
               className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-600/20 flex items-center gap-3"
             >
                <Play className="w-4 h-4" /> TEMİZ BAŞLATMA
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
             <div className="glass-panel rounded-[40px] p-8 lg:p-10 border border-white/5 bg-white/5 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                      <List className="w-6 h-6 text-orange-500" /> Aktif Süreçler
                   </h3>
                   <div className="flex items-center gap-4">
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sistem Yükü</p>
                         <p className="text-sm font-black text-white italic tracking-widest">%12.4</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-3">
                   {processes.map(p => (
                     <div key={p.pid} className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-orange-500/30 transition-all">
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.status === 'Zombie' ? 'bg-red-500/10 text-red-500' : 'bg-orange-600/10 text-orange-500'}`}>
                              <Cpu className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="text-xs font-bold text-white uppercase">{p.name}</p>
                              <p className="text-[9px] text-slate-500 font-mono tracking-widest">PID: {p.pid}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-8">
                           <div className="text-right">
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Bellek</p>
                              <p className="text-xs font-bold text-slate-300 italic">{p.memory}</p>
                           </div>
                           <span className={`text-[9px] font-black uppercase px-2 py-1 rounded ${p.status === 'Zombie' ? 'bg-red-600/20 text-red-500' : 'bg-emerald-600/20 text-emerald-500'}`}>{p.status}</span>
                        </div>
                     </div>
                   ))}
                   {processes.length === 0 && <p className="text-center py-10 text-slate-600 uppercase font-black tracking-widest">HİÇBİR SÜREÇ BULUNAMADI</p>}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center gap-6 group hover:border-orange-500/50 transition-all cursor-pointer" onClick={handleCleanMemory}>
                   <div className="w-14 h-14 rounded-2xl bg-orange-600/20 flex items-center justify-center shrink-0">
                      {isCleaning ? <RefreshCw className="w-6 h-6 text-orange-500 animate-spin" /> : <HardDrive className="w-6 h-6 text-orange-500" />}
                   </div>
                   <div>
                      <h5 className="text-white font-black text-sm uppercase italic">WSL Bellek Fix</h5>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Sınırsız bellek kullanımını durdur</p>
                   </div>
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center gap-6 group hover:border-blue-500/50 transition-all">
                   <div className="w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6 text-blue-500" />
                   </div>
                   <div>
                      <h5 className="text-white font-black text-sm uppercase italic">Hata Denetimi</h5>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Zombi süreçleri otomatik temizle</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
             <div className="bg-gradient-to-br from-red-600/20 to-brandDark border border-red-600/20 rounded-[40px] p-8 shadow-2xl text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-6 animate-pulse" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Bellek Sızıntısı Tespiti</h3>
                <p className="text-[11px] text-slate-400 italic leading-relaxed mb-8">
                  "Google Antigravity IDE Windows 10/11 sistemlerinde bazen WSL üzerinden aşırı bellek tüketebilir. Bu araç bu sorunları gidermek için tasarlanmıştır."
                </p>
                <div className="p-4 bg-black rounded-xl border border-white/10 text-[10px] font-mono text-red-400 space-y-1">
                   <p>&gt; Checking for zombies...</p>
                   <p>&gt; Detected leak in WSL2 core</p>
                   <p>&gt; Optimization READY</p>
                </div>
             </div>

             <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/5 flex flex-col gap-3">
                <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5">WSL AYARLARINI AÇ</button>
                <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5">LOG DOSYALARINI GÖSTER</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AntigravityLauncherView;
