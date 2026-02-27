import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle, RefreshCw, Key, ShieldCheck, Zap, Globe, Layers, ArrowRightLeft, CheckCircle2, AlertTriangle, Monitor, Plus } from 'lucide-react';

const CodexSwitcherView: React.FC = () => {
  const [activeAccountId, setActiveAccountId] = useState('1');
  const [isSwitching, setIsSwitching] = useState(false);

  const accounts = [
    { id: '1', name: 'Premium Geliştirici', type: 'Pro', quota: '85%', status: 'Aktif', email: 'dev@ersingules.com' },
    { id: '2', name: 'Test Hesabı', type: 'Free', quota: '12%', status: 'Kısıtlı', email: 'test@ersingules.com' },
    { id: '3', name: 'Şirket Hesabı', type: 'Enterprise', quota: '99%', status: 'Beklemede', email: 'corp@company.com' },
  ];

  const handleSwitch = (id: string) => {
    if (id === activeAccountId) return;
    setIsSwitching(true);
    setTimeout(() => {
      setActiveAccountId(id);
      setIsSwitching(false);
    }, 2000);
  };

  const activeAccount = accounts.find(a => a.id === activeAccountId);

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark text-slate-200">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)] border border-white/20">
                  <ArrowRightLeft className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Codex Değiştirici</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Çoklu Codex ve IDE Hesap Yönetimi</p>
          </div>

          <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl shadow-blue-600/20">
             <Plus className="w-4 h-4" /> YENİ HESAP EKLE
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
             <div className="glass-panel rounded-[40px] p-8 lg:p-10 border border-white/5 bg-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                   <UserCircle className="w-48 h-48 text-blue-500" />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                   <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center relative">
                         <UserCircle className="w-10 h-10 text-blue-500" />
                         {isSwitching && (
                           <div className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center">
                              <RefreshCw className="w-6 h-6 text-white animate-spin" />
                           </div>
                         )}
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Şu Anda Aktif</p>
                         <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">{activeAccount?.name}</h3>
                      </div>
                   </div>
                   <div className="px-6 py-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 text-center">Üyelik Tipi</p>
                      <p className="text-xs font-bold text-blue-500 uppercase text-center">{activeAccount?.type}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                   {accounts.map(acc => (
                     <div
                        key={acc.id}
                        onClick={() => handleSwitch(acc.id)}
                        className={`p-6 rounded-3xl border transition-all cursor-pointer group ${activeAccountId === acc.id ? 'bg-blue-600/10 border-blue-500/40 shadow-lg' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                     >
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${activeAccountId === acc.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'}`}>
                                 <Monitor className="w-5 h-5" />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-white">{acc.name}</p>
                                 <p className="text-[10px] text-slate-500 font-medium">{acc.email}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-6">
                              <div className="text-right">
                                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Kota Durumu</p>
                                 <p className={`text-xs font-black italic ${parseInt(acc.quota) < 20 ? 'text-red-500' : 'text-emerald-500'}`}>{acc.quota}</p>
                              </div>
                              {activeAccountId === acc.id && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4">
                   <h4 className="text-white font-black text-xs uppercase italic tracking-widest flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-blue-500" /> Otomatik IDE Yenileme
                   </h4>
                   <p className="text-[11px] text-slate-500 leading-relaxed italic">"Hesap değiştirildiğinde Windsurf, Antigravity ve Cursor pencerelerini otomatik olarak yeniden başlatır."</p>
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4">
                   <h4 className="text-white font-black text-xs uppercase italic tracking-widest flex items-center gap-2">
                      <Key className="w-4 h-4 text-blue-500" /> OAuth 2.0 Güvenliği
                   </h4>
                   <p className="text-[11px] text-slate-500 leading-relaxed italic">"Resmi Codex API protokolü üzerinden güvenli token yenileme mekanizmasını kullanır."</p>
                </div>
             </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
             <div className="bg-gradient-to-br from-blue-600/20 to-brandDark border border-blue-600/20 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic border-b border-white/5 pb-2">Hızlı Ayarlar</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sistem Tepsisi (Tray)</span>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">AÇIK</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Arka Plan Yenileme</span>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">AÇIK</span>
                   </div>
                </div>
             </div>

             <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                   <AlertTriangle className="w-5 h-5 text-blue-500" />
                   <p className="text-[10px] font-black text-white uppercase tracking-widest">İçe / Dışa Aktar</p>
                </div>
                <p className="text-[11px] text-slate-500 italic leading-relaxed">
                  "Hesap verilerinizi yedeklemek veya başka bir cihaza taşımak için yapılandırma dosyasını dışa aktarabilirsiniz."
                </p>
                <div className="flex gap-2">
                   <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white text-[9px] font-black uppercase rounded-xl transition-all border border-white/5">DIŞA AKTAR</button>
                   <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white text-[9px] font-black uppercase rounded-xl transition-all border border-white/5">İÇE AKTAR</button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodexSwitcherView;
