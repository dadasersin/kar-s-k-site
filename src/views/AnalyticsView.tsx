import React from 'react';

const AnalyticsView: React.FC = () => {
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
          <StatCard label="Toplam İstek" value="1,284" sub="Son 30 gün" trend="+12%" />
          <StatCard label="Tahmini Maliyet" value="$14.20" sub="Aylık toplam" trend="-3%" />
          <StatCard label="Ort. Yanıt Hızı" value="1.2s" sub="Global ortalama" trend="-150ms" />
          <StatCard label="Başarı Oranı" value="99.9%" sub="Tüm modüller" trend="Stabil" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          <div className="lg:col-span-8 space-y-8">
            <div className="glass-panel p-8 rounded-[40px] shadow-2xl min-h-[400px] flex flex-col">
              <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3 italic">
                <i className="fa-solid fa-chart-area text-primary"></i>
                Kullanım Grafiği (Token)
              </h3>
              <div className="flex-1 border border-white/5 bg-black/20 rounded-3xl relative flex items-end justify-around p-8">
                 {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85, 50, 60].map((h, i) => (
                   <div key={i} className="w-4 bg-primary/20 hover:bg-primary/50 transition-all rounded-t-lg relative group cursor-pointer" style={{ height: `${h}%` }}>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface p-2 rounded text-[8px] font-black opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 z-10">
                        {h}k Token
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
             <div className="bg-gradient-to-br from-primary/20 to-brandDark border border-primary/20 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic border-b border-white/5 pb-2">Hizmet Dağılımı</h3>
                <div className="space-y-6">
                   <ProgressItem label="Gemini AI" value={75} color="bg-primary" />
                   <ProgressItem label="OpenAI" value={15} color="bg-purple-500" />
                   <ProgressItem label="DeepSeek" value={8} color="bg-emerald-500" />
                   <ProgressItem label="Diğer" value={2} color="bg-slate-500" />
                </div>
             </div>

             <div className="glass-panel p-8 rounded-[32px] border border-white/5 shadow-xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Sistem Sağlığı</p>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center">
                      <span className="text-[10px] font-black text-emerald-500">A+</span>
                   </div>
                   <p className="text-xs text-slate-400 leading-relaxed font-bold uppercase italic tracking-tighter">Tüm düğümler optimal seviyede çalışıyor.</p>
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
