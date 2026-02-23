import React, { useState } from 'react';
import { Tv, Play, Radio, Monitor, Info, Zap } from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  category: string;
  embedId: string; // YouTube Live Embed ID
  color: string;
}

const LiveTvView: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  const channels: Channel[] = [
    { id: '1', name: 'TRT 1', category: 'Genel', embedId: 'W_9fB9Cq6M4', color: 'bg-red-600' },
    { id: '2', name: 'HABER TÜRK', category: 'Haber', embedId: 'at82XF4M7I4', color: 'bg-yellow-500' },
    { id: '3', name: 'NTV', category: 'Haber', embedId: 'X_m0F9j3F-Y', color: 'bg-blue-600' },
    { id: '4', name: 'TRT HABER', category: 'Haber', embedId: 'pT6xWpYvAIs', color: 'bg-red-700' },
    { id: '5', name: 'TV 100', category: 'Haber', embedId: '6hB5y6pA9E8', color: 'bg-blue-500' },
    { id: '6', name: 'SÖZCÜ TV', category: 'Haber', embedId: '3fT-mS5R-z4', color: 'bg-red-800' },
  ];

  return (
    <div className="p-4 lg:p-8 h-full overflow-y-auto pb-32 bg-brandDark">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  <Tv className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Canlı TV</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Kesintisiz ve Canlı Yayın Merkezi</p>
          </div>

          <div className="flex gap-4">
             <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Sistem Aktif</span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Channel Selection Grid */}
          <div className="lg:col-span-1 space-y-4">
             <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-500" />
                Kanal Listesi
             </h3>
             <div className="grid grid-cols-1 gap-3">
                {channels.map(channel => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel)}
                    className={`w-full flex items-center justify-between px-6 py-5 rounded-[2rem] border transition-all group ${
                      activeChannel?.id === channel.id
                        ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-600/20'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10'
                    }`}
                  >
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl ${channel.color} flex items-center justify-center font-black text-[10px] text-white shadow-lg`}>
                           {channel.name.substring(0, 2)}
                        </div>
                        <div className="text-left">
                           <p className="text-xs font-bold">{channel.name}</p>
                           <p className="text-[8px] font-black uppercase tracking-tighter opacity-50">{channel.category}</p>
                        </div>
                     </div>
                     <Play className={`w-3 h-3 transition-transform ${activeChannel?.id === channel.id ? 'scale-125' : 'group-hover:translate-x-1'}`} />
                  </button>
                ))}
             </div>

             <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] mt-10">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                   <Info className="w-3 h-3 text-blue-400" />
                   Yayın Notu
                </h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-bold">
                   Kanallar resmi YouTube canlı yayınları üzerinden sağlanmaktadır. Yayın kalitesi internet hızınıza göre otomatik ayarlanır.
                </p>
             </div>
          </div>

          {/* Player Area */}
          <div className="lg:col-span-3">
             <div className="glass-panel min-h-[500px] rounded-[3rem] border border-white/10 bg-black/60 relative overflow-hidden flex flex-col shadow-2xl">
                {!activeChannel ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 p-20">
                     <div className="w-32 h-32 rounded-[3rem] bg-white/5 flex items-center justify-center border border-white/10 relative">
                        <Monitor className="w-12 h-12 text-slate-700" />
                        <Zap className="w-6 h-6 text-blue-500 absolute -top-2 -right-2 animate-pulse" />
                     </div>
                     <div className="space-y-3">
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">İzlemeye Başla</h3>
                        <p className="text-slate-500 text-sm max-w-sm mx-auto font-bold uppercase tracking-widest leading-relaxed">Sol taraftan bir kanal seçerek canlı yayını başlatın.</p>
                     </div>
                  </div>
                ) : (
                  <>
                    <div className="aspect-video w-full bg-black relative">
                       <iframe
                         width="100%"
                         height="100%"
                         src={`https://www.youtube.com/embed/${activeChannel.embedId}?autoplay=1`}
                         title={activeChannel.name}
                         frameBorder="0"
                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                         allowFullScreen
                         className="absolute inset-0"
                       ></iframe>
                    </div>
                    <div className="p-8 border-t border-white/5 bg-white/5 flex justify-between items-center">
                       <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-3xl ${activeChannel.color} flex items-center justify-center text-xl font-black text-white shadow-2xl`}>
                             {activeChannel.name.substring(0, 2)}
                          </div>
                          <div>
                             <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">{activeChannel.name}</h4>
                             <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mt-1">Canlı Yayınlanıyor</p>
                          </div>
                       </div>
                       <button
                        onClick={() => window.open(`https://www.youtube.com/watch?v=${activeChannel.embedId}`, '_blank')}
                        className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                       >
                          Tam Ekran / YouTube'da Aç
                       </button>
                    </div>
                  </>
                )}
             </div>

             <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-gradient-to-br from-blue-600/10 to-transparent border border-white/5 rounded-[2.5rem] flex items-center gap-6">
                   <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400">
                      <Zap className="w-6 h-6" />
                   </div>
                   <div>
                      <h5 className="text-white font-bold text-sm">Ultra Düşük Gecikme</h5>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Fiber hızında yayın akışı</p>
                   </div>
                </div>
                <div className="p-8 bg-gradient-to-br from-purple-600/10 to-transparent border border-white/5 rounded-[2.5rem] flex items-center gap-6">
                   <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400">
                      <Monitor className="w-6 h-6" />
                   </div>
                   <div>
                      <h5 className="text-white font-bold text-sm">HD Görüntü Kalitesi</h5>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Kristal netliğinde izleme</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTvView;
