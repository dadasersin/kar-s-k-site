import React, { useState } from 'react';

const AutomationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'triggers' | 'actions' | 'workflows'>('workflows');
  const [isProcessing, setIsProcessing] = useState(false);

  const workflows = [
    { id: 1, name: 'Gmail to Discord Sync', status: 'active', frequency: 'Real-time' },
    { id: 2, name: 'Crypto Price Alert', status: 'paused', frequency: '5 min' },
    { id: 3, name: 'AI Image Social Poster', status: 'active', frequency: 'Daily' },
  ];

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
              <i className="fa-solid fa-robot text-primary"></i>
              Otomasyon Hub
            </h1>
            <p className="text-slate-500 text-sm mt-1 uppercase font-bold tracking-widest">Render Web Service Entegrasyonu Aktif</p>
          </div>
          <button className="px-8 py-4 bg-primary hover:brightness-110 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all text-xs">
             YENİ FLOW OLUŞTUR
          </button>
        </header>

        <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
          {['workflows', 'triggers', 'actions'].map(tab => (
            <button
              key={tab}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab === 'workflows' ? 'İş Akışları' : tab === 'triggers' ? 'Tetikleyiciler' : 'Eylemler'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            {workflows.map(flow => (
              <div key={flow.id} className="glass-panel p-6 rounded-[2rem] flex items-center justify-between border border-white/5 hover:border-primary/30 transition-all group shadow-xl">
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${flow.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-800 text-gray-500'}`}>
                    <i className={`fa-solid ${flow.status === 'active' ? 'fa-play' : 'fa-pause'}`}></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-white uppercase tracking-wider">{flow.name}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1">Sıklık: {flow.frequency} • {flow.status.toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-primary transition-all"><i className="fa-solid fa-gear"></i></button>
                   <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-red-500 transition-all"><i className="fa-solid fa-trash-can"></i></button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 space-y-6">
             <div className="bg-gradient-to-br from-primary/20 to-brandDark border border-primary/20 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic border-b border-white/5 pb-2">Servis Durumu</h3>
                <div className="space-y-6">
                   <StatusItem label="Render Worker" status="Running" color="bg-emerald-500" />
                   <StatusItem label="Webhooks" status="Listening" color="bg-primary" />
                   <StatusItem label="Database" status="Synced" color="bg-emerald-500" />
                </div>
                <button
                  onClick={() => { setIsProcessing(true); setTimeout(() => setIsProcessing(false), 2000); }}
                  className="w-full mt-10 py-4 border border-primary/30 text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-all flex items-center justify-center gap-3"
                >
                  {isProcessing ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-rotate"></i>}
                  Tümünü Yeniden Başlat
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusItem = ({ label, status, color }: { label: string, status: string, color: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${color} animate-pulse`}></div>
      <span className={`text-[10px] font-black uppercase ${color.replace('bg-', 'text-')}`}>{status}</span>
    </div>
  </div>
);

export default AutomationView;
