import React, { useState } from 'react';

const MusicView: React.FC = () => {
  const [playingId, setPlayingId] = useState<number | null>(null);

  const togglePlay = (id: number) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <section className="section-transition p-8 lg:p-12 animate-in fade-in duration-500 h-full overflow-y-auto pb-32" id="music">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
          <i className="fa-solid fa-compact-disc text-primary animate-spin-slow"></i>
          Müzik Kitaplığı
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              onClick={() => togglePlay(i)}
              className={`bg-surface border p-4 rounded-custom flex items-center gap-4 group cursor-pointer transition-all ${
                playingId === i ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-white/5 hover:bg-white/5'
              }`}
            >
              <div className={`w-16 h-16 rounded-custom flex items-center justify-center transition-all ${
                playingId === i ? 'bg-primary text-white' : 'bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white'
              }`}>
                {playingId === i ? (
                   <i className="fa-solid fa-pause text-2xl"></i>
                ) : (
                  <i className="fa-solid fa-play text-2xl ml-1"></i>
                )}
              </div>
              <div className="flex-1">
                <h4 className={`font-bold transition-colors ${playingId === i ? 'text-primary' : ''}`}>Nöral Frekanslar v{i}</h4>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">YZ ÜRETİMİ • 3:45</p>
                  {playingId === i && (
                    <div className="flex gap-0.5 items-end h-3">
                      <div className="w-0.5 bg-primary animate-music-bar-1"></div>
                      <div className="w-0.5 bg-primary animate-music-bar-2"></div>
                      <div className="w-0.5 bg-primary animate-music-bar-3"></div>
                    </div>
                  )}
                </div>
              </div>
              <button className="text-gray-400 hover:text-white transition-colors p-2">
                <i className="fa-solid fa-ellipsis-vertical"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MusicView;
