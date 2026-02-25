import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Search, Layers, Box, Cpu, Zap, Globe, MessageSquare, Shield, Rocket, HelpCircle, ChevronRight, PlayCircle, ExternalLink, Smartphone } from 'lucide-react';

const UserManualView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'basics' | 'ai' | 'finance' | 'tools'>('basics');

  const manualEntries = [
    {
      category: 'Temel Özellikler',
      items: [
        { title: 'Ana Sayfa (Home)', desc: 'Sisteminizin genel durumunu ve hızlı işlem kartlarını görebileceğiniz merkezi bir panel.' },
        { title: 'Kontrol Paneli (Dashboard)', desc: 'İş akışlarınızı, aktif modülleri ve sistem metriklerini izlemek için kullanılır.' },
        { title: 'Sistem Ayarları', desc: 'API anahtarlarınızı, tema tercihlerini ve senkronizasyon ayarlarını yönettiğiniz bölüm.' },
      ]
    },
    {
      category: 'YZ & Ajanlar',
      items: [
        { title: 'AI Sohbet (Chat)', desc: 'Gemini, Claude ve OpenAI modelleriyle doğrudan etkileşim kurun. Dosya analizi ve web araması desteği mevcuttur.' },
        { title: 'Jules AI Studio', desc: 'Karmaşık YZ çıktılarını (kod, metin, görsel) birleştirerek tam projeler oluşturmanızı sağlar.' },
        { title: 'Ajan Becerileri', desc: 'Ajanlarınıza yeni yetenekler (PDF okuma, AWS yönetimi vb.) kazandırmak için SKILL.md dosyalarını yönetin.' },
        { title: 'RUWIS AI', desc: 'Gelişmiş görsel üretim ve düzenleme stüdyosu. Hayallerinizi sanata dönüştürün.' },
      ]
    },
    {
      category: 'Finans & Takip',
      items: [
        { title: 'İstanbul Borsa (BIST)', desc: 'BIST 100 hisselerini anlık olarak takip edin, kazanan ve kaybedenleri analiz edin.' },
        { title: 'Kripto Bot', desc: 'Global kripto para piyasasını canlı izleyin ve algoritmik sinyalleri kontrol edin.' },
      ]
    },
    {
      category: 'Geliştirici Araçları',
      items: [
        { title: 'LİVE AI DEVELOPER', desc: 'Gerçek zamanlı AI kod yazımı. Tüm entegrasyonlardan veri çekerek yeni modüller inşa eder.' },
        { title: 'Figma Stüdyo', desc: 'MCP protokolü üzerinden Figma tasarımlarınızı analiz edin ve koda dönüştürün.' },
        { title: 'Docker AI', desc: 'Docker yapılandırmalarınızı analiz eder ve hataları otomatik olarak teşhis eder.' },
      ]
    }
  ];

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
             {manualEntries.map((section, idx) => (
               <div key={idx} className="space-y-6">
                  <h3 className="text-xl font-black text-white uppercase italic tracking-widest border-l-4 border-blue-600 pl-6">{section.category}</h3>
                  <div className="grid grid-cols-1 gap-4">
                     {section.items.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.desc.toLowerCase().includes(searchTerm.toLowerCase())).map((item, i) => (
                       <motion.div
                         key={i}
                         whileHover={{ x: 10 }}
                         className="p-6 bg-white/5 border border-white/5 rounded-3xl group hover:border-blue-500/30 transition-all cursor-default"
                       >
                          <div className="flex justify-between items-start mb-2">
                             <h4 className="font-bold text-white uppercase text-sm tracking-tight group-hover:text-blue-400 transition-colors">{item.title}</h4>
                             <HelpCircle className="w-4 h-4 text-slate-700" />
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                       </motion.div>
                     ))}
                  </div>
               </div>
             ))}
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
    </div>
  );
};

export default UserManualView;
