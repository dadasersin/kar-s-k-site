import React, { useState } from 'react';
import { AppView } from '../types';

interface HomeViewProps {
  onViewChange: (view: AppView) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onViewChange }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
    }
  };

  return (
    <section className="section-transition p-8 lg:p-12 relative animate-in fade-in duration-700 h-full overflow-y-auto pb-32" id="home">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full orb-glow -z-10"></div>
      <div className="max-w-6xl mx-auto pt-20">
        <header className="mb-16">
          <h2 className="text-primary font-bold tracking-[0.3em] uppercase mb-4">Sistem Operasyon Merkezi</h2>
          <h3 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
            Geleceği<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Yeniden Kurgula.</span>
          </h3>
          <div className="flex flex-wrap gap-8 mb-12">
            <div className="bg-surface/50 backdrop-blur-md border border-white/5 p-6 rounded-custom w-40">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Durum</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                <p className="text-lg font-bold">Aktif</p>
              </div>
            </div>
            <div className="bg-surface/50 backdrop-blur-md border border-white/5 p-6 rounded-custom w-40 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => onViewChange(AppView.DASHBOARD)}>
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Modüller</p>
              <p className="text-lg font-bold">32 Birim</p>
            </div>
            <div className="bg-surface/50 backdrop-blur-md border border-white/5 p-6 rounded-custom w-40">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Gecikme</p>
              <p className="text-lg font-bold text-primary">1.2ms</p>
            </div>
          </div>

          {/* Global Google Search Bar on Home */}
          <div className="max-w-2xl mb-16 animate-in slide-in-from-left-8 duration-1000">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <i className="fa-solid fa-magnifying-glass text-primary group-focus-within:scale-110 transition-transform"></i>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full bg-surface/50 backdrop-blur-md border border-white/10 rounded-2xl py-5 pl-14 pr-32 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-2xl"
                placeholder="Google'da hızlı arama yapın..."
              />
              <button
                type="submit"
                className="absolute right-3 top-2.5 bottom-2.5 px-6 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:brightness-110 transition-all shadow-lg"
              >
                ARA
              </button>
            </form>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>}
            title="Hızlı Analiz"
            desc="Verilerinizi yapay zeka ile saniyeler içinde analiz edin."
            onClick={() => onViewChange(AppView.CHAT)}
          />
          <FeatureCard
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>}
            title="Görsel Üretimi"
            desc="Hayallerinizi fotorealistik görsellere dönüştürün."
            onClick={() => onViewChange(AppView.VISUALS)}
          />
          <FeatureCard
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>}
            title="Ses Sentezi"
            desc="Metinleri profesyonel seslendirmelere çevirin."
            onClick={() => onViewChange(AppView.AUDIO)}
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, desc, onClick }: { icon: React.ReactNode, title: string, desc: string, onClick?: () => void }) => (
  <div className="group bg-surface hover:bg-white/5 border border-white/5 p-6 rounded-custom transition-all cursor-pointer" onClick={onClick}>
    <div className="w-12 h-12 bg-primary/10 rounded-custom flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h4 className="font-bold mb-2">{title}</h4>
    <p className="text-sm text-gray-400">{desc}</p>
  </div>
);

export default HomeView;
