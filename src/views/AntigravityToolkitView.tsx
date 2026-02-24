import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Database, GitCommit, FileCode, CheckCircle2, ShieldCheck, Trash2, RefreshCcw, Cpu, HardDrive, Terminal, BarChart3 } from 'lucide-react';

const AntigravityToolkitView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cache' | 'commit' | 'diagnostics'>('cache');
  const [isCleaning, setIsCleaning] = useState(false);
  const [isGeneratingCommit, setIsGeneratingCommit] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const cacheItems = [
    { id: '1', name: 'YZ Sohbet Geçmişi', size: '24.5 MB', type: 'Database' },
    { id: '2', name: 'Geçici Model Dosyaları', size: '156.2 MB', type: 'Static' },
    { id: '3', name: 'Otomasyon Logları', size: '1.2 MB', type: 'Logs' },
    { id: '4', name: 'Bağlam (Context) Önbelleği', size: '89.0 MB', type: 'Cache' },
  ];

  const handleCleanCache = () => {
    setIsCleaning(true);
    setLogs(['> Temizleme işlemi başlatıldı...', '> Önbellek dizinleri taranıyor...', '> Gereksiz dosyalar siliniyor...']);
    setTimeout(() => {
      setLogs(prev => [...prev, '> İşlem tamamlandı. 270.9 MB alan boşaltıldı.', '✔ Önbellek Temizlendi.']);
      setTimeout(() => setIsCleaning(false), 2000);
    }, 2500);
  };

  const generateCommit = () => {
    setIsGeneratingCommit(true);
    setCommitMessage('');
    setTimeout(() => {
      setCommitMessage('feat: implement advanced neural failover and multi-provider integration\n\n- Added Quotio-inspired quota tracking\n- Integrated Composio agent skills\n- Enhanced Figma MCP socket bridge');
      setIsGeneratingCommit(false);
    }, 2000);
  };

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark text-slate-200">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.4)] border border-white/20">
                  <Wrench className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Model Araç Takımı</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Antigravity Toolkit & Verimlilik Araçları</p>
          </div>

          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
             {(['cache', 'commit', 'diagnostics'] as const).map(tab => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
               >
                  {tab === 'cache' && <Database className="w-3 h-3" />}
                  {tab === 'commit' && <GitCommit className="w-3 h-3" />}
                  {tab === 'diagnostics' && <ShieldCheck className="w-3 h-3" />}
                  {tab === 'cache' ? 'ÖNBELLEK' : tab === 'commit' ? 'AI COMMIT' : 'TANILAMA'}
               </button>
             ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {activeTab === 'cache' && (
                <motion.div
                  key="cache"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="glass-panel rounded-[40px] p-8 lg:p-10 border border-white/5 bg-white/5 shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-10">
                       <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                          <HardDrive className="w-6 h-6 text-indigo-500" /> Önbellek Yönetimi
                       </h3>
                       <button
                         onClick={handleCleanCache}
                         disabled={isCleaning}
                         className="px-6 py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                       >
                          <Trash2 className="w-4 h-4" /> {isCleaning ? 'TEMİZLENİYOR...' : 'TÜMÜNÜ TEMİZLE'}
                       </button>
                    </div>

                    <div className="space-y-4">
                       {cacheItems.map(item => (
                         <div key={item.id} className="p-5 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between hover:border-indigo-500/30 transition-all">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-500">
                                  <FileCode className="w-5 h-5" />
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-white">{item.name}</p>
                                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{item.type}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-sm font-bold text-white">{item.size}</p>
                            </div>
                         </div>
                       ))}
                    </div>

                    {isCleaning && (
                      <div className="mt-8 p-6 bg-black rounded-2xl border border-white/10 font-mono text-xs text-indigo-400 space-y-1">
                         {logs.map((log, i) => <div key={i}>{log}</div>)}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'commit' && (
                <motion.div
                  key="commit"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="glass-panel rounded-[40px] p-8 lg:p-10 border border-white/5 bg-white/5 shadow-2xl">
                    <div className="flex justify-between items-center mb-10">
                       <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                          <GitCommit className="w-6 h-6 text-indigo-500" /> AI Commit Mesajı
                       </h3>
                       <button
                         onClick={generateCommit}
                         disabled={isGeneratingCommit}
                         className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                       >
                          {isGeneratingCommit ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
                          {isGeneratingCommit ? 'ÜRETİLİYOR...' : 'MESAJ ÜRET'}
                       </button>
                    </div>

                    <div className="space-y-6">
                       <div className="p-6 bg-black/40 border border-white/10 rounded-2xl min-h-[150px] relative">
                          <label className="absolute -top-3 left-6 px-3 bg-[#111111] text-[10px] font-black text-slate-500 uppercase tracking-widest">Git Diff Analizi</label>
                          <p className="text-xs text-slate-400 font-mono italic">"Sistem dosyalarındaki değişiklikler analiz edildi. Yerel model commit mesajı hazırlamaya hazır."</p>
                       </div>

                       <div className="p-6 bg-indigo-600/5 border border-indigo-500/20 rounded-2xl relative">
                          <label className="absolute -top-3 left-6 px-3 bg-[#111111] text-[10px] font-black text-indigo-500 uppercase tracking-widest italic">Önerilen Mesaj</label>
                          <textarea
                            readOnly
                            value={commitMessage}
                            placeholder="Henüz mesaj üretilmedi..."
                            className="w-full bg-transparent border-none outline-none text-sm text-white font-mono h-32 resize-none placeholder:text-slate-700"
                          />
                       </div>

                       <div className="flex gap-4">
                          <button className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">KOPYALA</button>
                          <button className="flex-1 py-4 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-indigo-500/20">COMMIT ET (SIM)</button>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'diagnostics' && (
                <motion.div
                  key="diagnostics"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {[
                       { name: 'Bağlantı Kontrolü', status: 'OK', icon: <Signal className="w-5 h-5" />, color: 'emerald' },
                       { name: 'API Gateway', status: 'OK', icon: <Cpu className="w-5 h-5" />, color: 'emerald' },
                       { name: 'MCP Protokolü', status: 'OK', icon: <Terminal className="w-5 h-5" />, color: 'emerald' },
                       { name: 'Yerel Bridge', status: 'Hata Bekleniyor', icon: <RefreshCcw className="w-5 h-5" />, color: 'amber' },
                     ].map((diag, i) => (
                       <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between group hover:border-indigo-500/50 transition-all">
                          <div className="flex items-center gap-4">
                             <div className={`w-12 h-12 rounded-2xl bg-${diag.color}-500/10 flex items-center justify-center text-${diag.color}-500`}>
                                {diag.icon}
                             </div>
                             <div>
                                <h5 className="text-white font-black text-sm uppercase italic">{diag.name}</h5>
                                <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 text-${diag.color}-500/70`}>Durum: {diag.status}</p>
                             </div>
                          </div>
                          <CheckCircle2 className={`w-5 h-5 text-${diag.color}-500`} />
                       </div>
                     ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-gradient-to-br from-indigo-600/20 to-brandDark border border-indigo-600/20 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic border-b border-white/5 pb-2">Hızlı İşlemler</h3>
                <div className="space-y-3">
                   <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5 flex items-center justify-center gap-2">
                      <Terminal className="w-4 h-4" /> SERVİSLERİ BAŞLAT
                   </button>
                   <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5 flex items-center justify-center gap-2">
                      <RefreshCcw className="w-4 h-4" /> YENİDEN YÜKLE
                   </button>
                </div>

                <div className="mt-10 p-6 bg-indigo-500/5 rounded-3xl border border-indigo-500/20">
                   <div className="flex items-center gap-3 mb-3">
                      <ShieldCheck className="w-4 h-4 text-indigo-500" />
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Güvenlik Notu</p>
                   </div>
                   <p className="text-[11px] text-slate-500 italic leading-relaxed">
                     "Tüm tanılama ve temizlik işlemleri yerel Antigravity IDE güvenli bölgesi içerisinde gerçekleştirilir."
                   </p>
                </div>
             </div>

             <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center shrink-0">
                   <BarChart3 className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sistem Yükü</p>
                   <p className="text-xl font-black text-white uppercase italic tracking-tighter">%12.4</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Signal = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export default AntigravityToolkitView;
