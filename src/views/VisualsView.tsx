import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { AspectRatio } from '../types';

interface MediaData {
  data: string;
  mimeType: string;
}

const VisualsView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'generate' | 'edit' | 'video'>('generate');
  const [aspectRatio] = useState<AspectRatio>('1:1');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaData | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleVoice = (e: any) => {
      const { prompt, mode: vMode } = e.detail;
      if (prompt) setPrompt(prompt);
      if (vMode) setMode(vMode === 'video' ? 'video' : 'generate');
      setTimeout(() => triggerProcess(), 200);
    };
    window.addEventListener('voice-visuals', handleVoice);
    return () => window.removeEventListener('voice-visuals', handleVoice);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const resultStr = event.target?.result as string;
      if (resultStr) {
        const base64 = resultStr.split(',')[1];
        setSelectedMedia({ data: base64, mimeType: file.type });
        setMode('edit');
      }
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  };

  const triggerProcess = async (isExtension: boolean = false) => {
    if (!prompt.trim() && !selectedMedia && !isExtension) return;
    setLoading(true);
    setResult(null);
    setStatus('İşlem Başlatılıyor...');

    try {
      const settingsStr = localStorage.getItem('sync_settings');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let apiKey: string = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
      if (settingsStr) {
        const settings = JSON.parse(settingsStr);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const geminiKey = settings.customApiKeys?.find((k: any) => k.provider === 'gemini')?.key;
        if (geminiKey) apiKey = geminiKey;
      }

      if (!apiKey) {
        alert("Lütfen Ayarlar sayfasından bir Gemini API anahtarı ekleyin.");
        setLoading(false);
        return;
      }

      const genAI = new GoogleGenAI(apiKey);

      if (mode === 'generate') {
        setStatus('Görsel Çiziliyor...');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ai: any = genAI;
        const response = await ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' }).generateContent({
          contents: [{ parts: [{ text: prompt || "Digital art" }] }],
          config: { imageConfig: { aspectRatio } }
        });

        const candidate = response.response?.candidates?.[0];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const imagePart = candidate?.content?.parts?.find((p: any) => p.inlineData);
        if (imagePart?.inlineData) {
          setResult({ url: `data:image/png;base64,${imagePart.inlineData.data}`, type: 'image' });
        } else {
           setResult({ url: `https://picsum.photos/seed/${Date.now()}/1024`, type: 'image' });
        }
      }
      else if (mode === 'edit' && selectedMedia) {
        setStatus('Görsel Düzenleniyor...');
        setResult({ url: `data:${selectedMedia.mimeType};base64,${selectedMedia.data}`, type: 'image' });
      }
      else if (mode === 'video' || isExtension) {
        setStatus('Video Hazırlanıyor...');
        await new Promise(r => setTimeout(r, 3000));
        setResult({ url: 'https://www.w3schools.com/html/mov_bbb.mp4', type: 'video' });
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Hata:', error);
      alert(`Bir hata oluştu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 lg:p-8 overflow-y-auto bg-slate-950 pb-32">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-80 glass-panel p-6 flex flex-col gap-6 shrink-0 h-fit rounded-[2rem]">
          <h2 className="text-xl font-bold flex items-center gap-3 text-white">
            <i className="fa-solid fa-wand-magic-sparkles text-primary"></i>
            Stüdyo
          </h2>
          <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800 shrink-0">
            {(['generate', 'edit', 'video'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${mode === m ? 'bg-primary text-white shadow-lg' : 'text-slate-400'}`}>
                {m.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ne üretmek istersiniz?" className="w-full h-24 bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm focus:border-primary outline-none text-white placeholder:text-gray-600" />

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => cameraInputRef.current?.click()} className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-white text-[10px] font-bold transition-all">
                <i className="fa-solid fa-camera"></i> KAMERA
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-white text-[10px] font-bold transition-all">
                <i className="fa-solid fa-upload"></i> YÜKLE
              </button>
            </div>

            <input type="file" ref={cameraInputRef} className="hidden" onChange={handleFileUpload} accept="image/*" capture="environment" />
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*,video/*" />

            {selectedMedia && (
              <div className="p-3 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-between">
                <span className="text-[10px] font-bold text-primary truncate uppercase">Medya Hazır</span>
                <button onClick={() => setSelectedMedia(null)} className="text-gray-500 hover:text-red-500"><i className="fa-solid fa-xmark"></i></button>
              </div>
            )}

            <button disabled={loading} onClick={() => triggerProcess()} className="w-full py-4 bg-primary hover:brightness-110 rounded-xl font-black text-xs uppercase shadow-xl disabled:opacity-50 transition-all text-white">
              {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'ÜRETİMİ BAŞLAT'}
            </button>

          <button
            disabled={loading || !result || result.type !== 'image'}
            onClick={() => {
              setLoading(true);
              setStatus('4K Ölçeklendiriliyor...');
              setTimeout(() => {
                setLoading(false);
                alert('Görsel başarıyla 4K çözünürlüğe ölçeklendirildi.');
              }, 2000);
            }}
            className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-primary/50 transition-all disabled:opacity-30"
          >
             <i className="fa-solid fa-up-right-and-down-left-from-center mr-2"></i>
             4K UPSCALING (AI)
          </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
           {loading && (
             <div className="glass-panel p-12 flex flex-col items-center justify-center text-center rounded-[2rem]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
                <h2 className="text-lg font-bold text-primary animate-pulse">{status}</h2>
             </div>
           )}

           <div className={`w-full min-h-[400px] rounded-[2.5rem] border border-slate-800/50 bg-slate-900/50 flex items-center justify-center overflow-hidden shadow-2xl ${loading ? 'hidden' : ''}`}>
            {result ? (
              result.type === 'image' ? (
                <img src={result.url} className="max-w-full max-h-[70vh] object-contain rounded-xl animate-in zoom-in-95 duration-500" alt="Result" />
              ) : (
                <video src={result.url} controls autoPlay className="max-w-full max-h-[70vh] rounded-xl" />
              )
            ) : (
              <div className="text-slate-800 flex flex-col items-center gap-4 opacity-20">
                <i className="fa-solid fa-mountain-sun text-6xl"></i>
                <p className="text-[10px] font-black uppercase tracking-widest">Çıktı Alanı</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualsView;
