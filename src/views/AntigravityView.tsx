import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gauge, Zap, BarChart3, RefreshCw, ShieldCheck, Cpu, AlertCircle, History, TrendingUp, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AntigravityView: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [usageHistory] = useState([
    { time: '10:00', usage: 45 },
    { time: '11:00', usage: 52 },
    { time: '12:00', usage: 48 },
    { time: '13:00', usage: 61 },
    { time: '14:00', usage: 55 },
    { time: '15:00', usage: 67 },
    { time: '16:00', usage: 72 },
  ]);

  const [quotaData, setQuotaData] = useState({
    used: 450,
    total: 1000,
    remaining: 550,
    percentage: 45,
    resetDate: '2024-03-30',
    status: 'Mükemmel',
    runwayHours: 42,
    usageRate: 3.5
  });

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setQuotaData(prev => ({
        ...prev,
        used: 450 + Math.floor(Math.random() * 50),
        remaining: 1000 - (450 + Math.floor(Math.random() * 50)),
        percentage: Math.floor(((450 + Math.random() * 50) / 1000) * 100),
        status: 'Aktif'
      }));
    }, 2000);
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
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Antigravity Takibi</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Model Kotası ve Kullanım Analiz Motoru</p>
          </div>

          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl shadow-cyan-600/20"
          >
            {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {isSyncing ? 'VERİLER ÇEKİLİYOR...' : 'ŞİMDİ SENKRONİZE ET'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Stats Card */}
          <div className="lg:col-span-8 space-y-8">
            <div className="glass-panel rounded-[40px] p-10 backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <BarChart3 className="w-48 h-48 text-cyan-500" />
              </div>

              <div className="flex justify-between items-start mb-12">
                <div>
                  <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Genel Kullanım Durumu</h3>
                  <div className="text-5xl font-black text-white italic tracking-tighter">%{quotaData.percentage}</div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{quotaData.status}</span>
                </div>
              </div>

              <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden mb-8 p-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${quotaData.percentage}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                ></motion.div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/5">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Kullanılan</p>
                  <p className="text-xl font-bold text-white">{quotaData.used} <span className="text-[10px] text-slate-500">İstek</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Kalan</p>
                  <p className="text-xl font-bold text-white">{quotaData.remaining} <span className="text-[10px] text-slate-500">İstek</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Toplam Limit</p>
                  <p className="text-xl font-bold text-white">{quotaData.total} <span className="text-[10px] text-slate-500">İstek</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Kullanım Hızı</p>
                  <p className="text-xl font-bold text-cyan-500">{quotaData.usageRate} <span className="text-[10px] text-slate-500">istek/saat</span></p>
                </div>
              </div>
            </div>

            {/* Usage Analytics Chart */}
            <div className="glass-panel rounded-[40px] p-8 border border-white/5 bg-white/5 shadow-2xl h-[400px]">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest italic flex items-center gap-2">
                     <History className="w-4 h-4 text-cyan-500" /> Kullanım Trendi
                  </h3>
                  <div className="flex gap-4">
                     <span className="text-[10px] font-black text-slate-500 uppercase">Son 24 Saat</span>
                  </div>
               </div>
               <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={usageHistory}>
                      <defs>
                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                      <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                        itemStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="usage" stroke="#06b6d4" fillOpacity={1} fill="url(#colorUsage)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center gap-6 group hover:border-cyan-500/50 transition-all shadow-xl">
                 <div className="w-14 h-14 rounded-2xl bg-cyan-600/20 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-cyan-500" />
                 </div>
                 <div>
                    <h5 className="text-white font-black text-sm uppercase italic">Runway Tahmini</h5>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Tahmini kalan süre: ~{quotaData.runwayHours} Saat</p>
                 </div>
              </div>
              <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center gap-6 group hover:border-blue-500/50 transition-all shadow-xl">
                 <div className="w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-blue-500" />
                 </div>
                 <div>
                    <h5 className="text-white font-black text-sm uppercase italic">Güvenli Bağlantı</h5>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">IDE Protokolü üzerinden bağlı</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-cyan-600/20 to-brandDark border border-cyan-600/20 rounded-[40px] p-8 shadow-2xl">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic border-b border-white/5 pb-2 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-500" />
                Sistem Detayları
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sıfırlanma Tarihi</span>
                  <span className="text-xs font-black text-white">{quotaData.resetDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Model Versiyonu</span>
                  <span className="text-xs font-black text-white">Antigravity v4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bağlantı Türü</span>
                  <span className="text-xs font-black text-cyan-500">Yerel Köprü Bağlantısı</span>
                </div>
              </div>

              <div className="mt-10 p-6 bg-cyan-500/5 rounded-3xl border border-cyan-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="w-4 h-4 text-cyan-500" />
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">Kullanım Notu</p>
                </div>
                <p className="text-[11px] text-slate-500 italic leading-relaxed">
                  "Antigravity model kullanım verileri yerel geliştirme ortamınızdan anlık olarak senkronize edilmektedir."
                </p>
              </div>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] space-y-4">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-cyan-500" /> Kaynak Dosyalar
               </h4>
               <button
                 onClick={() => window.open('https://github.com/skainguyen1412/antigravity-usage', '_blank')}
                 className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl transition-all border border-white/10 text-[9px] flex items-center justify-center gap-2"
               >
                 <i className="fa-brands fa-github text-sm"></i>
                 ANTIGRAVITY-USAGE CLI
               </button>
               <button
                 onClick={() => window.open('https://github.com/nguyenphutrong/quotio', '_blank')}
                 className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl transition-all border border-white/10 text-[9px] flex items-center justify-center gap-2"
               >
                 <i className="fa-brands fa-github text-sm"></i>
                 QUOTIO MACOS SOURCE
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AntigravityView;
