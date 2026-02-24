import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Video, Wand2, Download, Share2, Zap, Settings, History, Palette, Layers, Maximize2 } from 'lucide-react';
import { getAvailableKeys } from '../utils/apiPool';

const RuwisAiView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [settings, setSettings] = useState({
    ratio: '16:9',
    quality: '4K',
    style: 'Cinematic',
    steps: 50
  });

  const generate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setResult(null);

    // Simulate Ruwis AI Generation Logic
    // In a real implementation, this would use specific endpoints or the apiPool
    await new Promise(r => setTimeout(r, 4000));

    if (activeTab === 'image') {
      setResult({
        url: `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1920/1080`,
        type: 'image'
      });
    } else {
      setResult({
        url: 'https://www.w3schools.com/html/mov_bbb.mp4', // Placeholder video
        type: 'video'
      });
    }
    setIsGenerating(false);
  };

  return (
    <div className="p-4 lg:p-8 h-full overflow-y-auto pb-32 bg-brandDark">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.4)]">
                  <Sparkles className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">RUWIS AI</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Profesyonel Görsel & Video Üretim Merkezi</p>
          </div>

          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
             <button
               onClick={() => setActiveTab('image')}
               className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'image' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
             >
                <ImageIcon className="w-3 h-3" /> RESİM ÜRETİCİ
             </button>
             <button
               onClick={() => setActiveTab('video')}
               className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'video' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
             >
                <Video className="w-3 h-3" /> VİDEO ÜRETİCİ
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10 bg-white/5 space-y-8">
               <div className="space-y-4">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                     <Wand2 className="w-4 h-4 text-purple-500" />
                     Prompt Mühendisi
                  </h3>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={activeTab === 'image' ? "Bir siberpunk şehir manzarası hayal et..." : "Yağmurlu bir sokakta yürüyen robot..."}
                    className="w-full h-40 bg-black/40 border border-white/10 rounded-3xl p-6 text-sm text-white placeholder:text-slate-700 outline-none focus:border-purple-500 transition-all resize-none font-medium"
                  />
               </div>

               <div className="space-y-6">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Görünüm Oranı</label>
                     <div className="grid grid-cols-3 gap-2">
                        {['16:9', '4:3', '1:1'].map(r => (
                           <button
                             key={r}
                             onClick={() => setSettings({...settings, ratio: r})}
                             className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${settings.ratio === r ? 'bg-white/10 border-purple-500 text-white' : 'bg-transparent border-white/5 text-slate-500 hover:border-white/20'}`}
                           >
                              {r}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sanat Stili</label>
                     <select
                        value={settings.style}
                        onChange={(e) => setSettings({...settings, style: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-purple-500"
                     >
                        <option>Cinematic</option>
                        <option>Photorealistic</option>
                        <option>Digital Art</option>
                        <option>Anime</option>
                        <option>Oil Painting</option>
                     </select>
                  </div>

                  <div className="space-y-3">
                     <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">İşlem Adımları</label>
                        <span className="text-[10px] font-black text-purple-500">{settings.steps}</span>
                     </div>
                     <input
                        type="range"
                        min="20" max="100"
                        value={settings.steps}
                        onChange={(e) => setSettings({...settings, steps: parseInt(e.target.value)})}
                        className="w-full accent-purple-600 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
                     />
                  </div>
               </div>

               <button
                 onClick={generate}
                 disabled={isGenerating || !prompt.trim()}
                 className={`w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl ${
                    activeTab === 'image'
                    ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20 text-white'
                 } disabled:opacity-50 disabled:scale-100 active:scale-95`}
               >
                  {isGenerating ? <Zap className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {isGenerating ? 'SENTEZLENİYOR...' : 'SİHİRİ BAŞLAT'}
               </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-3 space-y-6">
             <div className="relative group bg-black/60 border border-white/10 rounded-[3rem] min-h-[600px] flex items-center justify-center overflow-hidden shadow-2xl">
                {isGenerating ? (
                   <div className="text-center space-y-8 p-20 animate-in fade-in zoom-in duration-500">
                      <div className="relative">
                         <div className="w-24 h-24 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin mx-auto"></div>
                         <div className="absolute inset-0 flex items-center justify-center">
                            <Zap className="w-8 h-8 text-purple-500 animate-pulse" />
                         </div>
                      </div>
                      <div className="space-y-3">
                         <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Nöral İşleme Devrede</h3>
                         <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] max-w-sm mx-auto leading-relaxed">
                            RUWIS AI çekirdeği piksel verilerini optimize ediyor ve sanatsal katmanları yapılandırıyor...
                         </p>
                      </div>
                   </div>
                ) : result ? (
                   <>
                      {result.type === 'image' ? (
                        <img
                          src={result.url}
                          alt="AI Result"
                          className="w-full h-full object-contain animate-in fade-in zoom-in duration-1000"
                        />
                      ) : (
                        <video
                          src={result.url}
                          autoPlay loop muted controls
                          className="w-full h-full object-contain animate-in fade-in zoom-in duration-1000"
                        />
                      )}
                      <div className="absolute bottom-8 right-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                         <button className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all shadow-xl">
                            <Download className="w-5 h-5" />
                         </button>
                         <button className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all shadow-xl">
                            <Share2 className="w-5 h-5" />
                         </button>
                         <button className="p-4 bg-purple-600 border border-purple-500 rounded-2xl text-white hover:bg-purple-500 transition-all shadow-xl shadow-purple-600/40">
                            <Maximize2 className="w-5 h-5" />
                         </button>
                      </div>
                   </>
                ) : (
                   <div className="text-center space-y-6 opacity-30 group-hover:opacity-50 transition-opacity">
                      <div className="w-32 h-32 rounded-[3rem] bg-white/5 flex items-center justify-center border border-white/10 mx-auto">
                         <Palette className="w-12 h-12 text-slate-500" />
                      </div>
                      <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white">Bekleme Modu: Girdi Bekleniyor</p>
                   </div>
                )}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-purple-600/5 border border-purple-600/10 rounded-3xl flex items-center gap-4 group hover:bg-purple-600/10 transition-all cursor-pointer">
                   <div className="p-3 bg-purple-600/20 rounded-xl">
                      <History className="w-5 h-5 text-purple-500" />
                   </div>
                   <div>
                      <p className="text-white font-bold text-xs uppercase tracking-tight">Üretim Geçmişi</p>
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Son 24 saatteki çalışmalar</p>
                   </div>
                </div>
                <div className="p-6 bg-blue-600/5 border border-blue-600/10 rounded-3xl flex items-center gap-4 group hover:bg-blue-600/10 transition-all cursor-pointer">
                   <div className="p-3 bg-blue-600/20 rounded-xl">
                      <Layers className="w-5 h-5 text-blue-500" />
                   </div>
                   <div>
                      <p className="text-white font-bold text-xs uppercase tracking-tight">Katmanlı Çıktı</p>
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">PSD & Maske Desteği</p>
                   </div>
                </div>
                <div className="p-6 bg-emerald-600/5 border border-emerald-600/10 rounded-3xl flex items-center gap-4 group hover:bg-emerald-600/10 transition-all cursor-pointer">
                   <div className="p-3 bg-emerald-600/20 rounded-xl">
                      <Settings className="w-5 h-5 text-emerald-500" />
                   </div>
                   <div>
                      <p className="text-white font-bold text-xs uppercase tracking-tight">Gelişmiş Ayarlar</p>
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Model Parametre Kontrolü</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuwisAiView;
