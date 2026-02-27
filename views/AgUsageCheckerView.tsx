import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, RefreshCw, BarChart3, AlertCircle, Terminal, Layers, Search, History, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

const AgUsageCheckerView: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [activeModel, setActiveModel] = useState('Gemini 1.5 Pro');

  const models = [
    { name: 'Gemini 1.5 Pro', used: 450, total: 1000, color: 'cyan' },
    { name: 'Claude 3.5 Sonnet', used: 120, total: 500, color: 'indigo' },
    { name: 'GPT-4o', used: 12, total: 200, color: 'blue' },
  ];

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark text-slate-200">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] border border-white/20">
                  <Gauge className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">AG Kullanım Denetleyicisi</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Gelişmiş Model Kotası ve İşlem Takibi</p>
          </div>

          <button
            onClick={handleScan}
            disabled={isScanning}
            className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl shadow-cyan-600/20"
          >
            {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {isScanning ? 'SİSTEM TARANIYOR...' : 'TÜM MODELLERİ TARA'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
             <div className="glass-panel rounded-[40px] p-8 lg:p-10 border border-white/5 bg-white/5 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                      <BarChart3 className="w-6 h-6 text-cyan-500" /> Model Bazlı Dağılım
                   </h3>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Otomatik Tespit</p>
                      <p className="text-xs font-black text-emerald-500 uppercase italic">AKTİF</p>
                   </div>
                </div>

                <div className="space-y-8">
                   {models.map(m => (
                     <div key={m.name} className="space-y-3">
                        <div className="flex justify-between items-end">
                           <span className="text-xs font-bold text-white uppercase">{m.name}</span>
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.used} / {m.total} İstek</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                           <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(m.used/m.total)*100}%` }}
                              className={`h-full bg-${m.color}-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.3)]`}
                           ></motion.div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4 group hover:border-cyan-500/50 transition-all">
                   <div className="flex items-center gap-3">
                      <History className="w-5 h-5 text-cyan-500" />
                      <h4 className="text-white font-black text-sm uppercase italic">İşlem Geçmişi</h4>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-slate-500 border-b border-white/5 pb-2">
                         <span>Saat: 14:45</span>
                         <span className="text-cyan-400">Gemini 1.5 Pro</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-slate-500 border-b border-white/5 pb-2">
                         <span>Saat: 14:32</span>
                         <span className="text-indigo-400">Claude 3.5</span>
                      </div>
                   </div>
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col justify-center items-center text-center space-y-4">
                   <div className="w-14 h-14 rounded-full border-2 border-emerald-500/30 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-emerald-500" />
                   </div>
                   <div>
                      <h5 className="text-white font-black text-sm uppercase italic">Kota Güvenliği</h5>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Hata Payı: %0.01</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
             <div className="bg-gradient-to-br from-cyan-600/20 to-brandDark border border-cyan-600/20 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic border-b border-white/5 pb-2">CLI İzleyici</h3>
                <div className="bg-black/60 rounded-2xl p-4 border border-white/5 font-mono text-[9px] text-cyan-500 space-y-1">
                   <p>$ ag-check --all</p>
                   <p className="text-slate-500">Checking local language server...</p>
                   <p className="text-slate-500">Found port: 42001</p>
                   <p className="text-emerald-500">✔ Data synced</p>
                </div>
                <div className="mt-8 p-6 bg-cyan-500/5 rounded-3xl border border-cyan-500/20">
                   <div className="flex items-center gap-3 mb-2">
                      <AlertCircle className="w-4 h-4 text-cyan-500" />
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Uyarı</p>
                   </div>
                   <p className="text-[11px] text-slate-500 italic leading-relaxed">"Bazı modellerin kotası %20'nin altına düştüğünde sistem sizi otomatik olarak uyarır."</p>
                </div>
             </div>

             <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/5">
                <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 flex items-center justify-center gap-2">
                   <Zap className="w-4 h-4 text-cyan-500" /> ŞİMDİ YENİLE
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgUsageCheckerView;
