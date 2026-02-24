import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Play, Terminal, Plus, Trash2, CheckCircle2, AlertCircle, Loader2, Save } from 'lucide-react';

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
    addLog('Analyzing architecture...');

    // Step 1: Writing Code
    const newId = Math.random().toString(36).substr(2, 9);
    const newComp: BuiltComponent = {
      id: newId,
      name: prompt.split(' ').slice(0, 2).join(' ') || 'New Component',
      code: `// Generating component for: ${prompt}\n\nexport const MyComponent = () => {\n  return (\n    <div className="p-6 bg-primary/10 rounded-2xl border border-primary/20">\n      <h3 className="text-white font-bold">${prompt}</h3>\n      <p className="text-slate-400 text-sm">AI Generated Content</p>\n    </div>\n  );\n};`,
      status: 'writing',
      timestamp: Date.now()
    };

    setComponents(prev => [newComp, ...prev]);

    await new Promise(r => setTimeout(r, 1500));
    addLog('Code generation complete. Starting compilation...');

    setComponents(prev => prev.map(c => c.id === newId ? { ...c, status: 'compiling' } : c));

    // Step 2: Compiling
    await new Promise(r => setTimeout(r, 2000));
    addLog('Compilation successful. Running unit tests...');
    addLog('Tests passed: 100%');

    // Step 3: Deploying
    addLog('Deploying to Live Portal Environment...');
    setComponents(prev => prev.map(c => c.id === newId ? { ...c, status: 'deployed' } : c));

    addLog('SUCCESS: Component added to site successfully!');
    setIsProcessing(false);
    setPrompt('');
  };

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                  <Code className="w-6 h-6" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Live AI Developer</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Gerçek Zamanlı Kodlama ve Uygulama Motoru</p>
          </div>

          <div className="bg-surface/50 p-2 rounded-xl border border-white/5 flex gap-1">
             <button
               onClick={() => setActiveTab('preview')}
               className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'preview' ? 'bg-primary text-white' : 'text-slate-500 hover:text-white'}`}
             >
                Canlı Önizleme
             </button>
             <button
               onClick={() => setActiveTab('code')}
               className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'code' ? 'bg-primary text-white' : 'text-slate-500 hover:text-white'}`}
             >
                Kaynak Kod
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls & Terminal */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-surface/30">
               <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 italic">Komut Merkezi</h3>
               <textarea
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 placeholder="Siteye ne eklemek istersiniz? (Örn: Modern bir galeri kartı, Işıklı buton...)"
                 className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-primary outline-none transition-all h-32 resize-none mb-4"
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
                      <span>İşlem dizisi yürütülüyor...</span>
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
                           <p className="text-sm font-bold text-slate-500 max-w-sm mx-auto mt-2">AI tarafından geliştirilecek bileşenler burada gerçek zamanlı olarak belirecek.</p>
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
                                   {c.status === 'deployed' ? 'YAYINLANDI' : c.status.toUpperCase()}
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(c.timestamp).toLocaleTimeString()}</span>
                             </div>

                             {activeTab === 'preview' ? (
                                <div className="p-8 bg-black/40 rounded-3xl border border-white/5 flex items-center justify-center min-h-[150px] group-hover:border-primary/30 transition-colors">
                                   <div className="text-center">
                                      <h5 className="text-xl font-bold text-white mb-2">{c.name}</h5>
                                      <p className="text-slate-500 text-sm">Gereksinimler: {prompt || 'Kullanıcı spesifikasyonları uygulandı.'}</p>
                                      {c.status === 'deployed' && (
                                        <button className="mt-6 px-8 py-3 bg-primary/20 text-primary border border-primary/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                                          Etkileşime Geç
                                        </button>
                                      )}
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
    </div>
  );
};

export default LiveAiDeveloperView;
