import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Search, Layers, Box, Cpu, Zap, Globe, MessageSquare, Shield, Rocket, HelpCircle, ChevronRight, PlayCircle, ExternalLink, Smartphone, ListChecks, Info, Lightbulb } from 'lucide-react';
import { MODULE_MANUALS } from '../data/moduleManuals';

const UserManualView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<any>(null);

  const filteredManuals = MODULE_MANUALS.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark text-slate-200">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)] border border-white/20">
                  <Book className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Kullanma Kılavuzu</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Portal Özellikleri ve Operasyonel Rehber</p>
          </div>

          <div className="relative w-full md:w-80 group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors w-4 h-4" />
             <input
               type="text"
               placeholder="Özellik ara..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-xs text-white outline-none focus:border-blue-500 transition-all"
             />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-12">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredManuals.map((manual) => (
                  <motion.div
                    key={manual.id}
                    layoutId={manual.id}
                    onClick={() => setSelectedEntry(manual)}
                    className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] group hover:border-blue-500/50 transition-all cursor-pointer relative overflow-hidden"
                  >
                     <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full">{manual.category}</span>
                        <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-blue-500 transition-all group-hover:translate-x-1" />
                     </div>
                     <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">{manual.title}</h3>
                     <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{manual.description}</p>
                  </motion.div>
                ))}
             </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
             <div className="bg-gradient-to-br from-blue-600/20 to-brandDark border border-blue-600/20 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic border-b border-white/5 pb-2">Hızlı İpuçları</h3>
                <div className="space-y-6">
                   <div className="flex gap-4">
                      <Zap className="w-5 h-5 text-blue-500 shrink-0" />
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">SESLİ KOMUTLARI KULLANIN. "BORSAYA GİT" VEYA "RESİM OLUŞTUR" DİYEBİLİRSİNİZ.</p>
                   </div>
                   <div className="flex gap-4">
                      <Layers className="w-5 h-5 text-blue-500 shrink-0" />
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">MODÜLLER ARASINDA VERİ AKTARIMI İÇİN 'STITCH' ÖZELLİĞİNİ KULLANIN.</p>
                   </div>
                </div>
             </div>

             <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/5 space-y-6">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Yardım Videoları</h4>
                <div className="space-y-3">
                   {['Portal Turu', 'API Yapılandırma', 'Ajan Eğitimi'].map(v => (
                     <div key={v} className="flex justify-between items-center p-3 bg-black/40 border border-white/5 rounded-xl group hover:border-blue-500/50 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                           <PlayCircle className="w-4 h-4 text-blue-500" />
                           <span className="text-xs font-bold text-white uppercase">{v}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-blue-500 transition-colors" />
                     </div>
                   ))}
                </div>
             </div>

             <div className="p-8 bg-blue-600/5 border border-blue-500/10 rounded-[40px]">
                <p className="text-[11px] text-slate-500 italic leading-relaxed text-center">
                  "Daha fazla destek için 'AI Sohbet' üzerinden 'Sistem Uzmanı' personası ile iletişime geçebilirsiniz."
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* MANUAL DETAIL MODAL */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 lg:p-8"
          >
            <motion.div
              layoutId={selectedEntry.id}
              className="w-full max-w-3xl bg-[#0d0d0d] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
               <div className="p-8 lg:p-10 border-b border-white/5 flex items-center justify-between">
                  <div>
                     <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">{selectedEntry.category}</span>
                     <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mt-1">{selectedEntry.title}</h3>
                  </div>
                  <button onClick={() => setSelectedEntry(null)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                     <i className="fa-solid fa-xmark"></i>
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-10 custom-scrollbar-hidden">
                  <section className="space-y-4">
                     <div className="flex items-center gap-3 text-white">
                        <Info className="w-5 h-5 text-blue-500" />
                        <h4 className="font-black uppercase text-sm tracking-widest">Genel Bakış</h4>
                     </div>
                     <p className="text-slate-400 text-sm leading-relaxed italic">{selectedEntry.description}</p>
                  </section>

                  <section className="space-y-4">
                     <div className="flex items-center gap-3 text-white">
                        <ListChecks className="w-5 h-5 text-blue-500" />
                        <h4 className="font-black uppercase text-sm tracking-widest">Kullanım Adımları</h4>
                     </div>
                     <div className="space-y-3">
                        {selectedEntry.steps.map((step: string, i: number) => (
                          <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                             <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center shrink-0">{i+1}</span>
                             <p className="text-xs text-slate-300 font-medium">{step}</p>
                          </div>
                        ))}
                     </div>
                  </section>

                  {selectedEntry.tips.length > 0 && (
                    <section className="space-y-4">
                       <div className="flex items-center gap-3 text-white">
                          <Lightbulb className="w-5 h-5 text-amber-500" />
                          <h4 className="font-black uppercase text-sm tracking-widest">Profesyonel İpuçları</h4>
                       </div>
                       <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-3xl">
                          <ul className="list-disc list-inside space-y-2">
                             {selectedEntry.tips.map((tip: string, i: number) => (
                               <li key={i} className="text-xs text-amber-200/70 italic font-medium">{tip}</li>
                             ))}
                          </ul>
                       </div>
                    </section>
                  )}
               </div>

               <div className="p-8 bg-white/5 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl"
                  >
                     ANLADIM
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManualView;
