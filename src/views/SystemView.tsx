import React from 'react';

const SystemView: React.FC = () => {
  const modules = [
    { name: 'Neural Reasoning', status: 'Optimal', load: '42%', color: 'text-primary' },
    { name: 'Creative Synthesis', status: 'Active', load: '18%', color: 'text-purple-400' },
    { name: 'Temporal Processing', status: 'Standby', load: '0%', color: 'text-blue-400' },
    { name: 'Jules External Sync', status: 'Connected', load: '100%', color: 'text-emerald-400' },
  ];

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-panel rounded-[40px] p-10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Core Online & Synced</span>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white uppercase mb-4">Autonomous Intelligence</h2>
            <p className="text-gray-400 max-w-2xl leading-relaxed mb-10 text-sm">
              Yapay Zeka Merkezi operates with full authorization. System is currently linked to <span className="text-primary font-bold">Jules Session Protocol</span> for enhanced high-level reasoning.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.map((m, i) => (
                <div key={i} className="p-6 bg-black/40 border border-white/5 rounded-3xl group hover:border-primary/30 transition-all shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{m.name}</h3>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 rounded-lg ${m.color}`}>{m.status}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-black italic text-white">{m.load}</div>
                    <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full bg-current ${m.color} transition-all duration-1000`} style={{ width: m.load }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[40px] p-10 relative overflow-hidden shadow-xl">
            <h3 className="text-xl font-black italic tracking-tighter text-white uppercase mb-6 flex items-center gap-3">
              <i className="fa-solid fa-terminal text-primary"></i>
              Command Execution Log
            </h3>
            <div className="space-y-4 font-mono text-[10px] text-gray-500">
              <div className="flex gap-4 p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-primary">[14:22:01]</span>
                <span className="text-gray-300">USER_AUTH_LEVEL: MASTER_ERSIN_GULES</span>
              </div>
              <div className="flex gap-4 p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-primary">[14:25:12]</span>
                <span className="text-emerald-400 italic font-bold">JULES_SESSION: INITIALIZING EXTERNAL HANDSHAKE...</span>
              </div>
              <div className="flex gap-4 p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-primary">[14:25:15]</span>
                <span className="text-emerald-500 font-bold uppercase">Link Established: Remote Access Granted</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8 h-full">
          <div className="bg-gradient-to-br from-primary/20 to-brandDark border border-primary/20 rounded-[40px] p-10 relative overflow-hidden h-full flex flex-col shadow-2xl">
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 blur-[80px] rounded-full"></div>
            <h3 className="text-xl font-black italic tracking-tighter text-white uppercase mb-8 border-b border-white/5 pb-2">AI Overrides</h3>

            <div className="space-y-6 flex-1">
              <ToggleItem label="Self-Modification" desc="Allow AI to rewrite UI" active />
              <ToggleItem label="Global Search" desc="Real-time data streams" active />
              <ToggleItem label="Session Sync" desc="Jules external link" active color="bg-emerald-500" />
            </div>

            <div className="mt-auto p-6 bg-primary/10 border border-primary/20 rounded-3xl">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 italic">Remote Notice</p>
              <p className="text-[11px] text-gray-400 italic leading-relaxed">
                "System is now optimized for external session bridging. Your environment and Jules protocols are fully aligned."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToggleItem = ({ label, desc, active, color = 'bg-primary' }: { label: string, desc: string, active: boolean, color?: string }) => (
  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-primary/30 transition-all">
    <div>
      <p className="text-[11px] font-bold text-white uppercase tracking-widest">{label}</p>
      <p className="text-[9px] text-gray-500 uppercase font-medium">{desc}</p>
    </div>
    <div className={`w-10 h-5 ${active ? color : 'bg-gray-800'} rounded-full relative transition-colors shadow-lg`}>
      <div className={`absolute ${active ? 'right-0.5' : 'left-0.5'} top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-300`}></div>
    </div>
  </div>
);

export default SystemView;
