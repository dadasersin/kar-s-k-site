import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Server, Key, Link2, RefreshCw, Terminal, CheckCircle2, AlertCircle, Globe, ShieldCheck, Cpu, Layers } from 'lucide-react';

const Ag2ApiView: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeEndpoints, setActiveEndpoints] = useState(0);

  const toggleProxy = () => {
    setIsRunning(!isRunning);
    setActiveEndpoints(!isRunning ? 3 : 0);
  };

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark text-slate-200">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] border border-white/20">
                  <Network className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Ag2Api Proxy</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Antigravity API'yi OpenAI Formatına Dönüştürün</p>
          </div>

          <button
            onClick={toggleProxy}
            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl ${isRunning ? 'bg-red-600 hover:bg-red-500 shadow-red-600/20' : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/20'} text-white`}
          >
            {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Server className="w-4 h-4" />}
            {isRunning ? 'PROXY DURDUR' : 'PROXY BAŞLAT'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
             <div className="glass-panel rounded-[40px] p-8 lg:p-10 border border-white/5 bg-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                   <Link2 className="w-48 h-48 text-cyan-500" />
                </div>

                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                      <Terminal className="w-6 h-6 text-cyan-500" /> Bağlantı Bilgileri
                   </h3>
                   <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${isRunning ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-800 text-slate-500 border border-white/5'}`}>
                      {isRunning ? 'ÇALIŞIYOR' : 'DURDURULDU'}
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-2 group hover:border-cyan-500/30 transition-all">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base URL</p>
                      <p className="text-sm font-mono text-cyan-400">http://localhost:3000/v1</p>
                   </div>
                   <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-2 group hover:border-cyan-500/30 transition-all">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">OpenAI API Key</p>
                      <p className="text-sm font-mono text-slate-300">sk-ag-**************************</p>
                   </div>
                   <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-2 group hover:border-cyan-500/30 transition-all">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aktif Uç Noktalar</p>
                      <div className="flex gap-2">
                         {['/chat/completions', '/models', '/embeddings'].map(ep => (
                           <span key={ep} className={`text-[10px] font-bold px-2 py-1 rounded bg-white/5 ${isRunning ? 'text-emerald-400' : 'text-slate-600'}`}>{ep}</span>
                         ))}
                      </div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4">
                   <h4 className="text-white font-black text-xs uppercase italic tracking-widest flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-500" /> Çoklu Hesap Yönetimi
                   </h4>
                   <p className="text-[11px] text-slate-500 leading-relaxed">Antigravity hesaplarını havuzlayın ve istekleri otomatik olarak dağıtın.</p>
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4">
                   <h4 className="text-white font-black text-xs uppercase italic tracking-widest flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-500" /> Streaming Desteği
                   </h4>
                   <p className="text-[11px] text-slate-500 leading-relaxed">Gerçek zamanlı token üretimi için SSE streaming protokolünü destekler.</p>
                </div>
             </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
             <div className="bg-gradient-to-br from-cyan-600/20 to-brandDark border border-cyan-600/20 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic border-b border-white/5 pb-2">Log İzleyici</h3>
                <div className="h-48 overflow-y-auto font-mono text-[9px] text-slate-500 space-y-1 custom-scrollbar-hidden">
                   {isRunning ? (
                     <>
                        <p className="text-emerald-500">[SYSTEM] Server listening on port 3000</p>
                        <p>[AUTH] Antigravity token validated</p>
                        <p>[REQ] POST /v1/chat/completions (model: gemini-pro)</p>
                        <p className="animate-pulse text-cyan-400">[PROXY] Injecting tool calls...</p>
                     </>
                   ) : <p>[OFFLINE] Proxy sunucusu kapalı.</p>}
                </div>
             </div>

             <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/5 space-y-4">
                <div className="flex items-center gap-3">
                   <ShieldCheck className="w-5 h-5 text-cyan-500" />
                   <p className="text-[10px] font-black text-white uppercase tracking-widest">Güvenli Köprü</p>
                </div>
                <p className="text-[11px] text-slate-500 italic leading-relaxed">
                  "Ag2api-nodejs, yerel sisteminiz ile Antigravity bulut servisleri arasında şifreli bir köprü kurar."
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ag2ApiView;
