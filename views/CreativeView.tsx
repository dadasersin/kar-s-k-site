import React, { useState } from 'react';

const CreativeView: React.FC = () => {
  const [focalLength, setFocalLength] = useState(50);
  const [exposure, setExposure] = useState(50);
  const [lighting, setLighting] = useState('Dramatik');
  const [renderProgress, setRenderProgress] = useState<number | null>(null);

  const lightingColors: Record<string, string> = {
    'Stüdyo': 'rgba(255, 255, 255, 0.4)',
    'Neon': 'rgba(236, 72, 153, 0.6)',
    'Güneşli': 'rgba(251, 191, 36, 0.5)',
    'Dramatik': 'rgba(13, 89, 242, 0.7)'
  };

  return (
    <section className="section-transition p-0 h-screen flex flex-col animate-in fade-in duration-500 overflow-hidden" id="creative">
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Canvas/Preview Area */}
        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden min-h-[300px]">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #333 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

          {/* Mock 3D Model with Dynamic Controls */}
          <div
            className="w-48 h-48 md:w-64 md:h-64 border-2 relative"
            style={{
              transformStyle: 'preserve-3d',
              animation: `spin ${11 - focalLength / 10}s linear infinite`,
              borderColor: lightingColors[lighting],
              filter: `brightness(${0.5 + exposure / 100})`,
              boxShadow: `0 0 ${exposure / 2}px ${lightingColors[lighting]}`
            }}
          >
            <div className="absolute inset-0 border border-current rotate-45 opacity-50"></div>
            <div className="absolute inset-0 border border-current -rotate-45 opacity-50"></div>
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full blur-md"
              style={{ backgroundColor: lightingColors[lighting].replace('0.7', '1').replace('0.6', '1').replace('0.5', '1').replace('0.4', '1') }}
            ></div>
          </div>

          <div className="absolute bottom-8 left-8 flex flex-col md:flex-row gap-4">
            <div className="bg-surface/80 backdrop-blur border border-white/10 p-4 rounded-custom">
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Durum</p>
              <p className="text-xs font-mono">Render: Hazır | Mod: {lighting}</p>
            </div>
            <div className="bg-surface/80 backdrop-blur border border-white/10 p-4 rounded-custom hidden md:block">
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Koordinatlar</p>
              <p className="text-xs font-mono">X: {focalLength}.45 | Y: -{exposure}.20 | Z: 0.00</p>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="w-full md:w-80 bg-surface border-l border-white/5 p-6 flex flex-col gap-6 overflow-y-auto max-h-[50%] md:max-h-full pb-32 md:pb-6">
          <div>
            <h3 className="font-bold mb-4 flex items-center gap-2 text-sm md:text-base">
              <i className="fa-solid fa-camera text-primary"></i>
              Kamera Ayarları
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold flex justify-between">
                  <span>Dönüş Hızı</span>
                  <span className="text-primary font-mono">{focalLength}</span>
                </label>
                <input
                  className="w-full accent-primary bg-white/5 rounded-lg appearance-none h-1 mt-2 cursor-pointer"
                  type="range"
                  min="1" max="100"
                  value={focalLength}
                  onChange={(e) => setFocalLength(parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold flex justify-between">
                  <span>Pozlama</span>
                  <span className="text-primary font-mono">{exposure}</span>
                </label>
                <input
                  className="w-full accent-primary bg-white/5 rounded-lg appearance-none h-1 mt-2 cursor-pointer"
                  type="range"
                  min="1" max="100"
                  value={exposure}
                  onChange={(e) => setExposure(parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
          <div className="h-px bg-white/5 w-full"></div>
          <div>
            <h3 className="font-bold mb-4 flex items-center gap-2 text-sm md:text-base">
              <i className="fa-solid fa-lightbulb text-primary"></i>
              Işıklandırma
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {['Stüdyo', 'Neon', 'Güneşli', 'Dramatik'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLighting(mode)}
                  className={`p-3 border rounded-custom text-[10px] font-bold transition-all ${
                    lighting === mode
                      ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(13,89,242,0.2)]'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-primary/50'
                  }`}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="h-px bg-white/5 w-full"></div>
          <button
            onClick={() => {
              if (renderProgress !== null) return;
              setRenderProgress(0);
              const interval = setInterval(() => {
                setRenderProgress(prev => {
                  if (prev === null) return 0;
                  if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setRenderProgress(null), 2000);
                    return 100;
                  }
                  return prev + 5;
                });
              }, 100);
            }}
            disabled={renderProgress !== null}
            className="mt-auto w-full py-4 bg-primary text-white font-bold rounded-custom shadow-[0_0_20px_rgba(13,89,242,0.3)] hover:brightness-110 active:scale-95 transition-all uppercase disabled:opacity-50 text-xs"
          >
            {renderProgress === null ? 'Sahneyi Render Et' : renderProgress === 100 ? 'TAMAMLANDI!' : `RENDER EDİLİYOR... %${renderProgress}`}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreativeView;
