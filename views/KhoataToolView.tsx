import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, ShieldCheck, Lock, Unlock, RefreshCw, Smartphone, Eye, EyeOff, Terminal, CheckCircle2, AlertCircle, Cpu, Fingerprint } from 'lucide-react';

const KhoataToolView: React.FC = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTokens, setShowTokens] = useState(false);

  const handleToggleLock = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsLocked(!isLocked);
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark text-slate-200">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] border border-white/20">
                  <Fingerprint className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Khoata Güvenlik</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Erişim Anahtarları ve Token Yönetim Paneli</p>
          </div>

          <button
            onClick={handleToggleLock}
            disabled={isRefreshing}
            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl ${isLocked ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20' : 'bg-red-600 hover:bg-red-500 shadow-red-600/20'} text-white`}
          >
            {isRefreshing ? <RefreshCw className="w-4 h-4 animate-spin" /> : isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {isRefreshing ? 'İŞLENİYOR...' : isLocked ? 'SİSTEM KİLİDİNİ AÇ' : 'SİSTEMİ KİLİTLE'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
             <div className="glass-panel rounded-[40px] p-8 lg:p-12 border border-white/5 bg-white/5 shadow-2xl relative overflow-hidden text-center flex flex-col items-center">
                <div className={`absolute inset-0 transition-all duration-1000 ${isLocked ? 'bg-black/80 backdrop-blur-md opacity-100 z-20' : 'opacity-0 pointer-events-none -z-10'}`}>
                   <div className="h-full flex flex-col items-center justify-center space-y-6">
                      <div className="w-24 h-24 rounded-full border-4 border-white/5 flex items-center justify-center">
                         <Lock className="w-10 h-10 text-white animate-pulse" />
                      </div>
                      <p className="text-sm font-black uppercase tracking-[0.5em] text-white">SİSTEM KİLİTLİ</p>
                   </div>
                </div>

                <div className="w-20 h-20 rounded-3xl bg-emerald-600/10 flex items-center justify-center mb-8 border border-emerald-500/20">
                   <ShieldCheck className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase italic mb-8 tracking-tighter">Aktif Oturum Tokenları</h3>

                <div className="w-full space-y-4">
                   {[
                     { name: 'Gemini Session', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', expires: '12s' },
                     { name: 'Antigravity Bridge', token: 'ag_bridge_a87f2b1c9e3d4f5...', expires: '1h 45m' },
                     { name: 'Cursor Socket', token: 'ws_token_8892_fbc32...', expires: 'Süresiz' },
                   ].map(t => (
                     <div key={t.name} className="p-5 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                        <div className="text-left">
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.name}</p>
                           <p className="text-xs font-mono text-slate-300">{showTokens ? t.token : '*************************'}</p>
                        </div>
                        <div className="text-right flex items-center gap-4">
                           <span className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest">{t.expires}</span>
                           <button onClick={() => setShowTokens(!showTokens)} className="text-slate-500 hover:text-white transition-colors">
                              {showTokens ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center gap-6 group hover:border-emerald-500/50 transition-all shadow-xl">
                   <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 flex items-center justify-center shrink-0">
                      <Smartphone className="w-6 h-6 text-emerald-500" />
                   </div>
                   <div>
                      <h5 className="text-white font-black text-sm uppercase italic">Mobil Onay</h5>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">2FA Bekleniyor</p>
                   </div>
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center gap-6 group hover:border-emerald-500/50 transition-all shadow-xl">
                   <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 flex items-center justify-center shrink-0">
                      <Cpu className="w-6 h-6 text-emerald-500" />
                   </div>
                   <div>
                      <h5 className="text-white font-black text-sm uppercase italic">Donanım Anahtarı</h5>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">YubiKey Algılandı</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
             <div className="bg-gradient-to-br from-emerald-600/20 to-brandDark border border-emerald-600/20 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic border-b border-white/5 pb-2">Güvenlik Logları</h3>
                <div className="space-y-4 font-mono text-[9px] text-slate-500">
                   <div className="border-l-2 border-emerald-500 pl-3">
                      <p className="text-emerald-500">[16:45] Session initialized</p>
                      <p>IP: 192.168.1.45</p>
                   </div>
                   <div className="border-l-2 border-slate-700 pl-3">
                      <p>[16:42] Token refresh: SUCCESS</p>
                   </div>
                   <div className="border-l-2 border-red-500 pl-3">
                      <p className="text-red-500">[16:30] Failed login attempt</p>
                      <p>IP: 104.22.7.12</p>
                   </div>
                </div>
             </div>

             <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                   <AlertCircle className="w-5 h-5 text-emerald-500" />
                   <p className="text-[10px] font-black text-white uppercase tracking-widest">Önemli Uyarı</p>
                </div>
                <p className="text-[11px] text-slate-500 italic leading-relaxed">
                  "Khoata-tool, tüm YZ servisleriniz için merkezi bir kimlik doğrulama katmanı sağlar."
                </p>
                <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5">TÜM TOKENLARI SIFIRLA</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KhoataToolView;
