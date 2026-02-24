import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Zap, AlertCircle, CheckCircle2, RefreshCw, Cpu, Activity, Database, Wrench, Bug, FileCode } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  source: string;
}

const SystemExpertView: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [systemHealth, setSystemHealth] = useState(98);
  const [activeTab, setActiveTab] = useState<'logs' | 'patches' | 'security'>('logs');

  useEffect(() => {
    const loadLogs = () => {
      const savedLogs = localStorage.getItem('system_error_logs');
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs).reverse());
      }
    };

    loadLogs();
    const interval = setInterval(loadLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  const runRepair = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setSystemHealth(100);
      localStorage.removeItem('system_error_logs');
      setLogs([]);
    }, 3000);
  };

  const commonPatches = [
    { id: 'p1', title: 'CORS Media Resolver', desc: 'TV yayınlarındaki erişim engellerini aşmak için proxy rotasyonunu optimize eder.', status: 'Active' },
    { id: 'p2', title: 'API Failover Engine', desc: 'Borsa ve Kripto verileri için yedek veri kaynaklarını devreye sokar.', status: 'Standby' },
    { id: 'p3', title: 'Memory Leak Patch', desc: 'Uzun süreli oturumlarda RAM kullanımını optimize eder.', status: 'Active' },
    { id: 'p4', title: 'Turkish Voice Assistant Fix', desc: 'Sesli komutlardaki aksan algılama hassasiyetini artırır.', status: 'Update Ready' }
  ];

  return (
    <div className="p-4 lg:p-8 h-full overflow-y-auto pb-32 bg-brandDark">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                  <Shield className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Kodlama Uzmanı</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Otonom Sistem Analizi & Hotfix Merkezi</p>
          </div>

          <div className="flex gap-3">
             <button
               onClick={runRepair}
               disabled={isAnalyzing}
               className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl shadow-indigo-600/20"
             >
                {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wrench className="w-4 h-4" />}
                {isAnalyzing ? 'Onarılıyor...' : 'SİSTEMİ ONAR'}
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Stats Panel */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-8">
                 <div className="text-center space-y-2">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Sistem Sağlığı</p>
                    <div className="text-6xl font-black text-white italic">%{systemHealth}</div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mt-4">
                       <div className={`h-full transition-all duration-1000 ${systemHealth > 90 ? 'bg-indigo-500' : 'bg-amber-500'}`} style={{ width: `${systemHealth}%` }}></div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                       <div className="flex items-center gap-3">
                          <Activity className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs font-bold text-slate-400">Aktif Modüller</span>
                       </div>
                       <span className="text-xs font-black text-white">28/28</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                       <div className="flex items-center gap-3">
                          <Cpu className="w-4 h-4 text-blue-500" />
                          <span className="text-xs font-bold text-slate-400">CPU Yükü</span>
                       </div>
                       <span className="text-xs font-black text-white">%12</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                       <div className="flex items-center gap-3">
                          <Database className="w-4 h-4 text-purple-500" />
                          <span className="text-xs font-bold text-slate-400">Veri Havuzu</span>
                       </div>
                       <span className="text-xs font-black text-white">4.2 GB</span>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                       <Shield className="w-5 h-5 text-indigo-500" />
                       <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">Güvenli mod aktif. Tüm işlemler şifrelenmiş tünel üzerinden yürütülüyor.</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Console & Analysis Panel */}
           <div className="lg:col-span-3 space-y-6">
              <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit border border-white/10 mb-2">
                 {(['logs', 'patches', 'security'] as const).map(tab => (
                   <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                   >
                     {tab === 'logs' ? 'HATA GÜNLÜĞÜ' : tab === 'patches' ? 'HOTFIX MERKEZİ' : 'GÜVENLİK DUVARI'}
                   </button>
                 ))}
              </div>

              <div className="bg-black/40 border border-white/10 rounded-[3rem] min-h-[500px] overflow-hidden flex flex-col">
                 {activeTab === 'logs' ? (
                   <>
                    <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Terminal className="w-4 h-4 text-indigo-500" />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">Sistem Konsolu</span>
                       </div>
                       <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                          <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                          <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                       </div>
                    </div>
                    <div className="flex-1 p-6 font-mono text-[11px] overflow-y-auto max-h-[400px] custom-scrollbar space-y-3">
                       {logs.length === 0 ? (
                         <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-20">
                            <CheckCircle2 className="w-12 h-12 mb-4 text-emerald-500" />
                            <p className="uppercase tracking-[0.3em]">Hata Algılanmadı. Sistem Stabil.</p>
                         </div>
                       ) : (
                         logs.map(log => (
                           <div key={log.id} className={`p-4 rounded-xl border flex gap-4 ${log.type === 'error' ? 'bg-red-500/5 border-red-500/10' : 'bg-amber-500/5 border-amber-500/10'}`}>
                              <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                              <span className={`font-bold shrink-0 ${log.type === 'error' ? 'text-red-500' : 'text-amber-500'}`}>{log.type.toUpperCase()}</span>
                              <div className="space-y-1">
                                 <p className="text-slate-300 break-all">{log.message}</p>
                                 <p className="text-[9px] text-slate-500 italic">Kaynak: {log.source}</p>
                              </div>
                           </div>
                         ))
                       )}
                    </div>
                   </>
                 ) : activeTab === 'patches' ? (
                   <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {commonPatches.map(patch => (
                        <div key={patch.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-indigo-500/50 transition-all group">
                           <div className="flex justify-between items-start mb-4">
                              <div className="p-3 bg-indigo-600/10 rounded-2xl">
                                 <Zap className="w-5 h-5 text-indigo-500" />
                              </div>
                              <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full border ${patch.status === 'Active' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-blue-500 border-blue-500/20 bg-blue-500/5'}`}>
                                 {patch.status}
                              </span>
                           </div>
                           <h4 className="text-sm font-black text-white uppercase mb-2">{patch.title}</h4>
                           <p className="text-[10px] text-slate-500 leading-relaxed mb-6 font-bold">{patch.desc}</p>
                           <button className="w-full py-3 bg-white/5 group-hover:bg-indigo-600 text-[9px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest rounded-xl transition-all border border-white/5">
                              YAMAYI UYGULA
                           </button>
                        </div>
                      ))}
                   </div>
                 ) : (
                   <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                      <Shield className="w-20 h-20 text-indigo-600 mb-8 animate-pulse" />
                      <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">Quantum Firewall v4.0</h3>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest max-w-sm">
                         Sistem trafiği gerçek zamanlı olarak taranıyor. Hiçbir yetkisiz erişim teşebbüsü saptanmadı.
                      </p>
                      <div className="mt-12 grid grid-cols-2 gap-8 w-full max-w-md">
                         <div className="space-y-1">
                            <p className="text-white font-black text-xl">1.2M+</p>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Bloke Edilen İstek</p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-white font-black text-xl">0</p>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Sızıntı</p>
                         </div>
                      </div>
                   </div>
                 )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-8 bg-indigo-600/5 border border-indigo-600/10 rounded-[2.5rem] flex items-center gap-6 group hover:bg-indigo-600/10 transition-all cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 flex items-center justify-center shrink-0">
                       <FileCode className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                       <h5 className="text-white font-black text-sm uppercase italic">Kod Analizi</h5>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Runtime optimizasyonu sağla</p>
                    </div>
                 </div>
                 <div className="p-8 bg-purple-600/5 border border-purple-600/10 rounded-[2.5rem] flex items-center gap-6 group hover:bg-purple-600/10 transition-all cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-purple-600/20 flex items-center justify-center shrink-0">
                       <Bug className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                       <h5 className="text-white font-black text-sm uppercase italic">Hata Avcısı</h5>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Derinlemesine stack trace taraması</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SystemExpertView;
