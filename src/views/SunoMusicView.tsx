import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SunoMusicView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [customLyrics, setCustomLyrics] = useState('');
  const [style, setStyle] = useState('');
  const [instrumental, setInstrumental] = useState(false);
  const [mode, setMode] = useState<'standard' | 'custom'>('standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);

  const handleGenerate = () => {
    if (mode === 'standard' && !prompt) return;
    if (mode === 'custom' && !customLyrics) return;

    setIsGenerating(true);
    setShowResults(false);
    setGenerationLogs([
      `${mode === 'custom' ? 'Özel sözler' : 'Prompt'} analiz ediliyor...`,
      `${mode === 'custom' ? style : 'Nöral'} stili analiz ediliyor...`,
      `Nöral Beste Katmanı oluşturuluyor...`
    ]);

    setTimeout(() => {
      setGenerationLogs(prev => [...prev,
        mode === 'custom' ? 'Sözler melodiye uyarlanıyor...' : 'Tema derinliği işleniyor...',
        'Vokal sentezi aktif edildi (TR-High fidelity)...',
        'Final mastering ve gürültü engelleme yapılıyor...'
      ]);

      setTimeout(() => {
        setIsGenerating(false);
        setShowResults(true);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="flex-1 p-4 lg:p-10 overflow-y-auto bg-slate-950 pb-32">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex justify-between items-end border-b border-white/5 pb-8">
            <div>
                <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-tight">SUNO AI <span className="text-primary">MÜZİK</span></h2>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-2">Profesyonel Yapay Zeka Müzik Üretim Merkezi</p>
            </div>
            <div className="flex gap-4">
                <button onClick={() => setMode('standard')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${mode === 'standard' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-gray-500'}`}>Standart</button>
                <button onClick={() => setMode('custom')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${mode === 'custom' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-gray-500'}`}>Özel Sözler</button>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-8 rounded-[2.5rem] bg-brandDark/30 border border-white/10">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6">Şarkı Yapılandırması</h3>

              <div className="space-y-6">
                {mode === 'standard' ? (
                  <div>
                    <label className="text-[10px] text-gray-500 font-black uppercase mb-3 block">Şarkı Tanımı</label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Örn: 80'ler tarzında, hüzünlü bir synthwave şarkısı..."
                      className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl p-4 text-xs text-white outline-none focus:border-primary/40 transition-all resize-none"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="text-[10px] text-gray-500 font-black uppercase mb-3 block">Sözler</label>
                      <textarea
                        value={customLyrics}
                        onChange={(e) => setCustomLyrics(e.target.value)}
                        placeholder="Şarkı sözlerinizi buraya yazın..."
                        className="w-full h-40 bg-black/40 border border-white/5 rounded-2xl p-4 text-xs text-white outline-none focus:border-primary/40 transition-all resize-none font-serif italic"
                      />
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 font-black uppercase mb-3 block">Müzik Stili</label>
                        <input
                            value={style}
                            onChange={(e) => setStyle(e.target.value)}
                            placeholder="Örn: Hard Rock, Epic Cinematic..."
                            className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-xs text-white outline-none focus:border-primary/40"
                        />
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-black text-gray-300 uppercase">Enstrümantal</span>
                    <button
                        onClick={() => setInstrumental(!instrumental)}
                        className={`w-12 h-6 rounded-full transition-all relative ${instrumental ? 'bg-primary' : 'bg-slate-800'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${instrumental ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-5 bg-primary text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-[1.5rem] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {isGenerating ? 'SENTEZLENİYOR...' : 'ŞARKIYI OLUŞTUR'}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-8 glass-panel rounded-[3rem] border border-white/5 bg-brandDark/20">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-2 border-primary/20 animate-ping absolute inset-0" />
                        <div className="w-32 h-32 rounded-full border-2 border-primary/40 flex items-center justify-center">
                            <i className="fa-solid fa-music text-3xl text-primary animate-pulse"></i>
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <h4 className="text-white font-black uppercase text-sm tracking-widest">Suno AI İşliyor</h4>
                        <div className="flex flex-col items-center gap-2">
                            {generationLogs.map((log, i) => (
                                <p key={i} className="text-[10px] text-gray-500 font-medium">{log}</p>
                            ))}
                        </div>
                    </div>
                </motion.div>
              ) : showResults ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-4">Sonuçlar (2 Varyasyon)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TrackItem
                          title="Neural Symphony v1"
                          length="03:42"
                          prompt={mode === 'standard' ? prompt : customLyrics}
                          color="from-purple-500"
                          style={mode === 'custom' ? style : 'Standard'}
                          audioUrl="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                        />
                        <TrackItem
                          title="Digital Echoes v2"
                          length="02:15"
                          prompt={mode === 'standard' ? prompt : customLyrics}
                          color="from-blue-500"
                          style={mode === 'custom' ? style : 'Standard'}
                          audioUrl="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
                        />
                    </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center glass-panel rounded-[3rem] border border-white/5 bg-brandDark/10 text-center p-12">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-slate-700 mb-6">
                        <i className="fa-solid fa-microphone-slash text-2xl"></i>
                    </div>
                    <h4 className="text-lg font-black text-white italic tracking-tighter uppercase mb-2">Başlamaya Hazır</h4>
                    <p className="text-xs text-gray-500 max-w-xs leading-relaxed uppercase font-bold">Soldaki panelden şarkı detaylarını belirleyin ve Suno AI motorunu ateşleyin.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrackItem = ({ title, length, prompt, color, style, audioUrl }: { title: string, length: string, prompt: string, color: string, style?: string, audioUrl: string }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = React.useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="glass-panel p-6 rounded-[2.5rem] bg-brandDark/40 border border-white/5 hover:border-primary/20 transition-all group overflow-hidden relative">
            <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${color} to-transparent opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />

            <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />

            <div className="flex items-center gap-6 relative z-10">
                <button
                    onClick={togglePlay}
                    className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-105 transition-transform overflow-hidden relative"
                >
                    <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'} text-xl`}></i>
                </button>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-white truncate uppercase">{title}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{length} • {style || 'Suno v3.5'}</p>
                    <p className="text-[9px] text-slate-600 truncate mt-2 italic">"{prompt.substring(0, 40)}..."</p>
                    <div className="flex gap-2 mt-4">
                        <a href={audioUrl} download className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[8px] font-black uppercase text-white transition-colors text-center">İndir</a>
                        <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[8px] font-black uppercase text-white transition-colors">Paylaş</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SunoMusicView;
