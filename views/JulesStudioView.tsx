import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StitchElement {
  id: string;
  type: 'text' | 'image' | 'code' | 'audio';
  content: string;
  provider: string;
  timestamp: number;
}

const JulesStudioView: React.FC = () => {
  const [elements, setElements] = useState<StitchElement[]>([]);
  const [isStitching, setIsStitching] = useState(false);
  const [projectTitle, setProjectTitle] = useState('Yeni Jules Projesi');

  const addElement = (type: StitchElement['type']) => {
    const newElement: StitchElement = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: type === 'text' ? 'AI Üretimi Metin...' :
               type === 'code' ? '// AI Tarafından Optimize Edilen Kod' :
               type === 'image' ? `https://picsum.photos/seed/${Math.random()}/400/300` :
               'Audio stream data...',
      provider: 'Jules Omni-Core',
      timestamp: Date.now()
    };
    setElements([...elements, newElement]);
  };

  const handleStitch = () => {
    setIsStitching(true);
    setTimeout(() => {
      setIsStitching(false);
      alert('Tüm elementler başarıyla birbirine dikildi (Stitched)! Proje optimize edildi.');
    }, 2500);
  };

  return (
    <div className="space-y-10 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="w-2 h-2 rounded-full bg-primary/50 animate-pulse delay-75"></span>
          </div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Jules AI Studio</h2>
          <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Multi-Model Çıktı Dikişleme (Stitching) Merkezi</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleStitch}
            disabled={elements.length < 2 || isStitching}
            className="px-6 py-3 bg-primary text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all disabled:opacity-50 disabled:grayscale"
          >
            {isStitching ? 'DİKİLİYOR (STITCHING)...' : 'PROJEYİ DİK (STITCH)'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Toolbox */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-surface/30">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <i className="fa-solid fa-toolbox text-primary"></i> Araç Kutusu
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <ToolButton icon="fa-font" label="Metin" onClick={() => addElement('text')} />
              <ToolButton icon="fa-image" label="Görsel" onClick={() => addElement('image')} />
              <ToolButton icon="fa-code" label="Kod" onClick={() => addElement('code')} />
              <ToolButton icon="fa-microphone" label="Ses" onClick={() => addElement('audio')} />
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-surface/30">
            <h3 className="text-lg font-bold text-white mb-4">Proje Ayarları</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Proje Adı</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-primary outline-none transition-colors"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-xs font-bold text-slate-400">Auto-Optimization</span>
                <div className="w-10 h-5 bg-primary rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stitching Canvas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel min-h-[500px] p-8 rounded-[3rem] border border-white/5 bg-black/20 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0d59f2 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            {elements.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-3xl text-slate-600">
                  <i className="fa-solid fa-layer-group"></i>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-400">Tuval Boş</h4>
                  <p className="text-sm text-slate-500 max-w-xs">Sol taraftaki araçları kullanarak farklı AI çıktılarını buraya ekleyin ve dikişlemeye (stitch) başlayın.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 relative z-10">
                <AnimatePresence>
                  {elements.map((el) => (
                    <motion.div
                      key={el.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="glass-panel p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-primary/30 transition-all group"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                            el.type === 'text' ? 'bg-blue-500/20 text-blue-400' :
                            el.type === 'image' ? 'bg-purple-500/20 text-purple-400' :
                            el.type === 'code' ? 'bg-emerald-500/20 text-emerald-400' :
                            'bg-orange-500/20 text-orange-400'
                          }`}>
                            <i className={`fa-solid ${
                              el.type === 'text' ? 'fa-font' :
                              el.type === 'image' ? 'fa-image' :
                              el.type === 'code' ? 'fa-code' :
                              'fa-microphone'
                            }`}></i>
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{el.provider}</span>
                        </div>
                        <button
                          onClick={() => setElements(elements.filter(item => item.id !== el.id))}
                          className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-500 hover:text-white"
                        >
                          <i className="fa-solid fa-times text-xs"></i>
                        </button>
                      </div>

                      <div className="text-sm text-slate-300">
                        {el.type === 'image' ? (
                          <img src={el.content} alt="Stitch element" className="w-full h-32 object-cover rounded-xl border border-white/10" />
                        ) : el.type === 'code' ? (
                          <pre className="bg-black/40 p-3 rounded-xl font-mono text-xs overflow-x-auto border border-white/5">{el.content}</pre>
                        ) : (
                          <p className="px-1">{el.content}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {isStitching && (
              <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-primary/20 rounded-full"></div>
                  <div className="absolute inset-0 w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center font-black text-primary italic">STITCH</div>
                </div>
                <p className="mt-6 text-white font-black uppercase tracking-[0.3em] animate-pulse">Neural Threading...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolButton: React.FC<{ icon: string; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-primary/10 hover:border-primary/40 transition-all group"
  >
    <i className={`fa-solid ${icon} text-xl text-slate-400 group-hover:text-primary transition-colors`}></i>
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">{label}</span>
  </button>
);

export default JulesStudioView;
