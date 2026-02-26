import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Terminal, Settings, Box, RefreshCw, Send, CheckCircle2, AlertTriangle, Cpu, Monitor, Zap, History, Link2, Rocket, Cloud } from 'lucide-react';

const CursorProxyView: React.FC = () => {
  const [proxyRunning, setProxyRunning] = useState(false);
  const [tunnelUrl, setTunnelUrl] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const startProxy = () => {
    setIsStarting(true);
    setTimeout(() => {
      setProxyRunning(true);
      setTunnelUrl('https://ag-proxy-' + Math.random().toString(36).substring(7) + '.trycloudflare.com/v1');
      setIsStarting(false);
    }, 2500);
  };

  const stopProxy = () => {
    setProxyRunning(false);
    setTunnelUrl('');
  };

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark text-slate-200">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.4)] border border-white/20">
                  <Rocket className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Cursor AG Proxy</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Cursor IDE İçin Antigravity Köprüsü</p>
          </div>

          <button
            onClick={proxyRunning ? stopProxy : startProxy}
            disabled={isStarting}
            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl ${proxyRunning ? 'bg-red-600 hover:bg-red-500 shadow-red-600/20' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'} text-white`}
          >
            {isStarting ? <RefreshCw className="w-4 h-4 animate-spin" /> : proxyRunning ? <Zap className="w-4 h-4" /> : <Rocket className="w-4 h-4" />}
            {isStarting ? 'BAŞLATILIYOR...' : proxyRunning ? 'PROXY DURDUR' : 'PROXY BAŞLAT'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
             <div className="glass-panel rounded-[40px] p-8 lg:p-10 border border-white/5 bg-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                   <Cloud className="w-48 h-48 text-indigo-500" />
                </div>

                <div className="flex justify-between items-center mb-12">
                   <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                      <Terminal className="w-6 h-6 text-indigo-500" /> Yapılandırma Paneli
                   </h3>
                   <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${proxyRunning ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-800 text-slate-500 border border-white/5'}`}>
                      {proxyRunning ? 'BAĞLANTI AKTİF' : 'OFFLINE'}
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="p-8 bg-black/40 border border-white/10 rounded-3xl relative group">
                      <label className="absolute -top-3 left-8 px-4 bg-[#111111] text-[10px] font-black text-indigo-500 uppercase tracking-widest italic">Cursor Base URL (OpenAI)</label>
                      <div className="flex items-center justify-between">
                         <p className={`text-sm font-mono ${tunnelUrl ? 'text-indigo-400' : 'text-slate-600 italic'}`}>
                           {tunnelUrl || 'Proxy başlatıldığında URL burada görünecektir...'}
                         </p>
                         {tunnelUrl && (
                           <button
                             onClick={() => navigator.clipboard.writeText(tunnelUrl)}
                             className="text-indigo-500 hover:text-white transition-colors"
                           >
                              <Link2 className="w-5 h-5" />
                           </button>
                         )}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-6 bg-black/40 border border-white/5 rounded-2xl flex flex-col gap-2">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Çalışma Modu</p>
                         <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-bold text-white">Cloudflare Quick Tunnel</span>
                         </div>
                      </div>
                      <div className="p-6 bg-black/40 border border-white/5 rounded-2xl flex flex-col gap-2">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Yerel Sunucu</p>
                         <div className="flex items-center gap-2">
                            <Server className="w-4 h-4 text-indigo-500" />
                            <span className="text-xs font-bold text-white">localhost:3000</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4">
                   <h4 className="text-white font-black text-xs uppercase italic tracking-widest flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-indigo-500" /> Desteklenen Modeller
                   </h4>
                   <div className="flex flex-wrap gap-2">
                      {['ag-pro', 'ag-flash', 'ag-sonnet', 'ag-haiku'].map(m => (
                        <span key={m} className="text-[10px] font-bold px-3 py-1 bg-white/5 text-slate-400 rounded-lg">{m}</span>
                      ))}
                   </div>
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4">
                   <h4 className="text-white font-black text-xs uppercase italic tracking-widest flex items-center gap-2">
                      <History className="w-4 h-4 text-indigo-500" /> Son Aktiviteler
                   </h4>
                   <div className="font-mono text-[9px] text-slate-500 space-y-1">
                      <p>[INFO] Proxy listening on port 3000</p>
                      <p>[AUTH] Session tokens extracted</p>
                      <p className="text-indigo-400 animate-pulse">[TUNNEL] Secure HTTPS established</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
             <div className="bg-gradient-to-br from-indigo-600/20 to-brandDark border border-indigo-600/20 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic border-b border-white/5 pb-2">Hızlı Kurulum</h3>
                <ol className="space-y-4">
                   <li className="flex gap-3">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center shrink-0">1</span>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">Proxy servisini başlatın.</p>
                   </li>
                   <li className="flex gap-3">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center shrink-0">2</span>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">Üretilen URL'yi kopyalayın.</p>
                   </li>
                   <li className="flex gap-3">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center shrink-0">3</span>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">Cursor Ayarlarında 'OpenAI Base URL' kısmına yapıştırın.</p>
                   </li>
                </ol>
             </div>

             <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/5 space-y-4">
                <div className="flex items-center gap-3">
                   <AlertTriangle className="w-5 h-5 text-amber-500" />
                   <p className="text-[10px] font-black text-white uppercase tracking-widest">Önemli Not</p>
                </div>
                <p className="text-[11px] text-slate-500 italic leading-relaxed">
                  "Bu proxy, yerel Antigravity oturumunuzu kullanarak çalışır. Lütfen VS Code/Antigravity'de oturumunuzun açık olduğundan emin olun."
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Server = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  </svg>
);

export default CursorProxyView;
