import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, TrendingUp, Globe, Cpu, Trophy, Search, Clock, ExternalLink, Activity } from 'lucide-react';

interface NewsItem {
  id: string;
  category: 'Gündem' | 'Teknoloji' | 'Ekonomi' | 'Spor';
  title: string;
  summary: string;
  source: string;
  time: string;
  image: string;
  trend?: boolean;
}

const NewsView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');

  const news: NewsItem[] = [
    {
      id: '1',
      category: 'Teknoloji',
      title: 'Yapay Zeka Mimarisinde Devrim: Nöral İşlemcilerde %40 Verimlilik Artışı',
      summary: 'Yeni nesil kuantum tabanlı sinir ağları, enerji tüketimini minimize ederken işlem hızını katlıyor.',
      source: 'TechPortal',
      time: '12dk önce',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
      trend: true
    },
    {
      id: '2',
      category: 'Gündem',
      title: 'Küresel İklim Zirvesi: Karbon Emisyonu İçin Sert Kararlar Kapıda',
      summary: 'Dünya liderleri 2030 hedeflerini revize etmek üzere acil koduyla toplandı.',
      source: 'GlobalNews',
      time: '45dk önce',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: '3',
      category: 'Ekonomi',
      title: 'Dijital Para Piyasalarında Hareketlilik: Bitcoin Yeni Rekor Denemesinde',
      summary: 'ETF onayları sonrası kurumsal girişlerin artmasıyla kripto varlıklar değer kazanmaya devam ediyor.',
      source: 'FinanceHub',
      time: '1s önce',
      image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800',
      trend: true
    },
    {
      id: '4',
      category: 'Spor',
      title: 'Şampiyonlar Ligi: Çeyrek Final Eşleşmeleri Belli Oldu',
      summary: 'Devlerin mücadelesinde erken final tadında maçlar futbolseverleri bekliyor.',
      source: 'SportX',
      time: '2s önce',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '5',
        category: 'Teknoloji',
        title: 'Nexus Portal v3.0 Yayınlandı: Otonom AI Geliştirici Yayında',
        summary: 'Ersin Güleş tarafından geliştirilen portal, artık kendi modüllerini üretebilen bir zekaya sahip.',
        source: 'DevLog',
        time: '3s önce',
        image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800',
        trend: true
    }
  ];

  const filteredNews = news.filter(item => {
    const matchesCategory = activeCategory === 'Tümü' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 lg:p-12 overflow-y-auto h-full pb-32 bg-brandDark animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shadow-2xl shadow-primary/10">
                 <Newspaper className="w-8 h-8" />
              </div>
              <div>
                 <h1 className="text-4xl lg:text-5xl font-black text-white italic tracking-tighter uppercase leading-none text-glow">Haber <span className="text-primary">Merkezi</span></h1>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                    <span className="w-8 h-px bg-primary"></span> Canlı Dünya Gündemi & Analiz
                 </p>
              </div>
           </div>

           <div className="w-full lg:w-96 relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Haberlerde ara..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-primary/50 outline-none transition-all placeholder:text-slate-600"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
           </div>
        </header>

        {/* Categories & Stats */}
        <div className="flex flex-wrap items-center justify-between gap-6 bg-white/5 border border-white/10 p-2 rounded-3xl backdrop-blur-xl">
           <div className="flex flex-wrap gap-2">
              {['Tümü', 'Gündem', 'Teknoloji', 'Ekonomi', 'Spor'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                  {cat}
                </button>
              ))}
           </div>
           <div className="hidden md:flex items-center gap-6 px-6 border-l border-white/10">
              <div className="flex items-center gap-2">
                 <Activity className="w-4 h-4 text-emerald-500" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Akış: AKTİF</span>
              </div>
              <div className="flex items-center gap-2">
                 <Globe className="w-4 h-4 text-primary" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Kaynak: 120+</span>
              </div>
           </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <AnimatePresence mode="popLayout">
              {filteredNews.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group glass-panel rounded-[2.5rem] border border-white/10 bg-surface/30 overflow-hidden flex flex-col shadow-2xl hover:border-primary/40 transition-all"
                >
                  <div className="h-48 overflow-hidden relative">
                     <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-black text-white uppercase border border-white/10">
                           {item.category}
                        </span>
                        {item.trend && (
                          <span className="px-3 py-1 bg-primary text-white rounded-full text-[8px] font-black uppercase flex items-center gap-1 shadow-lg">
                             <TrendingUp size={10} /> TREND
                          </span>
                        )}
                     </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                           {item.source[0]}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{item.source}</span>
                        <span className="text-[10px] text-slate-700">•</span>
                        <div className="flex items-center gap-1.5 text-slate-500">
                           <Clock size={10} />
                           <span className="text-[10px] font-bold uppercase">{item.time}</span>
                        </div>
                     </div>

                     <h3 className="text-lg font-bold text-white leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2 italic tracking-tight">
                        {item.title}
                     </h3>

                     <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-6">
                        {item.summary}
                     </p>

                     <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                        <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:gap-3 transition-all">
                           DEVAMINI OKU <ExternalLink size={12} />
                        </button>
                        <div className="flex gap-1">
                           <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                           <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                           <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                        </div>
                     </div>
                  </div>
                </motion.div>
              ))}
           </AnimatePresence>
        </div>

        {/* Trending Section */}
        <section className="glass-panel p-10 rounded-[3rem] border border-white/10 bg-brandDark/50 shadow-2xl relative overflow-hidden mt-12">
           <div className="absolute top-0 right-0 p-10 opacity-5">
              <TrendingUp className="w-64 h-64 text-white" />
           </div>

           <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
              <Activity className="text-primary" size={16} /> Popüler Başlıklar
           </h4>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Kuantum İnternet Testleri Başarılı', impact: '+%85 Hareket' },
                { title: 'Mars Kolonisi İçin Yeni Oksijen Üretimi', impact: 'Küresel İlgi' },
                { title: 'Elektrikli Araçlarda Katı Hal Pili', impact: 'Piyasa Etkisi' },
                { title: 'Metaverse ve Gerçek Dünya Entegrasyonu', impact: 'Yeni Trend' }
              ].map((trend, i) => (
                <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/20 transition-all cursor-pointer group">
                   <p className="text-[8px] font-black text-primary uppercase mb-2 tracking-widest">{trend.impact}</p>
                   <h5 className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors line-clamp-2">{trend.title}</h5>
                </div>
              ))}
           </div>
        </section>

      </div>
    </div>
  );
};

export default NewsView;
