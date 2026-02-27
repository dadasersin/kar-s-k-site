import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Layers, Box, Cpu, HardDrive, RefreshCw, Terminal, CheckCircle2, AlertTriangle, ShieldCheck, User, FolderSync } from 'lucide-react';

const CoderConfigView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workstreams' | 'registry' | 'memory'>('workstreams');
  const [isSyncing, setIsSyncing] = useState(false);

  const workstreams = [
    { id: '1', name: 'Kimlik Doğrulama Servisi', repos: 3, status: 'Aktif' },
    { id: '2', name: 'Frontend Yenileme', repos: 1, status: 'Beklemede' },
    { id: '3', name: 'Veritabanı Göçü', repos: 2, status: 'Durduruldu' },
  ];

  const mcpServers = [
    { id: '1', name: 'filesystem', status: 'Bağlı', version: '1.2.0' },
    { id: '2', name: 'github', status: 'Bağlı', version: '2.0.4' },
    { id: '3', name: 'postgres', status: 'Hata', version: '0.8.1' },
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
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)] border border-white/20">
                  <Settings className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Coder Yapılandırması</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Merkezi YZ Kodlama Araçları Yönetimi</p>
          </div>

          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
             {(['workstreams', 'registry', 'memory'] as const).map(tab => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
               >
                  {tab === 'workstreams' && <FolderSync className="w-3 h-3" />}
                  {tab === 'registry' && <Layers className="w-3 h-3" />}
                  {tab === 'memory' && <Cpu className="w-3 h-3" />}
                  {tab === 'workstreams' ? 'İŞ AKIŞLARI' : tab === 'registry' ? 'KAYIT DEFTERİ' : 'KALICI BELLEK'}
               </button>
             ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {activeTab === 'workstreams' && (
                <motion.div key="ws" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="glass-panel rounded-[40px] p-8 lg:p-10 border border-white/5 bg-white/5 shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                       <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                          <FolderSync className="w-6 h-6 text-blue-500" /> Aktif İş Akışları
                       </h3>
                       <button className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg">YENİ OLUŞTUR</button>
                    </div>
                    <div className="space-y-4">
                       {workstreams.map(ws => (
                         <div key={ws.id} className="p-6 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-blue-500/30 transition-all">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                                  <Box className="w-5 h-5" />
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-white">{ws.name}</p>
                                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{ws.repos} Depo Bağlı</p>
                               </div>
                            </div>
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full ${ws.status === 'Aktif' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>{ws.status}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'registry' && (
                <motion.div key="reg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="glass-panel rounded-[40px] p-8 lg:p-10 border border-white/5 bg-white/5 shadow-2xl">
                    <h3 className="text-xl font-black text-white uppercase italic mb-8 flex items-center gap-3">
                       <Layers className="w-6 h-6 text-blue-500" /> MCP Sunucu Kayıtları
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {mcpServers.map(server => (
                         <div key={server.id} className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4">
                            <div className="flex justify-between items-start">
                               <div className="font-bold text-white uppercase text-xs">{server.name}</div>
                               <div className={`w-2 h-2 rounded-full ${server.status === 'Bağlı' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                            </div>
                            <div className="flex justify-between items-end">
                               <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">v{server.version}</span>
                               <button className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400">AYARLAR</button>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'memory' && (
                <motion.div key="mem" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                   <div className="glass-panel rounded-[40px] p-8 lg:p-10 border border-white/5 bg-white/5 shadow-2xl">
                      <h3 className="text-xl font-black text-white uppercase italic mb-8 flex items-center gap-3">
                         <Cpu className="w-6 h-6 text-blue-500" /> Kalıcı Bellek Editörü
                      </h3>
                      <div className="space-y-6">
                         <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-3xl relative group">
                            <label className="absolute -top-3 left-6 px-3 bg-[#111111] text-[10px] font-black text-blue-500 uppercase tracking-widest">Kullanıcı Tercihleri</label>
                            <textarea
                              className="w-full bg-transparent border-none outline-none text-sm text-slate-300 h-32 resize-none italic font-medium"
                              defaultValue={`"Her zaman console.log yerine pino logger kullan. TypeScript arayüzlerini 'I' ön ekiyle tanımlama. Testlerde Vitest kullan."`}
                            />
                            <div className="flex justify-end mt-4">
                               <button className="text-[9px] font-black text-blue-500 hover:text-white uppercase tracking-widest flex items-center gap-2">
                                  <CheckCircle2 className="w-3 h-3" /> GÜNCELLE
                               </button>
                            </div>
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-4 space-y-6">
             <div className="bg-gradient-to-br from-blue-600/20 to-brandDark border border-blue-600/20 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic border-b border-white/5 pb-2">Durum Özeti</h3>
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Senkronizasyon</span>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">TAMAM</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Daemon Port</span>
                      <span className="text-xs font-black text-white italic">3333</span>
                   </div>
                </div>
                <button
                  onClick={handleSync}
                  className="w-full mt-10 py-4 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
                >
                   {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FolderSync className="w-4 h-4" />}
                   {isSyncing ? 'SENKRONİZE EDİLİYOR...' : 'ŞİMDİ SENKRONİZE ET'}
                </button>
             </div>

             <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/5">
                <div className="flex items-center gap-3 mb-4">
                   <ShieldCheck className="w-5 h-5 text-blue-500" />
                   <p className="text-[10px] font-black text-white uppercase tracking-widest">Güvenlik Politikası</p>
                </div>
                <p className="text-[11px] text-slate-500 italic leading-relaxed">
                  "Yapılandırma dosyaları yerel sisteminizde ~/.claude-config/ dizininde güvenli bir şekilde saklanır."
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoderConfigView;
