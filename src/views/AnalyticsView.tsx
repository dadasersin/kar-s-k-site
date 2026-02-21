import React, { useState, useEffect } from 'react';
import { getAllKeys } from '../utils/apiPool';
import type { ApiKeyEntry } from '../types';

const AnalyticsView: React.FC = () => {
  const [keys, setKeys] = useState<ApiKeyEntry[]>([]);

  useEffect(() => {
    setKeys(getAllKeys());
  }, []);

  const totalUsage = keys.reduce((acc, k) => acc + (k.usageCount || 0), 0);

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
        <header>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
            <i className="fa-solid fa-chart-line text-primary"></i>
            Analitik & Maliyet
          </h1>
          <p className="text-slate-500 text-sm mt-1 uppercase font-bold tracking-widest">API Kullanım ve Performans Metrikleri</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Toplam İstek" value={totalUsage.toLocaleString()} sub="Tüm Zamanlar" trend="+100%" />
          <StatCard label="Aktif API Sayısı" value={keys.length.toString()} sub="Yapılandırılmış" trend="Stabil" />
          <StatCard label="Ort. Yanıt Hızı" value="1.2s" sub="Global ortalama" trend="-150ms" />
          <StatCard label="Sistem Sağlığı" value="A+" sub="Tüm düğümler" trend="Stabil" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel p-8 rounded-[40px] shadow-2xl">
              <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3 italic">
                <i className="fa-solid fa-key text-primary"></i>
                API Anahtarı Kullanımı
              </h3>
              <div className="space-y-4">
                {keys.length > 0 ? (
                  keys.map((key) => (
                    <div key={key.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between group hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${key.id.startsWith('VITE_') ? 'bg-primary/20 text-primary' : 'bg-purple-500/20 text-purple-500'}`}>
                          <i className={`fa-solid ${key.id.startsWith('VITE_') ? 'fa-server' : 'fa-user-gear'}`}></i>
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm uppercase italic">{key.label}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{key.provider} • {key.modelName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-white italic tracking-tighter">{key.usageCount || 0}</p>
                        <p className="text-[9px] text-slate-500 uppercase font-black">İstek</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-8 font-bold uppercase italic tracking-widest">Hiç API anahtarı bulunamadı.</p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
             <div className="bg-gradient-to-br from-primary/20 to-brandDark border border-primary/20 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic border-b border-white/5 pb-2">Hizmet Dağılımı</h3>
                <div className="space-y-6">
                   {['gemini', 'openai', 'deepseek', 'grok'].map(provider => {
                     const providerUsage = keys.filter(k => k.provider === provider).reduce((acc, k) => acc + (k.usageCount || 0), 0);
                     const percentage = totalUsage > 0 ? Math.round((providerUsage / totalUsage) * 100) : 0;
                     const colors: Record<string, string> = {
                       gemini: 'bg-primary',
                       openai: 'bg-purple-500',
                       deepseek: 'bg-emerald-500',
                       grok: 'bg-orange-500'
                     };
                     return (
                       <ProgressItem key={provider} label={provider} value={percentage} color={colors[provider] || 'bg-slate-500'} />
                     );
                   })}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, sub, trend }: { label: string, value: string, sub: string, trend: string }) => (
  <div className="glass-panel p-6 rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all group">
     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{label}</p>
     <div className="flex items-end justify-between">
        <h3 className="text-3xl font-black text-white italic tracking-tighter">{value}</h3>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${trend.includes('+') ? 'text-emerald-500 bg-emerald-500/10' : trend.includes('-') ? 'text-red-500 bg-red-500/10' : 'text-primary bg-primary/10'}`}>
          {trend}
        </span>
     </div>
     <p className="text-[9px] text-slate-500 uppercase font-black mt-4 opacity-50">{sub}</p>
  </div>
);

const ProgressItem = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="space-y-2">
     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <span className="text-slate-400">{label}</span>
        <span className="text-white">%{value}</span>
     </div>
     <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-1000 shadow-lg`} style={{ width: `${value}%` }}></div>
     </div>
  </div>
);

export default AnalyticsView;
