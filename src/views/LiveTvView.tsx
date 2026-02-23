import React, { useEffect, useRef, useState } from 'react';
import { Tv, Play, Radio, Monitor, Info, Zap, Search, Heart } from 'lucide-react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface Channel {
  id: string;
  name: string;
  category: string;
  url: string;
  logo?: string;
  isM3U8: boolean;
  color: string;
}

const LiveTvView: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  const channels: Channel[] = [
    { id: '1', name: 'TRT 1', category: 'Genel', url: 'https://d1u68oyra9spme.cloudfront.net/master.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/TRT_1_logo_%282021-%29.svg/512px-TRT_1_logo_%282021-%29.svg.png', isM3U8: true, color: 'bg-red-600' },
    { id: '2', name: 'TRT HABER', category: 'Haber', url: 'https://tv-trthaber.medya.trt.com.tr/master.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/TRT_Haber_Eyl%C3%BCl_2020_Logo.svg/512px-TRT_Haber_Eyl%C3%BCl_2020_Logo.svg.png', isM3U8: true, color: 'bg-red-700' },
    { id: '3', name: 'TRT SPOR', category: 'Spor', url: 'https://tv-trtspor1.medya.trt.com.tr/master.m3u8', logo: 'https://i.imgur.com/pCjzh5A.png', isM3U8: true, color: 'bg-green-600' },
    { id: '4', name: '24 TV', category: 'Haber', url: 'https://mn-nl.mncdn.com/kanal24/smil:kanal24.smil/playlist.m3u8', logo: 'https://i.imgur.com/8FO41es.png', isM3U8: true, color: 'bg-yellow-600' },
    { id: '5', name: '360 TV', category: 'Genel', url: 'https://turkmedya-live.ercdn.net/tv360/tv360.m3u8', logo: 'https://i.imgur.com/agn47sQ.png', isM3U8: true, color: 'bg-blue-500' },
    { id: '6', name: 'AKİT TV', category: 'Haber', url: 'https://akittv-live.ercdn.net/akittv/akittv.m3u8', logo: 'https://i.imgur.com/oGto929.png', isM3U8: true, color: 'bg-red-800' },
    { id: '7', name: 'CNN TÜRK', category: 'Haber', url: 'https://live.duhnet.tv/S2/HLS_LIVE/cnnturknp/playlist.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/CNN_T%C3%BCrk_logo.svg/512px-CNN_T%C3%BCrk_logo.svg.png', isM3U8: true, color: 'bg-red-600' },
    { id: '8', name: 'KANAL D', category: 'Genel', url: 'https://demiroren-live.daioncdn.net/kanald/kanald.m3u8', logo: 'https://i.imgur.com/9o1atM6.png', isM3U8: true, color: 'bg-blue-600' },
    { id: '9', name: 'STAR TV', category: 'Genel', url: 'https://dogus-live.daioncdn.net/startv/startv.m3u8', logo: 'https://i.imgur.com/9O3DHRB.png', isM3U8: true, color: 'bg-purple-600' },
    { id: '10', name: 'NTV', category: 'Haber', url: 'https://dogus-live.daioncdn.net/ntv/ntv.m3u8', logo: 'https://i.imgur.com/jXbs8FZ.png', isM3U8: true, color: 'bg-blue-700' },
    { id: '11', name: 'TV8', category: 'Eğlence', url: 'https://tv8-live.daioncdn.net/tv8/tv8.m3u8', logo: 'https://i.imgur.com/DKNwiDm.png', isM3U8: true, color: 'bg-red-500' },
    { id: '12', name: 'HALK TV', category: 'Haber', url: 'https://halktv.blutv.com/blutv_halktv_live/live.m3u8', logo: 'https://i.imgur.com/xM0HA30.png', isM3U8: true, color: 'bg-blue-400' },
  ];

  const filteredChannels = channels.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (activeChannel && activeChannel.isM3U8 && videoRef.current) {
      if (playerRef.current) {
        playerRef.current.dispose();
      }

      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
          src: activeChannel.url,
          type: 'application/x-mpegURL'
        }]
      });

      return () => {
        if (player) {
          player.dispose();
          playerRef.current = null;
        }
      };
    }
  }, [activeChannel]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  return (
    <div className="p-4 lg:p-8 h-full overflow-y-auto pb-32 bg-brandDark">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  <Tv className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Canlı TV Pro</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">IP-TV.APP TÜRKİYE ENTEGRASYONU</p>
          </div>

          <div className="flex-1 max-w-md w-full relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
             <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Kanal veya kategori ara..."
               className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-blue-500 transition-all"
             />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Channel List */}
          <div className="lg:col-span-1 space-y-4">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                   <Radio className="w-4 h-4 text-blue-500" />
                   Kanallar ({filteredChannels.length})
                </h3>
             </div>
             <div className="grid grid-cols-1 gap-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                {filteredChannels.map(channel => (
                  <div key={channel.id} className="relative group">
                    <button
                      onClick={() => setActiveChannel(channel)}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl border transition-all ${
                        activeChannel?.id === channel.id
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                       <div className="w-10 h-10 rounded-lg bg-white p-1 shrink-0 flex items-center justify-center overflow-hidden">
                          {channel.logo ? <img src={channel.logo} alt="" className="max-w-full max-h-full object-contain" /> : channel.name[0]}
                       </div>
                       <div className="text-left overflow-hidden">
                          <p className="text-[11px] font-bold truncate">{channel.name}</p>
                          <p className="text-[8px] font-black uppercase opacity-50">{channel.category}</p>
                       </div>
                    </button>
                    <button
                      onClick={() => toggleFavorite(channel.id)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all ${favorites.includes(channel.id) ? 'text-red-500' : 'text-slate-600 opacity-0 group-hover:opacity-100 hover:text-white'}`}
                    >
                      <Heart className={`w-3 h-3 ${favorites.includes(channel.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                ))}
             </div>
          </div>

          {/* Player area */}
          <div className="lg:col-span-3">
             <div className="glass-panel min-h-[500px] rounded-[3rem] border border-white/10 bg-black/60 relative overflow-hidden flex flex-col shadow-2xl">
                {!activeChannel ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 p-20">
                     <div className="w-32 h-32 rounded-[3rem] bg-white/5 flex items-center justify-center border border-white/10">
                        <Monitor className="w-12 h-12 text-slate-700" />
                     </div>
                     <div className="space-y-3">
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Bir Kanal Seçin</h3>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Canlı yayını başlatmak için listeden bir kanala tıklayın.</p>
                     </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="w-full aspect-video bg-black rounded-t-[3rem] overflow-hidden">
                      <div ref={videoRef} className="w-full h-full" />
                    </div>
                    <div className="p-8 bg-white/5 border-t border-white/5 flex justify-between items-center">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-white p-2 flex items-center justify-center">
                             <img src={activeChannel.logo} alt="" className="max-w-full max-h-full object-contain" />
                          </div>
                          <div>
                             <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">{activeChannel.name}</h4>
                             <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                                <Zap className="w-3 h-3 fill-current" />
                                Canlı Akış Aktif
                             </p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <button
                            onClick={() => window.open(activeChannel.url, '_blank')}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                          >
                             M3U8 Linkini Aç
                          </button>
                       </div>
                    </div>
                  </div>
                )}
             </div>

             <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-600/10 border border-blue-600/20 rounded-3xl flex items-center gap-4">
                   <Zap className="w-6 h-6 text-blue-400" />
                   <div>
                      <p className="text-white font-bold text-xs">M3U8 Engine</p>
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">HLS Stream Support</p>
                   </div>
                </div>
                <div className="p-6 bg-red-600/10 border border-red-600/20 rounded-3xl flex items-center gap-4">
                   <Monitor className="w-6 h-6 text-red-400" />
                   <div>
                      <p className="text-white font-bold text-xs">IP-TV.APP</p>
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Turkey Channel List</p>
                   </div>
                </div>
                <div className="p-6 bg-green-600/10 border border-green-600/20 rounded-3xl flex items-center gap-4">
                   <Info className="w-6 h-6 text-green-400" />
                   <div>
                      <p className="text-white font-bold text-xs">Full HD</p>
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Adaptive Bitrate</p>
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
