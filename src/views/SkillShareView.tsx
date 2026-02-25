import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, Search, RefreshCw, Cpu, Brain, Rocket, Box, Globe, ShieldCheck, Plus, Terminal } from 'lucide-react';

const SkillShareView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const skills = [
    { id: '1', name: 'pdf-extractor', desc: 'PDF dosyalarından tablo ve metin ayıklar.', author: 'anthropic', tags: ['Docs', 'OCR'] },
    { id: '2', name: 'react-refactor', desc: 'React bileşenlerini temiz koda dönüştürür.', author: 'runkids', tags: ['Code', 'Frontend'] },
    { id: '3', name: 'api-test-gen', desc: 'OpenAPI şemasından test senaryoları üretir.', author: 'devtools', tags: ['API', 'Testing'] },
    { id: '4', name: 'ascii-art-gen', desc: 'Metinleri ASCII sanatına çevirir.', author: 'octopus', tags: ['Visual', 'CLI'] },
  ];

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark text-slate-200">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.4)] border border-white/20">
                  <Share2 className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">SkillShare Hub</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">YZ Ajan Becerileri Paylaşım ve Senkronizasyon Merkezi</p>
          </div>

          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl shadow-indigo-600/20"
          >
            {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            {isSyncing ? 'SENKRONİZE EDİLYOR...' : 'GLOBAL HUB SENKRONİZASYONU'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
             <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Beceri ara (Örn: pdf, react, test...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-slate-200 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700 font-medium"
                  />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.map(skill => (
                  <motion.div
                    key={skill.id}
                    whileHover={{ y: -5 }}
                    className="glass-panel rounded-[32px] p-8 border border-white/5 bg-white/5 hover:border-indigo-500/30 transition-all group flex flex-col h-full"
                  >
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                          <Brain className="w-6 h-6" />
                       </div>
                       <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 text-slate-500 rounded-full">@{skill.author}</span>
                    </div>
                    <h3 className="font-black text-lg text-white italic uppercase tracking-tight mb-2">{skill.name}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-8 flex-grow">{skill.desc}</p>

                    <div className="flex flex-wrap gap-2 mb-8">
                       {skill.tags.map(tag => <span key={tag} className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">#{tag}</span>)}
                    </div>

                    <button className="w-full py-4 bg-white/5 hover:bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:border-indigo-500 transition-all flex items-center justify-center gap-2">
                       <Download className="w-4 h-4" /> BECERİYİ KUR
                    </button>
                  </motion.div>
                ))}
             </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
             <div className="bg-gradient-to-br from-indigo-600/20 to-brandDark border border-indigo-600/20 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic border-b border-white/5 pb-2">Yerel Durum</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Kurulu Beceri</span>
                      <span className="text-xs font-black text-white">12</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bekleyen Güncelleme</span>
                      <span className="text-xs font-black text-indigo-500">2</span>
                   </div>
                </div>
                <button className="w-full mt-10 py-4 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-indigo-500/20 flex items-center justify-center gap-2">
                   <Plus className="w-4 h-4" /> YENİ BECERİ OLUŞTUR
                </button>
             </div>

             <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/5 space-y-6">
                <div className="flex items-center gap-3">
                   <Terminal className="w-5 h-5 text-indigo-500" />
                   <p className="text-[10px] font-black text-white uppercase tracking-widest">CLI Entegrasyonu</p>
                </div>
                <div className="p-4 bg-black rounded-xl border border-white/5 font-mono text-[10px] text-slate-500">
                   skillshare install @anthropic/pdf
                </div>
                <p className="text-[11px] text-slate-500 italic">"Beceri dosyalarını (SKILL.md) tek bir komutla tüm AI araçlarınıza senkronize edin."</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillShareView;
