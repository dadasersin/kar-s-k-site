import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Terminal, Settings, Box, RefreshCw, Send, CheckCircle2, AlertTriangle, Cpu, Monitor, Zap, History } from 'lucide-react';

const CursorBridgeView: React.FC = () => {
  const [serverStatus, setServerStatus] = useState<'offline' | 'online'>('offline');
  const [queueLength, setQueueLength] = useState(0);
  const [inputText, setInputText] = useState('');

  const toggleServer = () => {
    setServerStatus(prev => prev === 'online' ? 'offline' : 'online');
    if (serverStatus === 'offline') setQueueLength(2);
    else setQueueLength(0);
  };

  const handleInject = () => {
    if (!inputText.trim()) return;
    setQueueLength(prev => prev + 1);
    setInputText('');
    setTimeout(() => setQueueLength(prev => Math.max(0, prev - 1)), 2000);
  };

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark text-slate-200">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.4)] border border-white/20">
                  <Network className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Cursor AI Köprüsü</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Harici Uygulamaları Cursor Chat'e Bağlayın</p>
          </div>

          <button
            onClick={toggleServer}
            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl ${serverStatus === 'online' ? 'bg-red-600 hover:bg-red-500 shadow-red-600/20' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'} text-white`}
          >
            {serverStatus === 'online' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Terminal className="w-4 h-4" />}
            {serverStatus === 'online' ? 'SERVİSİ DURDUR' : 'BRIDGE SERVİSİNİ BAŞLAT'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
             <div className="glass-panel rounded-[40px] p-8 lg:p-10 border border-white/5 bg-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                   <Zap className="w-48 h-48 text-indigo-500" />
                </div>

                <div className="flex justify-between items-center mb-12">
                   <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                      <Monitor className="w-6 h-6 text-indigo-500" /> Enjeksiyon Paneli
                   </h3>
                   <div className="flex gap-4">
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Kuyruk Durumu</p>
                         <p className="text-sm font-black text-white italic">{queueLength} İstek Bekliyor</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="p-8 bg-indigo-600/5 border border-indigo-500/20 rounded-[2.5rem] relative group">
                      <label className="absolute -top-3 left-8 px-4 bg-[#111111] text-[10px] font-black text-indigo-500 uppercase tracking-widest italic">Cursor Chat'e Enjekte Et</label>
                      <div className="flex gap-4">
                         <textarea
                           value={inputText}
                           onChange={(e) => setInputText(e.target.value)}
                           placeholder="Cursor sohbetine gönderilecek metni buraya yazın..."
                           className="flex-1 bg-transparent border-none outline-none text-sm text-slate-300 h-24 resize-none placeholder:text-slate-700 italic font-medium"
                         />
                         <button
                           onClick={handleInject}
                           disabled={serverStatus === 'offline' || !inputText.trim()}
                           className="w-16 h-16 bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl flex items-center justify-center transition-all shadow-xl disabled:opacity-50 self-end"
                         >
                            <Send className="w-6 h-6" />
                         </button>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-6 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-500">
                               <Settings className="w-5 h-5" />
                            </div>
                            <div>
                               <p className="text-xs font-bold text-white">HTTP Port</p>
                               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Default: 9999</p>
                            </div>
                         </div>
                         <span className="text-sm font-mono text-indigo-400">9999</span>
                      </div>
                      <div className="p-6 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-500">
                               <Cpu className="w-5 h-5" />
                            </div>
                            <div>
                               <p className="text-xs font-bold text-white">OS Entegrasyonu</p>
                               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Klavye Simülasyonu</p>
                            </div>
                         </div>
                         <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
             <div className="bg-gradient-to-br from-indigo-600/20 to-brandDark border border-indigo-600/20 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic border-b border-white/5 pb-2">Bridge Durumu</h3>
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sunucu</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${serverStatus === 'online' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>{serverStatus === 'online' ? 'AKTİF' : 'KAPALI'}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cursor Bağlantısı</span>
                      <span className="text-xs font-black text-white italic">{serverStatus === 'online' ? 'BAĞLI' : 'BEKLENİYOR'}</span>
                   </div>
                </div>
             </div>

             <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/5 space-y-4">
                <div className="flex items-center gap-3">
                   <History className="w-5 h-5 text-indigo-500" />
                   <p className="text-[10px] font-black text-white uppercase tracking-widest">Son İşlemler</p>
                </div>
                <div className="font-mono text-[9px] text-slate-500 space-y-2">
                   <p className="border-l border-white/10 pl-3">[14:30] GET /health (200 OK)</p>
                   <p className="border-l border-white/10 pl-3">[14:32] POST /inject (queued)</p>
                   <p className="border-l border-white/10 pl-3 text-emerald-500">[14:33] Success: Keyboard input simulated</p>
                </div>
             </div>

             <div className="p-8 bg-indigo-600/5 border border-indigo-500/10 rounded-[40px]">
                <p className="text-[11px] text-slate-500 italic leading-relaxed">
                  "Cursor-ai-bridge, yerel bir HTTP sunucusu kurarak herhangi bir otomasyon aracının Cursor içindeki YZ ile konuşmasını sağlar."
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CursorBridgeView;
