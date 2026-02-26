import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Terminal, Database, Code, Cloud, Search, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  tags: string[];
}

const DEV_TOOLS_DATA: Tool[] = [
  { id: '1', name: 'Postman', description: 'API geliştirme ve test platformu.', category: 'API', url: 'https://postman.com', tags: ['Testing', 'REST'] },
  { id: '2', name: 'Docker', description: 'Uygulamaları konteynerlar içinde paketleme ve çalıştırma.', category: 'DevOps', url: 'https://docker.com', tags: ['Containers', 'Linux'] },
  { id: '3', name: 'Redis Insight', description: 'Redis verileri için görsel arayüz.', category: 'Veritabanı', url: 'https://redis.com', tags: ['NoSQL', 'Cache'] },
  { id: '4', name: 'TablePlus', description: 'Modern ve hızlı SQL istemcisi.', category: 'Veritabanı', url: 'https://tableplus.com', tags: ['SQL', 'GUI'] },
  { id: '5', name: 'Insomnia', description: 'Açık kaynaklı API tasarım ve test aracı.', category: 'API', url: 'https://insomnia.rest', tags: ['GraphQL', 'gRPC'] },
  { id: '6', name: 'DBeaver', description: 'Ücretsiz evrensel veritabanı aracı.', category: 'Veritabanı', url: 'https://dbeaver.io', tags: ['Cross-platform', 'Open Source'] },
  { id: '7', name: 'Kubernetes', description: 'Konteyner orkestrasyon sistemi.', category: 'DevOps', url: 'https://kubernetes.io', tags: ['Orchestration', 'Scaling'] },
  { id: '8', name: 'Sentry', description: 'Hata izleme ve performans izleme.', category: 'Monitoring', url: 'https://sentry.io', tags: ['Errors', 'Analytics'] }
];

const DevToolsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Hepsi');

  const categories = ['Hepsi', ...new Set(DEV_TOOLS_DATA.map(t => t.category))];

  const filteredTools = DEV_TOOLS_DATA.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Hepsi' || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto min-h-screen pb-32 bg-brandDark text-slate-200">
      <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-lg shadow-emerald-500/20">
            <Wrench className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white font-sans uppercase italic">
              DevTools <span className="text-emerald-500">Gezgini</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Geliştiriciler İçin Harika Araçlar Koleksiyonu</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Araç Kütüphanesinde Ara</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
              <input
                type="text"
                placeholder="Örn: SQL, API, Docker..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-slate-200 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700 font-medium"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  activeCategory === cat
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-black/40 border-white/10 text-slate-500 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredTools.map((tool) => (
            <motion.div
              layout
              key={tool.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel rounded-[32px] p-8 border border-white/5 bg-white/5 hover:border-emerald-500/30 transition-all group flex flex-col h-full shadow-xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform shadow-inner border border-white/5">
                  {tool.category === 'API' && <Terminal className="w-6 h-6" />}
                  {tool.category === 'DevOps' && <Cloud className="w-6 h-6" />}
                  {tool.category === 'Veritabanı' && <Database className="w-6 h-6" />}
                  {tool.category === 'Monitoring' && <Zap className="w-6 h-6" />}
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 text-slate-500 rounded-full border border-white/5">
                  {tool.category}
                </span>
              </div>

              <h3 className="font-black text-lg text-white italic uppercase tracking-tight mb-2">{tool.name}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-grow">{tool.description}</p>

              <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-6">
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-black text-slate-500 bg-white/5 px-2 py-1 rounded uppercase tracking-tighter">
                      #{tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => window.open(tool.url, '_blank')}
                  className="w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border bg-white/5 border-white/10 text-white hover:bg-emerald-600 hover:border-emerald-500 shadow-lg group-hover:shadow-emerald-600/10"
                >
                  <ExternalLink className="w-4 h-4" /> SİTEYE GİT
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DevToolsView;
