import React from 'react';
import { AppView } from '../types';
import { getStorageItem } from '../utils/storage';

interface NavigationProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  onManualSync: () => void;
  onGitHubSync?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  activeView,
  onViewChange,
  syncStatus,
  onManualSync,
  onGitHubSync,
  isMobileOpen,
  onCloseMobile
}) => {
  const menuItems = [
    { id: AppView.OMNIVIEW, label: 'Omni Hub', icon: 'fa-layer-group' },
    { id: AppView.HOME, label: 'Ana Sayfa', icon: 'fa-house-chimney' },
    { id: AppView.TOOLS, label: 'YZ Araçları', icon: 'fa-screwdriver-wrench' },
    { id: AppView.DASHBOARD, label: 'Kontrol Paneli', icon: 'fa-chart-pie' },
    { id: AppView.JULES_STUDIO, label: 'Jules AI Studio', icon: 'fa-wand-sparkles' },
    { id: AppView.CHAT, label: 'AI Sohbet', icon: 'fa-comments' },
    { id: AppView.GOOGLE_AI_STUDIO, label: 'Google AI Studio', icon: 'fa-microchip' },
    { id: AppView.SKYDRIVE, label: 'SkyDrive AI', icon: 'fa-rocket-launch' },
    { id: AppView.VISUALS, label: 'Görsel Stüdyo', icon: 'fa-image' },
    { id: AppView.RUWIS_AI, label: 'RUWIS AI', icon: 'fa-sparkles' },
    { id: AppView.AGENT_SKILLS, label: 'Ajan Becerileri', icon: 'fa-brain' },
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
    { id: AppView.NEWS, label: 'Haber Merkezi', icon: 'fa-newspaper' },
    { id: AppView.PYTHON_LIB, label: 'Python Kitaplığı', icon: 'fa-brands fa-python' },
    { id: AppView.GOOGLE_APPS, label: 'Google Ekosistemi', icon: 'fa-brands fa-google' },
    { id: AppView.INTEGRATIONS, label: 'Entegrasyonlar', icon: 'fa-link' },
    { id: AppView.SECURITY, label: 'Güvenlik Merkezi', icon: 'fa-shield-halved' },
    { id: AppView.PROMPTS, label: 'Prompt Kütüphanesi', icon: 'fa-book' },
    { id: AppView.ANALYTICS, label: 'Analitik & Maliyet', icon: 'fa-chart-line' },
    { id: AppView.REQUESTS, label: 'Görev Yönetimi', icon: 'fa-list-check' },
    { id: AppView.GALLERY, label: 'Galeri', icon: 'fa-images' },
    { id: AppView.MUSIC, label: 'Müzik Kitaplığı', icon: 'fa-compact-disc' },
    { id: AppView.SUNO, label: 'Suno Müzik AI', icon: 'fa-microphone-lines' },
    { id: AppView.FIGMA_STUDIO, label: 'Figma Stüdyo', icon: 'fa-brands fa-figma' },
    { id: AppView.CREATIVE, label: '3D Sahne', icon: 'fa-cube' },
    { id: AppView.PROMPT_MASTER, label: 'Prompt Mühendisliği', icon: 'fa-book-sparkles' },
    { id: AppView.QUOTIO, label: 'Quotio Failover', icon: 'fa-shield-heart' },
    { id: AppView.SYSTEM, label: 'Sistem Çekirdeği', icon: 'fa-microchip' },
    { id: AppView.ANTIGRAVITY, label: 'Model Kotası', icon: 'fa-gauge-high' },
    { id: AppView.AG_TOOLKIT, label: 'Model Araçları', icon: 'fa-toolbox' },
    { id: AppView.DEV_TOOLS, label: 'DevTools Gezgini', icon: 'fa-screwdriver' },
    { id: AppView.CODER_CONFIG, label: 'Coder Yapılandırma', icon: 'fa-gear' },
    { id: AppView.AGENTIC_CONFIG, label: 'Ajanik Akışlar', icon: 'fa-diagram-successor' },
    { id: AppView.TRANSPARENT_PNG, label: 'Şeffaf PNG', icon: 'fa-image-portrait' },
    { id: AppView.SKILLSHARE, label: 'SkillShare Hub', icon: 'fa-share-nodes' },
    { id: AppView.SELINE, label: 'Seline Asistan', icon: 'fa-user-shield' },
    { id: AppView.AG2API, label: 'Ag2Api Proxy', icon: 'fa-network-wired' },
    { id: AppView.CURSOR_BRIDGE, label: 'Cursor Köprüsü', icon: 'fa-bridge' },
    { id: AppView.KHOATA_TOOL, label: 'Khoata Güvenlik', icon: 'fa-fingerprint' },
    { id: AppView.CODEX_SWITCHER, label: 'Codex Değiştirici', icon: 'fa-shuffle' },
    { id: AppView.AG_COPILOT, label: 'Ag-Copilot', icon: 'fa-robot' },
    { id: AppView.AG_USAGE_CHECKER, label: 'AG Denetleyici', icon: 'fa-chart-simple' },
    { id: AppView.PROMPT_EXPERT, label: 'Prompt Uzmanı', icon: 'fa-sparkles' },
    { id: AppView.CURSOR_PROXY, label: 'Cursor AG Proxy', icon: 'fa-rocket' },
    { id: AppView.AG_SYNC, label: 'AG Senkronize', icon: 'fa-folder-tree' },
    { id: AppView.AG_LAUNCHER, label: 'AG Başlatıcı', icon: 'fa-power-off' },
    { id: AppView.USER_MANUAL, label: 'Kullanma Kılavuzu', icon: 'fa-book' },
  ];


  // Dynamic Modules from Database/LocalStorage
  const dynamicModules = (() => {
    try {
      return getStorageItem('active_dynamic_modules', []);
    } catch (e) { return []; }
  })();

  // Helper to check if API key is provided via settings or env
  const isApiActive = (() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (envKey && envKey.length > 5) return true;

    try {
      const settings = getStorageItem('sync_settings', null);
      if (settings) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return settings.customApiKeys?.some((k: any) => !k.isQuotaExhausted && k.key.length > 5);
      }
    } catch (e) {
      console.error("Error checking API status", e);
    }
    return false;
  })();

  const handleItemClick = (id: AppView | string) => {
    onViewChange(id as any);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden animate-in fade-in duration-300"
          onClick={onCloseMobile}
        />
      )}

      {/* RESPONSIVE SIDEBAR */}
      <aside className={`fixed left-0 top-0 h-full w-64 flex flex-col glass-panel border-r border-slate-800 z-[60] transition-all duration-500 lg:translate-x-0 ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}>
        <div className="p-4 lg:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 shrink-0 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(13,89,242,0.4)]">
              <span className="font-bold text-xl text-white font-sans">EG</span>
            </div>
            <div className="hidden lg:block overflow-hidden">
              <h1 className="font-bold text-xs tracking-tight text-white font-sans truncate">
                {localStorage.getItem('site_title') || 'Ersin Güleş'}
              </h1>
              <p className="text-[9px] text-primary uppercase font-bold tracking-widest font-sans">Portal Sahibi</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 lg:px-4 space-y-1 mt-2 overflow-y-auto custom-scrollbar-hidden pb-20">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center gap-4 px-3 lg:px-4 py-3 lg:py-2.5 rounded-xl transition-all duration-300 group ${activeView === item.id
                ? 'bg-primary/10 text-primary shadow-inner border border-primary/20'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              title={item.label}
            >
              <i className={`fa-solid ${item.icon} w-6 lg:w-5 text-center text-lg lg:text-base transition-transform group-hover:scale-110 ${activeView === item.id ? 'text-primary' : ''}`}></i>
              <span className="font-bold text-[10px] uppercase tracking-wider truncate">{item.label}</span>
            </button>
          ))}

          {dynamicModules.length > 0 && (
            <>
              <div className="pt-4 pb-2 px-6">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Aktif Modüller</p>
              </div>
              {dynamicModules.map((mod: any) => (
                <button
                  key={mod.id}
                  onClick={() => handleItemClick(mod.id)}
                  className={`w-full flex items-center gap-4 px-3 lg:px-4 py-2.5 rounded-xl transition-all duration-300 group ${(activeView as string) === mod.id
                    ? 'bg-emerald-500/10 text-emerald-400 shadow-inner border border-emerald-500/20'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  title={mod.label}
                >
                  <i className={`fa-solid ${mod.icon || 'fa-cube'} w-6 lg:w-5 text-center text-lg lg:text-base`}></i>
                  <span className="font-bold text-[10px] uppercase tracking-wider truncate">{mod.label}</span>
                </button>
              ))}
            </>
          )}
        </nav>

        {/* Music Player Widget */}
        <div className="p-4 border-t border-white/5 hidden lg:block">
          <div className="bg-brandDark/50 p-3 rounded-xl border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <div className="w-0.5 h-3 bg-primary animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-0.5 h-5 bg-primary animate-bounce mx-0.5"></div>
                <div className="w-0.5 h-2 bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Şimdi Çalıyor</p>
                <p className="text-[10px] font-bold truncate text-slate-200">Nöral Frekanslar v2</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <button className="hover:text-primary transition-colors"><i className="fa-solid fa-backward-step text-xs"></i></button>
              <button className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"><i className="fa-solid fa-pause text-[10px]"></i></button>
              <button className="hover:text-primary transition-colors"><i className="fa-solid fa-forward-step text-xs"></i></button>
            </div>
          </div>
        </div>

        <div className="p-3 lg:p-4 border-t border-slate-800 bg-slate-900/20 space-y-2">
          <button
            onClick={onGitHubSync}
            className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5 transition-all flex items-center justify-center gap-2"
          >
            <i className="fa-brands fa-github"></i> GITHUB'A YÜKLE
          </button>

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
