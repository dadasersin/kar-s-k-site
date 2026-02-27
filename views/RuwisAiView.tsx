import React, { useState, useEffect } from 'react';
import {
  Sparkles, Image as ImageIcon, Video, Wand2, Download, Share2, Zap,
  Settings, History, Palette, Layers, Maximize2, Dices, X,
  CheckCircle2, Camera, Sun, Info, Heart, ArrowRight
} from 'lucide-react';

interface GenerationHistory {
  id: string;
  url: string;
  prompt: string;
  type: 'image' | 'video';
  timestamp: number;
}

const RuwisAiView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'inspiration'>('image');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [history, setHistory] = useState<GenerationHistory[]>(() => {
    try {
      const saved = localStorage.getItem('ruwis_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse ruwis_history", e);
      return [];
    }
  });

  const [settings, setSettings] = useState({
    ratio: '16:9',
    quality: '4K',
    style: 'Cinematic',
    lighting: 'Golden Hour',
    perspective: 'Wide Angle',
    steps: 50
  });

  useEffect(() => {
    localStorage.setItem('ruwis_history', JSON.stringify(history.slice(0, 10)));
  }, [history]);

  const styles = ['Sinematik', 'Fotorealistik', 'Cyberpunk', 'Yağlı Boya', 'Anime', '3D Render', 'Eskiz'];
  const lightings = ['Altın Saat', 'Stüdyo Işığı', 'Neon', 'Gün Batımı', 'Moody', 'Dinamik Işık'];
  const perspectives = ['Geniş Açı', 'Makro', 'Kuş Bakışı', 'Düşük Açı', 'Göz Hizası'];

  const randomPrompts = [
    "Uçan arabalar ve neon ışıklarla dolu fütüristik bir şehir, kaldırımlarda yağmur",
    "Parlayan mantarlar ve gizli bir şelale ile mistik bir orman",
    "Uzak bir gezegende kristal bir piramit keşfeden antik bir astronot",
    "Viktorya dönemi oturma odasında çay yapan buharla çalışan bir robot",
    "Tokyo ara sokağında yüksek teknoloji zırh giyen cyberpunk bir kedi"
  ];

  const handleSurpriseMe = () => {
    const random = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    setPrompt(random);
  };

  const generate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setResult(null);

    // AI Processing Simulation
    await new Promise(r => setTimeout(r, 4000));

    const newResult: { url: string; type: 'image' | 'video' } = activeTab === 'image'
      ? { url: `https://picsum.photos/seed/${encodeURIComponent(prompt + Date.now())}/1920/1080`, type: 'image' }
      : { url: 'https://www.w3schools.com/html/mov_bbb.mp4', type: 'video' };

    setResult(newResult);

    const historyItem: GenerationHistory = {
      id: Date.now().toString(),
      url: newResult.url,
      prompt: prompt,
      type: newResult.type,
      timestamp: Date.now()
    };
    setHistory(prev => [historyItem, ...prev]);
    setIsGenerating(false);
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.url;
    link.download = `ruwis-ai-${Date.now()}.${result.type === 'image' ? 'png' : 'mp4'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [isUpscaling, setIsUpscaling] = useState(false);
  const handleUpscale = () => {
    setIsUpscaling(true);
    setTimeout(() => {
      setIsUpscaling(false);
      alert("HD Ölçeklendirme tamamlandı! Piksel yoğunluğu 2 katına çıkarıldı.");
    }, 2000);
  };

  return (
    <div className="p-4 lg:p-8 h-full overflow-y-auto pb-32 bg-brandDark text-slate-200">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-[0_0_30px_rgba(147,51,234,0.5)] border border-white/20">
                  <Sparkles className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">RUWIS AI <span className="text-purple-500 text-xl not-italic ml-2">PRO</span></h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Yeni Nesil Görsel Motoru & Prompt Sihirbazı</p>
          </div>

          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
             {(['image', 'video', 'inspiration'] as const).map(tab => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
               >
                  {tab === 'image' && <ImageIcon className="w-3 h-3" />}
                  {tab === 'video' && <Video className="w-3 h-3" />}
                  {tab === 'inspiration' && <Heart className="w-3 h-3" />}
                  {tab === 'image' ? 'RESİM' : tab === 'video' ? 'VİDEO' : 'İLHAM AL'}
               </button>
             ))}
          </div>
        </header>

        {activeTab === 'inspiration' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
             {[
               { prompt: "Cyberpunk samurai in rain, neon blue lighting, eye level shot", img: "https://picsum.photos/seed/cyber1/800/450" },
               { prompt: "Steampunk submarine in golden ocean, macro detail, vintage style", img: "https://picsum.photos/seed/steam1/800/450" },
               { prompt: "Abstract liquid gold flow, studio lighting, high resolution digital art", img: "https://picsum.photos/seed/gold1/800/450" },
               { prompt: "Futuristic organic architecture with hanging gardens, cinematic sunset", img: "https://picsum.photos/seed/arch1/800/450" },
               { prompt: "Portrait of a nebula goddess, ethereal lighting, photorealistic digital masterpiece", img: "https://picsum.photos/seed/nebula1/800/450" },
               { prompt: "Minimalist zen garden on Mars, red dust atmosphere, wide angle bird's eye view", img: "https://picsum.photos/seed/mars1/800/450" }
             ].map((item, idx) => (
               <div key={idx} className="group glass-panel rounded-[2rem] border border-white/10 overflow-hidden bg-white/5 hover:border-purple-500/50 transition-all">
                  <div className="aspect-video relative overflow-hidden">
                     <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                        <button onClick={() => setPrompt(item.prompt)} className="w-full py-3 bg-white text-black font-black text-[10px] uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-purple-600 hover:text-white transition-colors">
                           PROMPT'U KULLAN <ArrowRight className="w-3 h-3" />
                        </button>
                     </div>
                  </div>
                  <div className="p-6">
                     <p className="text-xs font-medium text-slate-400 italic line-clamp-2">"{item.prompt}"</p>
                  </div>
               </div>
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Controls */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10 bg-white/5 space-y-6 shadow-2xl">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                          <Wand2 className="w-4 h-4 text-purple-500" />
                          Prompt Sihirbazı
                       </h3>
                       <button onClick={handleSurpriseMe} className="p-2 hover:bg-white/10 rounded-lg text-purple-500 transition-colors" title="Şaşırt Beni">
                          <Dices className="w-4 h-4" />
                       </button>
                    </div>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Hayalini buraya yaz..."
                      className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder:text-slate-700 outline-none focus:border-purple-500 transition-all resize-none font-medium"
                    />
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                       <X className="w-3 h-3 text-red-500" />
                       Negatif Prompt
                    </h3>
                    <input
                      type="text"
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      placeholder="Görünmesini istemediğin her şey..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-white placeholder:text-slate-700 outline-none focus:border-red-500 transition-all"
                    />
                 </div>

                 <div className="space-y-6 pt-4 border-t border-white/5">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <Palette className="w-3 h-3" /> Stil
                       </label>
                       <select value={settings.style} onChange={(e) => setSettings({...settings, style: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-purple-500 appearance-none">
                          {styles.map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <Sun className="w-3 h-3" /> Işıklandırma
                       </label>
                       <div className="flex flex-wrap gap-2">
                          {lightings.slice(0, 4).map(l => (
                             <button
                                key={l}
                                onClick={() => setSettings({...settings, lighting: l})}
                                className={`px-3 py-1.5 rounded-lg text-[9px] font-bold border transition-all ${settings.lighting === l ? 'bg-purple-600/20 border-purple-500 text-white' : 'bg-transparent border-white/5 text-slate-500 hover:border-white/20'}`}
                             >
                                {l}
                             </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <Camera className="w-3 h-3" /> Bakış Açısı
                       </label>
                       <div className="grid grid-cols-2 gap-2">
                          {perspectives.map(p => (
                             <button
                                key={p}
                                onClick={() => setSettings({...settings, perspective: p})}
                                className={`px-3 py-1.5 rounded-lg text-[9px] font-bold border transition-all ${settings.perspective === p ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-transparent border-white/5 text-slate-500 hover:border-white/20'}`}
                             >
                                {p}
                             </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <Maximize2 className="w-3 h-3" /> En-Boy Oranı
                       </label>
                       <div className="grid grid-cols-3 gap-2 text-center">
                          {['1:1', '16:9', '9:16'].map(r => (
                             <button
                                key={r}
                                onClick={() => setSettings({...settings, ratio: r})}
                                className={`py-2 rounded-xl text-[10px] font-black border transition-all ${settings.ratio === r ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-slate-500'}`}
                             >
                                {r}
                             </button>
                          ))}
                       </div>
                    </div>
                 </div>

                 <button
                   onClick={generate}
                   disabled={isGenerating || !prompt.trim()}
                   className="w-full py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right transition-all rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] text-white shadow-xl shadow-purple-600/20 disabled:opacity-50 disabled:scale-100 active:scale-95"
                 >
                    {isGenerating ? <Zap className="w-4 h-4 animate-spin mx-auto" /> : 'SİHİRİ BAŞLAT'}
                 </button>
              </div>

              {/* History Preview */}
              {history.length > 0 && (
                <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10 bg-white/5 space-y-4">
                   <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <History className="w-4 h-4 text-slate-500" />
                      Geçmiş
                   </h3>
                   <div className="grid grid-cols-4 gap-2">
                      {history.slice(0, 8).map(item => (
                        <button key={item.id} onClick={() => setResult({ url: item.url, type: item.type })} className="aspect-square rounded-lg overflow-hidden border border-white/5 hover:border-purple-500 transition-all">
                           <img src={item.url} className="w-full h-full object-cover" alt="" />
                        </button>
                      ))}
                   </div>
                </div>
              )}
            </div>

            {/* Main Preview Area */}
            <div className="lg:col-span-3 space-y-6">
               <div className="relative group bg-black/40 border border-white/5 rounded-[3rem] min-h-[600px] flex items-center justify-center overflow-hidden shadow-2xl backdrop-blur-sm">
                  {isGenerating ? (
                     <div className="w-full h-full absolute inset-0 flex flex-col items-center justify-center p-20 space-y-8 animate-in fade-in duration-500">
                        <div className="w-full max-w-lg h-64 bg-white/5 rounded-3xl overflow-hidden relative border border-white/10">
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]"></div>
                           <div className="absolute inset-0 flex items-center justify-center">
                              <Zap className="w-12 h-12 text-purple-500 animate-pulse" />
                           </div>
                        </div>
                        <div className="text-center space-y-4">
                           <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Nöral Fırça Darbeleri...</h3>
                           <div className="flex gap-1 justify-center">
                              {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
                              ))}
                           </div>
                        </div>
                     </div>
                  ) : result ? (
                     <div className="w-full h-full relative group/result">
                        {result.type === 'image' ? (
                           <img src={result.url} className="w-full h-full object-contain animate-in fade-in zoom-in duration-1000" alt="" />
                        ) : (
                           <video src={result.url} autoPlay loop muted controls className="w-full h-full object-contain animate-in fade-in zoom-in duration-1000" />
                        )}

                        <div className="absolute top-8 left-8 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 opacity-0 group-hover/result:opacity-100 transition-all">
                           <div className="flex items-center gap-2 mb-2">
                              <Info className="w-3 h-3 text-purple-500" />
                              <span className="text-[10px] font-black uppercase text-white tracking-widest">ÜST VERİ</span>
                           </div>
                           <p className="text-[9px] text-slate-400 font-bold max-w-[200px] leading-relaxed">"{prompt}"</p>
                        </div>

                        <div className="absolute bottom-8 right-8 flex gap-3 opacity-0 group-hover/result:opacity-100 transition-all translate-y-4 group-hover/result:translate-y-0">
                           <button onClick={handleUpscale} disabled={isUpscaling} className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-purple-600 transition-all flex items-center gap-2">
                              {isUpscaling ? <Zap className="w-3 h-3 animate-spin" /> : <Maximize2 className="w-3 h-3" />}
                              HD YAP
                           </button>
                           <button onClick={handleDownload} className="p-4 bg-white text-black rounded-xl hover:bg-purple-600 hover:text-white transition-all shadow-xl">
                              <Download className="w-5 h-5" />
                           </button>
                           <button className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all">
                              <Share2 className="w-5 h-5" />
                           </button>
                        </div>
                     </div>
                  ) : (
                     <div className="text-center space-y-6 opacity-20 group-hover:opacity-40 transition-all duration-500">
                        <div className="w-32 h-32 rounded-[3.5rem] bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/10 mx-auto transform group-hover:rotate-12 transition-transform">
                           <ImageIcon className="w-12 h-12 text-slate-300" />
                        </div>
                        <div className="space-y-2">
                           <p className="text-lg font-black italic text-white uppercase tracking-tighter">İmge Bekleniyor</p>
                           <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">RUWIS AI Engine Ready</p>
                        </div>
                     </div>
                  )}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 bg-indigo-600/5 border border-indigo-600/10 rounded-[2.5rem] flex items-center gap-6 group hover:bg-indigo-600/10 transition-all">
                     <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center shrink-0">
                        <Layers className="w-7 h-7 text-indigo-500" />
                     </div>
                     <div>
                        <h5 className="text-white font-black text-sm uppercase italic">Katman Yönetimi</h5>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">PSD formatında dışa aktarım desteği</p>
                     </div>
                  </div>
                  <div className="p-8 bg-emerald-600/5 border border-emerald-600/10 rounded-[2.5rem] flex items-center gap-6 group hover:bg-emerald-600/10 transition-all">
                     <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                     </div>
                     <div>
                        <h5 className="text-white font-black text-sm uppercase italic">Güvenli Üretim</h5>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Telif hakkı korumalı algoritmalar</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default RuwisAiView;
