import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Zap, Layers, RefreshCw, Key, UserCheck, AlertTriangle, CheckCircle2, Info, ArrowRightLeft, Globe, Terminal } from 'lucide-react';

const QuotioView: React.FC = () => {
  const [failoverEnabled, setFailoverEnabled] = useState(true);
  const [activeProvider, setActiveProvider] = useState('Gemini Pro');
  const [isRotating, setIsRotating] = useState(false);

  const providers = [
    { id: '1', name: 'Gemini 1.5 Pro', quota: '92%', status: 'Aktif', latency: '420ms', type: 'Birincil' },
    { id: '2', name: 'Claude 3.5 Sonnet', quota: '45%', status: 'Beklemede', latency: '850ms', type: 'Yedek' },
    { id: '3', name: 'GPT-4o', quota: '12%', status: 'Kısıtlı', latency: '1.2s', type: 'Yedek' },
    { id: '4', name: 'DeepSeek V3', quota: '98%', status: 'Aktif', latency: '310ms', type: 'Yedek' },
  ];

  const triggerFailover = () => {
    setIsRotating(true);
    setTimeout(() => {
      setActiveProvider('DeepSeek V3');
      setIsRotating(false);
    }, 2000);
  };

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark text-slate-200">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.4)] border border-white/20">
                  <ShieldAlert className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Quotio Failover</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Akıllı Model Failover ve Kota Yönetim Sistemi</p>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Otomatik Failover</span>
                <button
                  onClick={() => setFailoverEnabled(!failoverEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${failoverEnabled ? 'bg-orange-600' : 'bg-slate-800'}`}
                >
                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${failoverEnabled ? 'left-7' : 'left-1'}`}></div>
                </button>
             </div>
             <button
               onClick={triggerFailover}
               disabled={isRotating}
               className="px-8 py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl shadow-orange-600/20"
             >
               {isRotating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRightLeft className="w-4 h-4" />}
               {isRotating ? 'ROTASYON YAPILIYOR...' : 'MANUEL FAILOVER'}
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Failover Status Panel */}
          <div className="lg:col-span-8 space-y-8">
             <div className="glass-panel rounded-[40px] p-8 lg:p-10 border border-white/5 bg-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                   <Zap className="w-48 h-48 text-orange-500" />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                   <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-3xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center">
                         <Globe className="w-10 h-10 text-orange-500 animate-pulse" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Şu Anda Aktif Olan</p>
                         <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">{activeProvider}</h3>
                      </div>
                   </div>
                   <div className="px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                      <div className="text-left">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sistem Sağlığı</p>
                         <p className="text-xs font-bold text-emerald-500 uppercase">KRİTİK HATA YOK</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {providers.map(provider => (
                     <div key={provider.id} className={`p-6 rounded-[2rem] border transition-all ${activeProvider === provider.name ? 'bg-orange-600/10 border-orange-500/40 shadow-lg' : 'bg-black/40 border-white/5 opacity-60'}`}>
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeProvider === provider.name ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                 <Layers className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-bold text-white">{provider.name}</span>
                           </div>
                           <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${provider.type === 'Birincil' ? 'bg-blue-600/20 text-blue-500' : 'bg-slate-800 text-slate-500'}`}>{provider.type}</span>
                        </div>
                        <div className="flex justify-between items-end">
                           <div>
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Gecikme</p>
                              <p className="text-sm font-bold text-slate-300 italic">{provider.latency}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Kota</p>
                              <p className={`text-sm font-black italic ${parseInt(provider.quota) < 20 ? 'text-red-500' : 'text-emerald-500'}`}>{provider.quota}</p>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4">
                   <div className="flex items-center gap-3 text-orange-500">
                      <Terminal className="w-5 h-5" />
                      <h4 className="text-xs font-black uppercase italic tracking-widest">Olay Günlüğü</h4>
                   </div>
                   <div className="font-mono text-[10px] text-slate-500 space-y-2 max-h-40 overflow-y-auto custom-scrollbar-hidden">
                      <p>[12:45:01] INFO: Gemini API kotası %92 dolu. Failover hazır.</p>
                      <p>[12:52:14] WARN: Claude 3.5 Sonnet gecikmesi 850ms üzerine çıktı.</p>
                      <p>[13:10:05] SYSTEM: Otomatik failover rotasyonu test edildi. Başarılı.</p>
                      <p className="text-orange-500 animate-pulse">[BEKLEMEDE] Failover dinleyicisi aktif...</p>
                   </div>
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col justify-center gap-4">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center">
                         <UserCheck className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                         <h5 className="text-white font-black text-sm uppercase italic">Hesap Merkezi</h5>
                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Bağlı Hesap: ersingules_admin</p>
                      </div>
                   </div>
                   <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">HESAP DEĞİŞTİR</button>
                </div>
             </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-gradient-to-br from-orange-600/20 to-brandDark border border-orange-600/20 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic border-b border-white/5 pb-2">Failover Ayarları</h3>
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hata Eşiği (Latency)</span>
                      <span className="text-xs font-black text-white italic">1.5s</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Min. Kota Eşiği</span>
                      <span className="text-xs font-black text-red-500 italic">%5</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Akıllı Seçim</span>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded">AKTİF</span>
                   </div>
                </div>

                <div className="mt-10 p-6 bg-orange-500/5 rounded-3xl border border-orange-500/20">
                   <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Sistem Uyarısı</p>
                   </div>
                   <p className="text-[11px] text-slate-500 italic leading-relaxed">
                     "Failover rotasyonu, API isteklerinizin kesintisiz devam etmesi için en sağlıklı modeli otomatik olarak seçer."
                   </p>
                </div>
             </div>

             <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/5 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                   <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                   <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Failover Hazır</p>
                      <p className="text-sm font-black text-white uppercase italic">TAM KORUMA</p>
                   </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed italic border-t border-white/5 pt-4">
                  "Quotio protokolü, CLI ve Web tabanlı tüm istekleri yerel failover motoru üzerinden yönlendirir."
                </p>
                <button className="w-full py-4 bg-orange-600/10 hover:bg-orange-600 text-orange-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                   <Key className="w-4 h-4" /> API ANAHTARLARINI YÖNET
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotioView;
