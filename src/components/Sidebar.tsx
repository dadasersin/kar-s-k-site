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
    { id: AppView.TOOLS, label: 'YZ Araçları', icon: 'fa-screwdriver-wrench' },
    { id: AppView.DASHBOARD, label: 'Kontrol Paneli', icon: 'fa-chart-pie' },
    { id: AppView.JULES_STUDIO, label: 'Jules AI Studio', icon: 'fa-wand-sparkles' },
    { id: AppView.CHAT, label: 'AI Sohbet', icon: 'fa-comments' },
    { id: AppView.VISUALS, label: 'Görsel Stüdyo', icon: 'fa-image' },
    { id: AppView.RUWIS_AI, label: 'RUWIS AI', icon: 'fa-sparkles' },
    { id: AppView.AUDIO, label: 'Ses & Remix', icon: 'fa-music' },
    { id: AppView.LIVE, label: 'Canlı Etkileşim', icon: 'fa-bolt-lightning' },
    { id: AppView.ART_STUDIO, label: 'Sanat Stüdyosu', icon: 'fa-palette' },
    { id: AppView.GAME_DEV, label: 'Oyun Geliştirme', icon: 'fa-gamepad' },
    { id: AppView.WORKFLOW, label: 'Neural Workflow', icon: 'fa-diagram-project' },
    { id: AppView.BUILDER, label: 'LİVE AI DEVELOPER', icon: 'fa-code-branch' },
    { id: AppView.DOCKER_AI, label: 'Docker AI', icon: 'fa-server' },
    { id: AppView.BORSA, label: 'İstanbul Borsa', icon: 'fa-arrow-trend-up' },
    { id: AppView.YOUTUBE, label: 'YouTube Hub', icon: 'fa-brands fa-youtube' },
    { id: AppView.LIVE_TV, label: 'Canlı TV', icon: 'fa-tv' },
    { id: AppView.SYSTEM_EXPERT, label: 'KODLAMA UZMANI', icon: 'fa-user-gear' },
    { id: AppView.CRYPTO, label: 'Kripto Bot', icon: 'fa-bitcoin-sign' },
    { id: AppView.AUTOMATION, label: 'Otomasyon Hub', icon: 'fa-robot' },
    { id: AppView.SOCIAL_MEDIA, label: 'Sosyal Medya', icon: 'fa-share-nodes' },
    { id: AppView.GOOGLE_APPS, label: 'Google Ekosistemi', icon: 'fa-brands fa-google' },
    { id: AppView.INTEGRATIONS, label: 'Entegrasyonlar', icon: 'fa-link' },
    { id: AppView.SECURITY, label: 'Güvenlik Merkezi', icon: 'fa-shield-halved' },
    { id: AppView.PROMPTS, label: 'Prompt Kütüphanesi', icon: 'fa-book' },
    { id: AppView.ANALYTICS, label: 'Analitik & Maliyet', icon: 'fa-chart-line' },
    { id: AppView.REQUESTS, label: 'Görev Yönetimi', icon: 'fa-list-check' },
    { id: AppView.GALLERY, label: 'Galeri', icon: 'fa-images' },
    { id: AppView.MUSIC, label: 'Müzik Kitaplığı', icon: 'fa-compact-disc' },
    { id: AppView.FIGMA_STUDIO, label: 'Figma Stüdyo', icon: 'fa-brands fa-figma' },
    { id: AppView.CREATIVE, label: '3D Sahne', icon: 'fa-cube' },
    { id: AppView.SYSTEM, label: 'Sistem Çekirdeği', icon: 'fa-microchip' },
    { id: AppView.ANTIGRAVITY, label: 'Model Kotası', icon: 'fa-gauge-high' },
    { id: AppView.SETTINGS, label: 'Sistem Ayarları', icon: 'fa-sliders' },
  ];

  // Helper to check if API key is provided via settings or env
  const isApiActive = (() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (envKey && envKey.length > 5) return true;

    try {
      const settingsStr = localStorage.getItem('sync_settings');
      if (settingsStr) {
        const settings = JSON.parse(settingsStr);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return settings.customApiKeys?.some((k: any) => !k.isQuotaExhausted && k.key.length > 5);
      }
    } catch (e) {
      console.error("Error checking API status", e);
    }
    return false;
  })();

  return (
    <>
      {/* RESPONSIVE SIDEBAR (Hidden on Mobile, Full on Desktop) */}
      <aside className="fixed left-0 top-0 h-full w-64 hidden lg:flex flex-col glass-panel border-r border-slate-800 z-50 transition-all duration-300">
        <div className="p-4 lg:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 shrink-0 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(13,89,242,0.4)]">
              <span className="font-bold text-xl text-white font-sans">EG</span>
            </div>
            <div className="hidden lg:block overflow-hidden">
              <h1 className="font-bold text-xs tracking-tight text-white font-sans truncate">Ersin Güleş</h1>
              <p className="text-[9px] text-primary uppercase font-bold tracking-widest font-sans">YZ YÖNETİCİSİ</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 lg:px-4 space-y-1 mt-2 overflow-y-auto custom-scrollbar-hidden pb-20">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-4 px-3 lg:px-4 py-3 lg:py-2.5 rounded-xl transition-all duration-300 group ${
                activeView === item.id
                  ? 'bg-primary/10 text-primary shadow-inner border border-primary/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
              title={item.label}
            >
              <i className={`fa-solid ${item.icon} w-6 lg:w-5 text-center text-lg lg:text-base transition-transform group-hover:scale-110 ${activeView === item.id ? 'text-primary' : ''}`}></i>
              <span className="hidden lg:block font-bold text-[10px] uppercase tracking-wider truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 lg:p-4 border-t border-slate-800 bg-slate-900/20">
          <div className="flex items-center gap-3 bg-brandDark/50 p-2 lg:p-3 rounded-xl border border-white/5 cursor-pointer hover:border-primary/30 transition-colors" onClick={onManualSync}>
            <div className={`w-8 h-8 lg:w-10 lg:h-10 shrink-0 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700`}>
              <i className={`fa-solid fa-plug-circle-bolt text-primary ${syncStatus === 'syncing' ? 'animate-pulse' : ''}`}></i>
            </div>
            <div className="hidden lg:block overflow-hidden">
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
    </>
  );
};

export default Navigation;
