import React from 'react';
import { AppView } from '../types';

interface DashboardProps {
  onViewChange: (view: AppView | string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  // Helper to check if API key is provided via settings or env
  const isApiActive = (() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (envKey && envKey.length > 5) return true;

    const settingsStr = localStorage.getItem('sync_settings');
    if (settingsStr) {
      const settings = JSON.parse(settingsStr);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return settings.customApiKeys?.some((k: any) => !k.isQuotaExhausted && k.key.length > 5);
    }
    return false;
  })();

  const modules = [
    {
      view: AppView.CHAT,
      title: 'Sohbet',
      desc: 'Gemini 2.0 ile gelişmiş yapay zeka deneyimi.',
      icon: 'fa-comments',
      color: 'bg-blue-600 shadow-blue-600/30'
    },
    {
      view: AppView.VISUALS,
      title: 'Stüdyo',
      desc: 'Yüksek kaliteli resim ve videolar oluşturun.',
      icon: 'fa-wand-magic-sparkles',
      color: 'bg-primary shadow-primary/30'
    },
    {
      view: AppView.AUDIO,
      title: 'Ses',
      desc: 'Doğal ses sentezi ve müzik remiksleme.',
      icon: 'fa-music',
      color: 'bg-emerald-600 shadow-emerald-600/30'
    },
    {
      view: AppView.LIVE,
      title: 'Canlı',
      desc: 'Multimodal gerçek zamanlı YZ asistanı.',
      icon: 'fa-bolt-lightning',
      color: 'bg-amber-600 shadow-amber-600/30'
    }
  ];

  return (
    <div className="flex-1 p-5 md:p-10 overflow-y-auto bg-brandDark pb-24 md:pb-10">
      <header className="mb-10 md:mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-4">
           <div className={`w-2 h-2 rounded-full ${isApiActive ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
           <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
             {isApiActive ? 'SİSTEM ÇEVRİMİÇİ' : 'YAPILANDIRMA BEKLENİYOR'}
           </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight text-white">Kontrol Paneli</h1>
        <p className="text-slate-400 text-sm md:text-lg max-w-2xl leading-relaxed">Ersin Güleş'in Modüler YZ ekosistemi ile yaratıcılığınızı bir üst seviyeye taşıyın.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
        {modules.map((m, i) => (
          <button
            key={m.view}
            onClick={() => onViewChange(m.view)}
            className={`group glass-panel rounded-[2.5rem] p-8 text-left hover:border-primary/50 hover:bg-white/5 transition-all duration-500 transform active:scale-95 flex flex-col items-start gap-6 border-slate-800/50 shadow-2xl animate-in fade-in slide-in-from-bottom-4`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className={`w-14 h-14 rounded-2xl ${m.color} flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-12`}>
              <i className={`fa-solid ${m.icon} text-xl text-white`}></i>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors text-white">{m.title}</h3>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed">{m.desc}</p>
            </div>
            <div className="mt-auto pt-4 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
               <span className="text-[10px] font-bold uppercase tracking-widest">Başlat</span>
               <i className="fa-solid fa-chevron-right text-[8px]"></i>
            </div>
          </button>
        ))}
      </div>

      <section className="mt-12 md:mt-20">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-xl md:text-2xl font-bold text-white">Sistem Kayıtları</h2>
           <button className="text-[10px] font-bold text-slate-500 hover:text-primary transition-colors uppercase tracking-widest">Tümünü Gör</button>
        </div>
        <div className="glass-panel rounded-3xl p-10 flex flex-col items-center justify-center text-slate-500 border-dashed border-2 border-slate-800 min-h-[200px] bg-slate-900/10">
          <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 border border-slate-700">
            <i className="fa-solid fa-chart-line text-2xl opacity-30"></i>
          </div>
          <p className="text-sm font-medium">Bağlantı aktif, veri akışı bekleniyor.</p>
          <p className="text-[10px] mt-2 opacity-50 uppercase tracking-tighter">Versiyon 1.0.0-Stable</p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
