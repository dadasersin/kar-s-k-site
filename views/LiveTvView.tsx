import React, { useEffect, useRef, useState } from 'react';
import { Tv, Play, Radio, Monitor, Info, Zap, Search, Heart, ExternalLink, AlertTriangle, RefreshCw, ShieldCheck, Wrench } from 'lucide-react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import channelData from '../data/channels.json';

interface Channel {
  id: string;
  name: string;
  category: string;
  url: string;
  logo?: string;
  type: string;
  color: string;
}

const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/', // Note: Needs opt-in usually, but good fallback
  'https://proxy.cors.sh/',
  'https://corsproxy.io/?url='
];

const LiveTvView: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [playerError, setPlayerError] = useState(false);
  const [isProxyActive, setIsProxyActive] = useState(false);
  const [proxyIndex, setProxyIndex] = useState(0);
  const [isAutoFixing, setIsAutoFixing] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse tv_favorites", e);
      return [];
    }
  });
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  const channels: Channel[] = channelData as Channel[];

  const filteredChannels = channels.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    localStorage.setItem('tv_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const loadPlayer = (channel: Channel, useProxy: boolean = false, pIndex: number = 0) => {
    if (channel.type === 'm3u8' && videoRef.current) {
      setPlayerError(false);

      if (playerRef.current) {
        playerRef.current.dispose();
      }

      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered', 'vjs-theme-city');
      videoRef.current.innerHTML = '';
      videoRef.current.appendChild(videoElement);

      const finalUrl = useProxy
        ? `${CORS_PROXIES[pIndex]}${encodeURIComponent(channel.url)}`
        : channel.url;

      const player = playerRef.current = videojs(videoElement, {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        preload: 'auto',
        html5: {
          vhs: {
            overrideNative: true,
            withCredentials: false
          },
          nativeAudioTracks: false,
          nativeVideoTracks: false
        },
        sources: [{
          src: finalUrl,
          type: 'application/x-mpegURL'
        }]
      });

      player.on('error', () => {
        const currentError = player.error();
        console.warn(`Player Error [Proxy: ${useProxy}, Index: ${pIndex}]:`, currentError);

        if (!useProxy) {
          setIsAutoFixing(true);
          setIsProxyActive(true);
          setTimeout(() => loadPlayer(channel, true, 0), 1000);
        } else if (pIndex < CORS_PROXIES.length - 1) {
          setIsAutoFixing(true);
          setProxyIndex(pIndex + 1);
          setTimeout(() => loadPlayer(channel, true, pIndex + 1), 1500);
        } else {
          setPlayerError(true);
          setIsProxyActive(false);
          setIsAutoFixing(false);
        }
      });

      player.on('playing', () => {
        setPlayerError(false);
        setIsAutoFixing(false);
      });
    }
  };

  useEffect(() => {
    if (activeChannel) {
      setProxyIndex(0);
      setIsProxyActive(false);
      setIsAutoFixing(false);
      loadPlayer(activeChannel, false);
    }
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [activeChannel]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleRetry = () => {
    if (activeChannel) {
      setProxyIndex(0);
      setIsProxyActive(false);
      setIsAutoFixing(true);
      loadPlayer(activeChannel, false);
    }
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
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Kesintisiz Yayın & Akıllı Proxy Sistemi</p>
          </div>

          <div className="flex-1 max-w-md w-full relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
             <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Kanal veya kategori ara..."
               className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-blue-500 transition-all shadow-inner"
             />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* List Section */}
          <div className="lg:col-span-1 space-y-4">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                   <Radio className="w-4 h-4 text-blue-500" />
                   Kanallar ({filteredChannels.length})
                </h3>
             </div>
             <div className="grid grid-cols-1 gap-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredChannels.map(channel => (
                  <div key={channel.id} className="relative group">
                    <button
                      onClick={() => { setActiveChannel(channel); setPlayerError(false); }}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl border transition-all ${
                        activeChannel?.id === channel.id
                          ? 'bg-blue-600 border-blue-500 text-white shadow-xl scale-[1.02]'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                       <div className="w-10 h-10 rounded-lg bg-white p-1 shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                          {channel.logo ? <img src={channel.logo} alt="" className="max-w-full max-h-full object-contain" /> : <Tv className="w-4 h-4 text-slate-400" />}
                       </div>
                       <div className="text-left overflow-hidden">
                          <p className="text-[11px] font-bold truncate">{channel.name}</p>
                          <p className="text-[8px] font-black uppercase opacity-50 tracking-tighter">{channel.category}</p>
                       </div>
                    </button>
                    <button
                      onClick={() => toggleFavorite(channel.id)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all p-2 rounded-full hover:bg-black/20 ${favorites.includes(channel.id) ? 'text-red-500' : 'text-slate-600 opacity-0 group-hover:opacity-100 hover:text-white'}`}
                    >
                      <Heart className={`w-3 h-3 ${favorites.includes(channel.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                ))}
             </div>
          </div>

          {/* Player Section */}
          <div className="lg:col-span-3">
             <div className="glass-panel min-h-[500px] rounded-[3rem] border border-white/10 bg-black/60 relative overflow-hidden flex flex-col shadow-2xl">
                {!activeChannel ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 p-20">
                     <div className="w-32 h-32 rounded-[3rem] bg-white/5 flex items-center justify-center border border-white/10 relative">
                        <Monitor className="w-12 h-12 text-slate-700" />
                        <div className="absolute inset-0 bg-blue-500/5 rounded-[3rem] animate-pulse"></div>
                     </div>
                     <div className="space-y-3">
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">İzlemeye Başlayın</h3>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">Listeden bir kanal seçerek canlı yayın akışını başlatın.</p>
                     </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="w-full aspect-video bg-black rounded-t-[3rem] overflow-hidden relative group/player">
                      {isAutoFixing ? (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm p-10 text-center animate-in fade-in">
                           <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 border border-blue-500/30">
                              <Wrench className="w-10 h-10 text-blue-500 animate-bounce" />
                           </div>
                           <h4 className="text-xl font-black text-white uppercase mb-2">Otomatik Onarım Devrede</h4>
                           <p className="text-slate-400 text-xs max-w-md mb-8 font-bold uppercase tracking-wider leading-relaxed">
                              CORS engeli algılandı. Kodlama uzmanı alternatif proxy sunucuları üzerinden bağlantı kuruyor...
                           </p>
                           <div className="flex gap-1">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                           </div>
                        </div>
                      ) : playerError ? (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md p-10 text-center animate-in fade-in">
                           <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6 border border-red-500/30">
                              <AlertTriangle className="w-10 h-10 text-red-500" />
                           </div>
                           <h4 className="text-xl font-black text-white uppercase mb-2">Yayın Aşılamadı</h4>
                           <p className="text-slate-400 text-sm max-w-md mb-8 font-bold uppercase tracking-wider leading-relaxed">
                              Tüm proxy ve onarım yöntemleri denendi ancak yayın kaynağı erişime kapalı.
                           </p>
                           <div className="flex flex-wrap justify-center gap-4">
                              <button
                                onClick={handleRetry}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-white/10"
                              >
                                 <RefreshCw className="w-3 h-3" /> YENİDEN DENE
                              </button>
                              <a
                                href={activeChannel.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
                              >
                                 <ExternalLink className="w-3 h-3" /> KAYNAK SİTESİNDE AÇ
                              </a>
                           </div>
                        </div>
                      ) : activeChannel.type === 'youtube' ? (
                        <iframe
                          width="100%"
                          height="100%"
                          src={`${activeChannel.url}?autoplay=1`}
                          title={activeChannel.name}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0"
                        ></iframe>
                      ) : (
                        <div ref={videoRef} className="w-full h-full" />
                      )}

                      {isProxyActive && !playerError && !isAutoFixing && (
                         <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-blue-600/80 backdrop-blur rounded-full flex items-center gap-2 border border-white/20">
                            <ShieldCheck className="w-3 h-3 text-white animate-pulse" />
                            <span className="text-[8px] font-black text-white uppercase tracking-widest">Akıllı Proxy Aktif (Kanal {proxyIndex + 1})</span>
                         </div>
                      )}
                    </div>
                    <div className="p-8 bg-white/5 border-t border-white/5 flex justify-between items-center">
                       <div className="flex items-center gap-6 overflow-hidden">
                          <div className="w-16 h-16 rounded-2xl bg-white p-2 flex items-center justify-center shrink-0 shadow-lg">
                             {activeChannel.logo ? <img src={activeChannel.logo} alt="" className="max-w-full max-h-full object-contain" /> : <Tv className="w-8 h-8 text-slate-400" />}
                          </div>
                          <div className="overflow-hidden">
                             <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter truncate">{activeChannel.name}</h4>
                             <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                                <Zap className="w-3 h-3 fill-current animate-pulse" />
                                {activeChannel.type === 'youtube' ? 'YouTube Canlı Yayın' : (isProxyActive ? 'Onarılmış Güvenli Akış' : 'Doğrudan Akış')}
                             </p>
                          </div>
                       </div>
                       <div className="flex gap-4 shrink-0">
                          <button
                            onClick={() => window.open(activeChannel.url, '_blank')}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                          >
                             Kanal Linki
                             <ExternalLink className="w-3 h-3" />
                          </button>
                       </div>
                    </div>
                  </div>
                )}
             </div>

             <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-600/10 border border-blue-600/20 rounded-3xl flex items-center gap-4 group">
                   <ShieldCheck className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                   <div>
                      <p className="text-white font-bold text-xs uppercase tracking-tight">Derin Proxy</p>
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Gelişmiş CORS Tünelleme</p>
                   </div>
                </div>
                <div className="p-6 bg-indigo-600/10 border border-indigo-600/20 rounded-3xl flex items-center gap-4 group">
                   <Wrench className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
                   <div>
                      <p className="text-white font-bold text-xs uppercase tracking-tight">Kendi Kendini Onarma</p>
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Otomatik Hata Giderme</p>
                   </div>
                </div>
                <div className="p-6 bg-green-600/10 border border-green-600/20 rounded-3xl flex items-center gap-4 group">
                   <Info className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                   <div>
                      <p className="text-white font-bold text-xs uppercase tracking-tight">Hibrid Motor</p>
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Multi-Kanal Desteği</p>
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
