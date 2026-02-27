import React, { useState } from 'react';
import { Youtube, Search, ExternalLink, Play, Tv, Users, History } from 'lucide-react';

const YouTubeView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`, '_blank');
    }
  };

  const categories = [
    { name: 'Ana Sayfa', icon: <Youtube className="w-4 h-4" />, url: 'https://www.youtube.com' },
    { name: 'Abonelikler', icon: <Users className="w-4 h-4" />, url: 'https://www.youtube.com/feed/subscriptions' },
    { name: 'Geçmiş', icon: <History className="w-4 h-4" />, url: 'https://www.youtube.com/feed/history' },
    { name: 'Kitaplık', icon: <Tv className="w-4 h-4" />, url: 'https://www.youtube.com/feed/library' },
  ];

  const trendingVideos = [
    { title: 'Yapay Zeka ile Gelecek', channel: 'Teknoloji TV', views: '1.2M', time: '2 saat önce', id: 'video1' },
    { title: 'Borsa İstanbul Analizi', channel: 'Finans Dünyası', views: '500K', time: '5 saat önce', id: 'video2' },
    { title: 'Kripto Paralarda Son Durum', channel: 'Crypto News', views: '800K', time: '1 gün önce', id: 'video3' },
  ];

  return (
    <div className="p-4 lg:p-8 h-full overflow-y-auto pb-32 bg-brandDark">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                  <Youtube className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">YouTube Hub</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Kişisel YouTube Deneyiminiz</p>
          </div>

          <button
            onClick={() => window.open('https://accounts.google.com/ServiceLogin?service=youtube', '_blank')}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
          >
             Oturum Aç / Değiştir
             <ExternalLink className="w-3 h-3" />
          </button>
        </header>

        {/* Search Bar */}
        <section className="glass-panel p-6 rounded-[2.5rem] bg-white/5 border border-white/10 shadow-2xl">
           <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                 <input
                   type="text"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="YouTube'da video, kanal veya canlı yayın arayın..."
                   className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm text-white outline-none focus:border-red-600 transition-all"
                 />
              </div>
              <button type="submit" className="px-10 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all text-[10px] shadow-lg shadow-red-600/20">
                ARA
              </button>
           </form>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-4">
             {categories.map(cat => (
               <button
                 key={cat.name}
                 onClick={() => window.open(cat.url, '_blank')}
                 className="w-full flex items-center gap-4 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all group"
               >
                  <span className="group-hover:text-red-600 transition-colors">{cat.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
               </button>
             ))}
          </div>

          {/* Trending / Recommended Area */}
          <div className="lg:col-span-3 space-y-6">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 italic">
                   <Play className="w-4 h-4 text-red-600" />
                   Öne Çıkanlar
                </h3>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Bölgeniz: Türkiye</span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trendingVideos.map((video, i) => (
                  <div key={i} className="glass-panel rounded-3xl overflow-hidden border border-white/5 bg-white/5 hover:border-red-600/30 transition-all group cursor-pointer" onClick={() => window.open(`https://www.youtube.com/search?q=${encodeURIComponent(video.title)}`, '_blank')}>
                     <div className="aspect-video bg-slate-800 relative flex items-center justify-center">
                        <Youtube className="w-10 h-10 text-white/20 group-hover:text-red-600 transition-colors" />
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-[9px] font-bold text-white">10:24</div>
                     </div>
                     <div className="p-5 space-y-2">
                        <h4 className="text-xs font-bold text-white line-clamp-2 leading-relaxed">{video.title}</h4>
                        <p className="text-[10px] text-slate-500 font-bold">{video.channel}</p>
                        <div className="flex justify-between text-[9px] text-slate-600 uppercase font-black">
                           <span>{video.views} Görüntüleme</span>
                           <span>{video.time}</span>
                        </div>
                     </div>
                  </div>
                ))}
             </div>

             <div className="bg-gradient-to-br from-red-600/20 to-brandDark border border-red-600/20 rounded-[3rem] p-10 mt-10">
                <div className="max-w-md">
                   <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">Kendi Deneyiminiz</h3>
                   <p className="text-slate-400 text-sm leading-relaxed mb-8">
                     YouTube'u kendi hesabınızla kullanmak, aboneliklerinizi görmek ve kaldığınız yerden devam etmek için portal üzerinden doğrudan ana siteye güvenli bir şekilde geçiş yapabilirsiniz.
                   </p>
                   <button
                    onClick={() => window.open('https://www.youtube.com', '_blank')}
                    className="px-8 py-4 bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-red-600/20 hover:brightness-110 transition-all text-xs"
                   >
                      YOUTUBE'A GİT
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeView;
