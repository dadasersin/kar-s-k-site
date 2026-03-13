import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { executeAiRequest } from '../utils/apiPool';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { recordAction } from '../utils/history';

interface AudioRemix {
  id: string;
  originalName: string;
  remixUrl: string;
  prompt: string;
  timestamp: number;
}

const AudioView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<AudioRemix[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'library'>('create');

  useEffect(() => {
    setLogs(getStorageItem('audio_remixes', []));
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    recordAction('Ses Stüdyosu', `Yeni beste talebi: ${prompt}`);

    try {
      // Simulate composition logic with real AI metadata
      const response = await executeAiRequest(`Sen bir müzik prodüktörüsün. Şu konsept için teknik beste notları (BPM, Key, Enstrümantasyon, Aranjman) üret: "${prompt}"`);

      const newRemix: AudioRemix = {
        id: Date.now().toString(),
        originalName: "Nöral Kompozisyon #" + (logs.length + 1),
        remixUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        prompt: prompt + " | Yapım Notları: " + response.text.substring(0, 150),
        timestamp: Date.now()
      };

      const updated = [newRemix, ...logs];
      setLogs(updated);
      setStorageItem('audio_remixes', updated);
      setActiveTab('library');
      setPrompt('');
    } catch (e: any) {
        alert("Beste hatası: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 p-4 lg:p-12 overflow-y-auto bg-brandDark/20 pb-32">
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
        <header className="flex justify-between items-end border-b border-white/5 pb-8">
            <div>
                <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Ses <span className="text-primary">Stüdyosu</span></h2>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-4">Nöral Ses Sentezi & Aranjman Merkezi</p>
            </div>
            <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
                <button onClick={() => setActiveTab('create')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'create' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>BESTE YAP</button>
                <button onClick={() => setActiveTab('library')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'library' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>KİTAPLIK</button>
            </div>
        </header>

        {activeTab === 'create' ? (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="portal-card p-8 bg-brandDark/40">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Müzikal Konsept</h3>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Müzikal tarzı, ruh halini ve enstrümanları tanımlayın..."
                  className="w-full h-48 bg-black/40 border border-white/5 rounded-[2rem] p-8 text-sm text-white focus:border-primary/50 outline-none transition-all resize-none mb-8"
                />
                <button
                  onClick={handleGenerate}
                  disabled={isProcessing || !prompt.trim()}
                  className="w-full py-6 bg-primary hover:brightness-110 disabled:bg-slate-800 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  {isProcessing ? <i className="fa-solid fa-compact-disc animate-spin"></i> : <i className="fa-solid fa-wand-sparkles"></i>}
                  <span>{isProcessing ? 'SENTEZLENİYOR...' : 'BESTEYİ OLUŞTUR'}</span>
                </button>
              </div>
            </div>
            <div className="portal-card p-6 bg-brandDark/20 h-fit border-dashed">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Akıllı Aranjör</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-bold">Portal ses motoru, promptlarınızı harmonik yapılara dönüştürerek profesyonel aranjmanlar hazırlar. Tüm üretimler API kotasına dahildir.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {logs.length === 0 ? (
                <div className="py-32 text-center text-slate-700 opacity-30">
                    <i className="fa-solid fa-music text-7xl mb-6"></i>
                    <p className="uppercase tracking-[0.4em] text-xs">Henüz üretim yapılmadı.</p>
                </div>
            ) : (
                logs.map(remix => (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} key={remix.id} className="portal-card p-6 flex flex-col md:flex-row items-center gap-8 group">
                        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <i className="fa-solid fa-play text-xl"></i>
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-1">
                            <h4 className="text-sm font-black text-white uppercase tracking-widest">{remix.originalName}</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase truncate max-w-md">{remix.prompt}</p>
                            <p className="text-[8px] text-slate-600 font-black">{new Date(remix.timestamp).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">İNDİR</button>
                            <button onClick={() => {
                                const upd = logs.filter(l => l.id !== remix.id);
                                setLogs(upd);
                                setStorageItem('audio_remixes', upd);
                            }} className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><i className="fa-solid fa-trash-can text-xs"></i></button>
                        </div>
                    </motion.div>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioView;
