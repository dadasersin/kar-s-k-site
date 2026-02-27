import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderSync, Cloud, HardDrive, RefreshCw, Settings, FileBox, CheckCircle2, ShieldCheck, Database, Calendar, Clock, Trash2, Search } from 'lucide-react';

const AntigravitySyncView: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('14:45');
  const [progress, setProgress] = useState(0);

  const startSync = () => {
    setIsSyncing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          setLastSync(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark text-slate-200">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)] border border-white/20">
                  <FolderSync className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Antigravity Senkronizasyon</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Yerel Projeleri Google Drive ile Yedekleyin</p>
          </div>

          <button
            onClick={startSync}
            disabled={isSyncing}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl shadow-blue-600/20"
          >
            {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
            {isSyncing ? 'SENKRONİZE EDİLİYOR...' : 'ŞİMDİ YEDEKLE'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
             <div className="glass-panel rounded-[40px] p-10 border border-white/5 bg-white/5 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-12">
                   <div>
                      <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Yedekleme Durumu</h3>
                      <div className="text-4xl font-black text-white italic tracking-tighter">{isSyncing ? `%${progress}` : 'GÜNCEL'}</div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Son Senkronizasyon</p>
                      <p className="text-xl font-bold text-white uppercase italic">{lastSync}</p>
                   </div>
                </div>

                {isSyncing && (
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-8">
                     <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                     ></motion.div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-white/5">
                   <div className="p-6 bg-black/40 border border-white/5 rounded-2xl text-center space-y-2">
                      <FileBox className="w-6 h-6 text-blue-400 mx-auto" />
                      <p className="text-xs font-bold text-white uppercase">45.2 GB</p>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">TOPLAM VERİ</p>
                   </div>
                   <div className="p-6 bg-black/40 border border-white/5 rounded-2xl text-center space-y-2">
                      <Database className="w-6 h-6 text-cyan-400 mx-auto" />
                      <p className="text-xs font-bold text-white uppercase">12 Proje</p>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">BAĞLI DİZİN</p>
                   </div>
                   <div className="p-6 bg-black/40 border border-white/5 rounded-2xl text-center space-y-2">
                      <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto" />
                      <p className="text-xs font-bold text-white uppercase">Şifreli</p>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">GÜVENLİK</p>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4">
                   <h4 className="text-white font-black text-sm uppercase italic flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-500" /> Planlı Yedeklemeler
                   </h4>
                   <div className="space-y-3">
                      {['09:00', '14:00', '18:00'].map(t => (
                        <div key={t} className="flex justify-between items-center p-3 bg-black/40 border border-white/5 rounded-xl">
                           <span className="text-xs font-bold text-slate-300">{t}</span>
                           <span className="text-[9px] font-black text-emerald-500 uppercase">AKTİF</span>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4">
                   <h4 className="text-white font-black text-sm uppercase italic flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-500" /> Saklama Politikası
                   </h4>
                   <p className="text-[11px] text-slate-500 leading-relaxed italic">
                     "Sistem sadece en güncel 7 yedeği saklar, eski yedekler otomatik olarak silinerek alan tasarrufu sağlanır."
                   </p>
                </div>
             </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
             <div className="bg-gradient-to-br from-blue-600/20 to-brandDark border border-blue-600/20 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic border-b border-white/5 pb-2">Yapılandırma</h3>
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Yedekleme Dizini</label>
                      <div className="p-3 bg-black/40 border border-white/10 rounded-xl text-[10px] font-mono text-blue-400 truncate">G:\My Drive\AntigravitySync</div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Yoksayılan Kalıplar</label>
                      <div className="p-3 bg-black/40 border border-white/10 rounded-xl text-[10px] font-mono text-slate-500 italic">node_modules, .git, __pycache__</div>
                   </div>
                </div>
                <button className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-white/10 flex items-center justify-center gap-2">
                   <Settings className="w-4 h-4" /> AYARLARI DÜZENLE
                </button>
             </div>

             <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                   <Trash2 className="w-5 h-5 text-red-500" />
                   <p className="text-[10px] font-black text-white uppercase tracking-widest">Eski Yedekler</p>
                </div>
                <p className="text-[11px] text-slate-500 italic">"Gereksiz yedekleri manuel olarak temizleyerek Drive alanınızı boşaltın."</p>
                <button className="w-full py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white text-[9px] font-black uppercase rounded-xl transition-all border border-red-600/20">TEMİZLEME SİHİRBAZI</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AntigravitySyncView;
