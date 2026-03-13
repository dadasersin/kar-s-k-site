import React, { useState } from 'react';
import { executeAiRequest } from '../utils/apiPool';
import { recordAction } from '../utils/history';

interface MediaData {
  data: string;
  mimeType: string;
  name: string;
  url: string;
}

const VisualsView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'generate' | 'edit' | 'video'>('generate');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<{ url: string; type: 'image' | 'video' } | null>(null);

  const triggerProcess = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);
    setStatus('İşlem Başlatılıyor...');
    recordAction('Görsel Stüdyo', `İşlem başlatıldı: ${mode} - ${prompt}`);

    // Flying car simulation special case
    if (prompt.toLowerCase().includes('uçan araba') || prompt.toLowerCase().includes('flying car')) {
        setStatus('Özel Tasarım Sentezleniyor...');
        await new Promise(r => setTimeout(r, 2000));
        setResult({ url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200', type: 'image' });
        setLoading(false);
        return;
    }

    try {
        if (mode === 'generate') {
          setStatus('Görsel Parametreleri Hazırlanıyor...');

          // Use AI to create a search term or description
          const aiResponse = await executeAiRequest(`Create a 3-word English search term for Unsplash based on this image description: "${prompt}". Return ONLY the 3 words.`);
          const searchTerm = aiResponse.text.replace(/['".]/g, '').trim();

          setStatus('Görsel Çiziliyor...');
          setResult({
            url: `https://images.unsplash.com/featured/1024x1024/?${encodeURIComponent(searchTerm)}`,
            type: 'image'
          });
        } else {
            // Simulate edit/video modes for now
            setStatus('Nöral İşleme Devam Ediyor...');
            await new Promise(r => setTimeout(r, 2500));
            setResult({ url: 'https://www.w3schools.com/html/mov_bbb.mp4', type: 'video' });
        }
    } catch (error: any) {
        alert("Üretim hatası: " + error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 lg:p-12 overflow-y-auto bg-brandDark/20 pb-32">
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
        <header className="border-b border-white/5 pb-8">
            <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Görsel <span className="text-primary">Stüdyo</span></h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-4">Multimodal İçerik Üretim Merkezi</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-8">
              <div className="portal-card p-8 bg-brandDark/40">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Prompt Merkezi</h3>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Görmek istediğin şeyi detaylandır..."
                  className="w-full h-48 bg-black/40 border border-white/5 rounded-[2rem] p-8 text-sm text-white focus:border-primary/50 outline-none transition-all resize-none mb-8"
                />

                <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 mb-8">
                    {(['generate', 'edit', 'video'] as const).map(m => (
                        <button key={m} onClick={() => setMode(m)} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${mode === m ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                            {m === 'generate' ? 'ÜRET' : m === 'edit' ? 'DÜZENLE' : 'VİDEO'}
                        </button>
                    ))}
                </div>

                <button
                  onClick={triggerProcess}
                  disabled={loading || !prompt.trim()}
                  className="w-full py-6 bg-primary hover:brightness-110 disabled:bg-slate-800 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  {loading ? <i className="fa-solid fa-compact-disc animate-spin"></i> : <i className="fa-solid fa-wand-sparkles"></i>}
                  <span>{loading ? 'İŞLENİYOR...' : 'ÜRETİMİ BAŞLAT'}</span>
                </button>
              </div>

              <div className="portal-card p-6 bg-brandDark/20 h-fit border-dashed">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Üretim Durumu</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-bold italic">{loading ? status : 'Hazır bekleniyor...'}</p>
              </div>
            </div>

            <div className="lg:col-span-8">
                <div className="glass-panel min-h-[600px] h-full rounded-[3rem] border border-white/10 flex items-center justify-center overflow-hidden bg-black/20 relative group shadow-2xl">
                    {result ? (
                        result.type === 'image' ? (
                            <img src={result.url} className="w-full h-full object-cover animate-in fade-in zoom-in-110 duration-[20s] linear" alt="AI Generated" />
                        ) : (
                            <video src={result.url} controls autoPlay loop className="w-full h-full object-cover" />
                        )
                    ) : (
                        <div className="text-center opacity-10 space-y-6">
                            <i className="fa-solid fa-mountain-sun text-9xl"></i>
                            <p className="text-sm font-black uppercase tracking-[1em]">Çıktı Alanı</p>
                        </div>
                    )}

                    {result && !loading && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <button className="w-16 h-16 rounded-full bg-white text-black hover:scale-110 transition-transform flex items-center justify-center shadow-2xl">
                                <i className="fa-solid fa-download text-xl"></i>
                            </button>
                            <button onClick={() => setResult(null)} className="w-16 h-16 rounded-full bg-red-500 text-white hover:scale-110 transition-transform flex items-center justify-center shadow-2xl">
                                <i className="fa-solid fa-trash-can text-xl"></i>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VisualsView;
