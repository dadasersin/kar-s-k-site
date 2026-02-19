import React from 'react';
import { AppView } from '../types';

interface NavigationProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  onManualSync: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange, syncStatus, onManualSync }) => {
  const menuItems = [
    { id: AppView.HOME, label: 'Ana Sayfa', icon: 'fa-house-chimney' },
    { id: AppView.DASHBOARD, label: 'Kontrol Paneli', icon: 'fa-chart-pie' },
    { id: AppView.CHAT, label: 'AI Sohbet', icon: 'fa-comments' },
    { id: AppView.VISUALS, label: 'Görsel Stüdyo', icon: 'fa-wand-magic-sparkles' },
    { id: AppView.AUDIO, label: 'Ses & Remix', icon: 'fa-music' },
    { id: AppView.LIVE, label: 'Canlı Etkileşim', icon: 'fa-bolt-lightning' },
    { id: AppView.WORKFLOW, label: 'Neural Workflow', icon: 'fa-diagram-project' },
    { id: AppView.BUILDER, label: 'Otonom İnşa', icon: 'fa-hammer' },
    { id: AppView.DOCKER_AI, label: 'Docker AI', icon: 'fa-server' },
    { id: AppView.CRYPTO, label: 'Kripto Bot', icon: 'fa-bitcoin-sign' },
    { id: AppView.AUTOMATION, label: 'Otomasyon Hub', icon: 'fa-robot' },
    { id: AppView.GOOGLE_APPS, label: 'Google Ekosistemi', icon: 'fa-brands fa-google' },
    { id: AppView.PROMPTS, label: 'Prompt Kütüphanesi', icon: 'fa-book' },
    { id: AppView.ANALYTICS, label: 'Analitik & Maliyet', icon: 'fa-chart-line' },
    { id: AppView.REQUESTS, label: 'Görev Yönetimi', icon: 'fa-list-check' },
    { id: AppView.SYSTEM, label: 'Sistem Çekirdeği', icon: 'fa-microchip' },
    { id: AppView.GALLERY, label: 'Galeri', icon: 'fa-images' },
    { id: AppView.MUSIC, label: 'Müzik Kitaplığı', icon: 'fa-compact-disc' },
    { id: AppView.CREATIVE, label: '3D Sahne', icon: 'fa-cube' },
    { id: AppView.SETTINGS, label: 'Sistem Ayarları', icon: 'fa-sliders' },
  ];

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

  return (
    <>
      {/* MASAÜSTÜ SIDEBAR */}
      <aside className="hidden lg:flex w-64 flex-col glass-panel border-r border-slate-800 h-full shrink-0 z-50">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(13,89,242,0.4)]">
              <span className="font-bold text-xl text-white font-sans">EG</span>
            </div>
            <div>
              <h1 className="font-bold text-xs tracking-tight text-white font-sans">Ersin Güleş</h1>
              <p className="text-[9px] text-primary uppercase font-bold tracking-widest font-sans">AI Manager</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto custom-scrollbar-hidden">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                activeView === item.id
                  ? 'bg-primary/10 text-primary shadow-inner border border-primary/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5 text-center transition-transform group-hover:scale-110 ${activeView === item.id ? 'text-primary' : ''}`}></i>
              <span className="font-bold text-[10px] uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/20">
          <div className="flex items-center gap-3 bg-brandDark/50 p-3 rounded-xl border border-white/5 cursor-pointer hover:border-primary/30 transition-colors" onClick={onManualSync}>
            <div className={`w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700`}>
              <i className={`fa-solid fa-plug-circle-bolt text-primary ${syncStatus === 'syncing' ? 'animate-pulse' : ''}`}></i>
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-slate-300 truncate uppercase tracking-tighter">Sistem Durumu</p>
              <div className="flex items-center gap-2">
                 <div className={`w-1.5 h-1.5 rounded-full ${isApiActive ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                 <p className={`text-[8px] font-black uppercase tracking-widest ${isApiActive ? 'text-green-500' : 'text-red-500'}`}>
                   {isApiActive ? 'Aktif' : 'Pasif'}
                 </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBİL ALT MENÜ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 z-[100] flex items-center justify-around px-1 pb-safe overflow-x-auto scrollbar-hide">
        {menuItems.filter(i => ['home', 'chat', 'visuals', 'workflow', 'requests'].includes(i.id)).map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col items-center justify-center gap-1 min-w-[60px] py-1 transition-all ${
              activeView === item.id ? 'text-primary' : 'text-slate-500'
            }`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeView === item.id ? 'bg-primary/10' : ''}`}>
              <i className={`fa-solid ${item.icon} text-base`}></i>
            </div>
            <span className="text-[7px] font-black uppercase tracking-tighter">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default Navigation;
