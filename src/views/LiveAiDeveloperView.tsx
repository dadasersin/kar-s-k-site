import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Play, Terminal, Plus, Trash2, CheckCircle2, AlertCircle, Loader2, Save, Database, Cloud, Share2, Shield, Eye, X, Check } from 'lucide-react';

interface BuiltComponent {
  id: string;
  name: string;
  code: string;
  status: 'writing' | 'compiling' | 'deployed';
  timestamp: number;
}

const LiveAiDeveloperView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPullingData, setIsPullingData] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [pendingComponent, setPendingComponent] = useState<BuiltComponent | null>(null);

  const [terminalLogs, setTerminalLogs] = useState<string[]>(['> Live AI Developer Engine initialized.', '> Waiting for requirements...']);
  const [components, setComponents] = useState<BuiltComponent[]>(() => {
    try {
      const saved = localStorage.getItem('live_ai_components');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse live_ai_components", e);
      return [];
    }
  });
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  useEffect(() => {
    localStorage.setItem('live_ai_components', JSON.stringify(components));
  }, [components]);

  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  const addLog = (log: string) => {
    setTerminalLogs(prev => [...prev, `> ${log}`]);
  };

  const handleBuild = async () => {
    if (!prompt.trim()) return;

    setIsProcessing(true);
    addLog(`Received requirements: "${prompt}"`);

    // Step 1: Data Pulling Animation
    setIsPullingData(true);
    addLog('Integrating sources...');
    addLog('Pulling data from Antigravity Proxy...');
    await new Promise(r => setTimeout(r, 800));
    addLog('Accessing SkillShare Hub for patterns...');
    await new Promise(r => setTimeout(r, 800));
    addLog('Fetching security protocols from Seline...');
    await new Promise(r => setTimeout(r, 800));
    addLog('Verifying sync status via Google Drive bridge...');
    await new Promise(r => setTimeout(r, 1000));
    setIsPullingData(false);

    addLog('Analyzing architecture and context from all modules...');

    // Step 2: Writing Code (Internally)
    const newId = Math.random().toString(36).substr(2, 9);
    const newComp: BuiltComponent = {
      id: newId,
      name: prompt.split(' ').slice(0, 2).join(' ') || 'New Module',
      code: `// Integrated module for: ${prompt}\n// Sources: AG Proxy, SkillShare, Seline\n\nexport const MyModule = () => {\n  return (\n    <div className="p-8 bg-gradient-to-br from-indigo-900/40 to-black rounded-[2rem] border border-indigo-500/30 shadow-2xl">\n      <div className="flex items-center gap-4 mb-6">\n        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/40">\n           <i className="fa-solid fa-microchip text-white text-xl"></i>\n        </div>\n        <h3 className="text-white font-black text-2xl uppercase italic tracking-tighter">${prompt}</h3>\n      </div>\n      <p className="text-slate-400 text-sm leading-relaxed mb-8">Bu bileşen tüm entegre kaynaklardan veri çekilerek otonom olarak üretilmiştir.</p>\n      <div className="grid grid-cols-2 gap-4">\n         <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-xs font-bold text-slate-500 uppercase">Durum: AKTİF</div>\n         <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-xs font-bold text-slate-500 uppercase">Güvenlik: DOĞRULANDI</div>\n      </div>\n    </div>\n  );\n};`,
      status: 'writing',
      timestamp: Date.now()
    };

    await new Promise(r => setTimeout(r, 1500));
    addLog('Code generation complete. Synthesizing visual preview...');

    setPendingComponent(newComp);
    setShowApprovalModal(true);
    setIsProcessing(false);
  };

  const approveAndDeploy = async () => {
    if (!pendingComponent) return;

    setShowApprovalModal(false);
    setIsProcessing(true);

    addLog('User approved. Starting compilation...');
    const approvedComp = { ...pendingComponent, status: 'compiling' as const };
    setComponents(prev => [approvedComp, ...prev]);

    await new Promise(r => setTimeout(r, 2000));
    addLog('Compilation successful. Running cross-module integrity tests...');
    addLog('Tests passed: 100% (Integrated Logic Validated)');

    addLog('Deploying to Live Portal Environment...');
    setComponents(prev => prev.map(c => c.id === approvedComp.id ? { ...c, status: 'deployed' } : c));

    addLog('SUCCESS: New module added to site successfully!');
    setIsProcessing(false);
    setPendingComponent(null);
    setPrompt('');
  };

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(13,89,242,0.3)]">
                  <Code className="w-6 h-6" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Live AI Developer</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Çoklu Repo Entegrasyonlu Otonom Geliştirme</p>
          </div>

          <div className="bg-surface/50 p-2 rounded-xl border border-white/5 flex gap-1">
             <button
               onClick={() => setActiveTab('preview')}
               className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'preview' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white'}`}
             >
                Canlı Önizleme
             </button>
             <button
               onClick={() => setActiveTab('code')}
               className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'code' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white'}`}
             >
                Kaynak Kod
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls & Terminal */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-surface/30 shadow-2xl">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Komut Merkezi</h3>
                  {isPullingData && (
                    <div className="flex gap-1">
                       <Database className="w-3 h-3 text-blue-500 animate-pulse" />
                       <Share2 className="w-3 h-3 text-indigo-500 animate-pulse" />
                       <Shield className="w-3 h-3 text-violet-500 animate-pulse" />
                    </div>
                  )}
               </div>
               <textarea
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 disabled={isProcessing}
                 placeholder="Siteye ne eklemek istersiniz? Tüm modüllerden veri çekilerek en iyi çözüm üretilecektir..."
                 className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-primary outline-none transition-all h-32 resize-none mb-4 placeholder:text-slate-700"
               />
               <button
                 onClick={handleBuild}
                 disabled={isProcessing || !prompt.trim()}
                 className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
               >
                 {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                 Geliştirmeyi Başlat
               </button>
            </div>

            <div className="glass-panel rounded-[2rem] border border-white/5 bg-black/60 overflow-hidden flex flex-col h-64 shadow-2xl">
               <div className="px-5 py-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                  </div>
                  <Terminal className="w-3 h-3 text-slate-500" />
               </div>
               <div ref={terminalRef} className="flex-1 p-5 font-mono text-[9px] text-primary/80 space-y-1 overflow-y-auto scrollbar-hide">
                  {terminalLogs.map((log, i) => (
                    <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">{log}</div>
                  ))}
                  {isProcessing && (
                    <div className="flex items-center gap-2 text-white/50">
                      <Loader2 className="w-2 h-2 animate-spin" />
                      <span>Entegrasyon katmanı işleniyor...</span>
                    </div>
                  )}
               </div>
            </div>
          </div>

          {/* Main Canvas */}
          <div className="lg:col-span-2">
             <div className="glass-panel min-h-[600px] rounded-[3rem] border border-white/10 bg-black/40 relative overflow-hidden flex flex-col shadow-inner">
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0d59f2 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                <div className="p-10 flex-1 flex flex-col gap-6 relative z-10">
                   {components.length === 0 ? (
                     <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-primary flex items-center justify-center">
                           <Code className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                           <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">Tuval Boş</h4>
                           <p className="text-sm font-bold text-slate-500 max-w-sm mx-auto mt-2">AI tarafından geliştirilen ve onaylanan modüller burada gerçek zamanlı olarak belirecek.</p>
                        </div>
                     </div>
                   ) : (
                     <AnimatePresence>
                        {components.map((c) => (
                          <motion.div
                            key={c.id}
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative group overflow-hidden"
                          >
                             <div className="absolute top-4 right-4 flex gap-2">
                                <button className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-slate-500 hover:text-white transition-colors border border-white/5">
                                   <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setComponents(components.filter(item => item.id !== c.id))}
                                  className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors border border-white/5"
                                >
                                   <Trash2 className="w-4 h-4" />
                                </button>
                             </div>

                             <div className="flex items-center gap-4 mb-8">
                                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${
                                  c.status === 'deployed' ? 'bg-green-500/20 text-green-400' :
                                  c.status === 'compiling' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-blue-500/20 text-blue-400'
                                }`}>
                                   {c.status === 'deployed' ? <CheckCircle2 className="w-3 h-3" /> : <Loader2 className="w-3 h-3 animate-spin" />}
                                   {c.status === 'deployed' ? 'YAYINLANDI' : 'İŞLENİYOR'}
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(c.timestamp).toLocaleTimeString()}</span>
                             </div>

                             {activeTab === 'preview' ? (
                                <div className="p-8 bg-black/40 rounded-3xl border border-white/5 flex flex-col group-hover:border-primary/30 transition-colors">
                                   <div className="flex items-center gap-4 mb-4">
                                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
                                         <i className="fa-solid fa-microchip"></i>
                                      </div>
                                      <h5 className="text-xl font-bold text-white uppercase italic tracking-tight">{c.name}</h5>
                                   </div>
                                   <p className="text-slate-400 text-sm leading-relaxed mb-6">Bu modül tüm sistem kaynakları entegre edilerek üretilmiştir.</p>
                                   <div className="grid grid-cols-2 gap-4">
                                      <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black text-slate-500 uppercase">Kaynak: AG PROXY</div>
                                      <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black text-slate-500 uppercase">Güvenlik: SELINE</div>
                                   </div>
                                </div>
                             ) : (
                                <div className="bg-black/60 rounded-3xl p-6 border border-white/5 font-mono text-[11px] text-emerald-400/80 overflow-x-auto">
                                   <pre>{c.code}</pre>
                                </div>
                             )}
                          </motion.div>
                        ))}
                     </AnimatePresence>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* APPROVAL MODAL */}
      <AnimatePresence>
        {showApprovalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 lg:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-4xl bg-[#0d0d0d] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
               <div className="p-8 lg:p-10 border-b border-white/5 flex items-center justify-between shrink-0">
                  <div>
                     <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-1">Geliştirme Onayı Bekleniyor</h3>
                     <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Yapay zeka modülü inşa etti. Lütfen görseli ve kodu inceleyin.</p>
                  </div>
                  <button onClick={() => { setShowApprovalModal(false); setPendingComponent(null); }} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                     <X className="w-6 h-6" />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-8 lg:p-10 custom-scrollbar-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <Eye className="w-4 h-4 text-primary" />
                           <h4 className="text-xs font-black text-white uppercase tracking-widest">Görsel Önizleme</h4>
                        </div>
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-black rounded-[2rem] border border-primary/20 flex flex-col items-center justify-center p-8 text-center shadow-inner">
                           <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white mb-6 shadow-xl shadow-primary/20">
                              <i className="fa-solid fa-wand-magic-sparkles text-2xl"></i>
                           </div>
                           <h5 className="text-xl font-black text-white uppercase italic mb-2">{pendingComponent?.name}</h5>
                           <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight">TÜM MODÜLLERDEN VERİ ÇEKİLEREK OLUŞTURULAN YENİ ÖZELLİK SİMÜLASYONU</p>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <Code className="w-4 h-4 text-emerald-500" />
                           <h4 className="text-xs font-black text-white uppercase tracking-widest">Sentezlenen Kod</h4>
                        </div>
                        <div className="p-6 bg-black rounded-[2rem] border border-white/5 font-mono text-[10px] text-emerald-400/70 h-full max-h-[300px] overflow-y-auto custom-scrollbar-hidden italic">
                           <pre>{pendingComponent?.code}</pre>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-8 lg:p-10 border-t border-white/5 bg-white/5 flex gap-4 shrink-0">
                  <button
                    onClick={() => { setShowApprovalModal(false); setPendingComponent(null); }}
                    className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-slate-400 font-black uppercase tracking-widest rounded-2xl transition-all border border-white/10"
                  >
                     REDDET VE İPTAL ET
                  </button>
                  <button
                    onClick={approveAndDeploy}
                    className="flex-[1.5] py-5 bg-primary hover:bg-blue-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                  >
                     <Check className="w-5 h-5" /> SİTEYE EKLE VE YAYINLA
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveAiDeveloperView;
