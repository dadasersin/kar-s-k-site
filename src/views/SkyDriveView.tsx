import React, { useState, useEffect } from 'react';
import { executeAiRequest } from '../utils/apiPool';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { recordAction } from '../utils/history';

interface SkyMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  timestamp: number;
}

const SkyDriveView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [gallery, setGallery] = useState<SkyMedia[]>([]);
    const [siteTitle, setSiteTitle] = useState('NEXUS SKYDRIVE');

    useEffect(() => {
        setGallery(getStorageItem('skydrive_gallery', []));
        setSiteTitle(getStorageItem('skydrive_title', 'NEXUS SKYDRIVE'));
    }, []);

    const handleUpdateTitle = (newTitle: string) => {
        setSiteTitle(newTitle);
        setStorageItem('skydrive_title', newTitle);
    };

    const generateMedia = async (type: 'image' | 'video') => {
        if (!prompt.trim()) return;
        setLoading(true);
        setStatus(type === 'image' ? 'Tasarım Oluşturuluyor...' : 'Sahne Simüle Ediliyor...');
        recordAction('SkyDrive AI', `${type === 'image' ? 'Görsel' : 'Video'} üretimi başlatıldı: ${prompt}`);

        try {
            // Use real AI to generate descriptions/technical specs, but simulate the visual output for now
            // as we don't have a direct DALL-E/Sora hook yet, but this records the usage.
            await executeAiRequest(`Sen bir havacılık mühendisisin. Şu araç için teknik görsel betimleme yap: ${prompt}`);

            const newMedia: SkyMedia = {
                id: Date.now().toString(),
                type,
                url: type === 'image'
                    ? `https://images.unsplash.com/photo-1559297434-2d8a134e042e?q=80&w=1000&auto=format&fit=crop`
                    : `https://www.w3schools.com/html/mov_bbb.mp4`,
                prompt: prompt,
                timestamp: Date.now()
            };

            const updated = [newMedia, ...gallery];
            setGallery(updated);
            setStorageItem('skydrive_gallery', updated);
        } catch (e: any) {
            alert("Üretim hatası: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 p-4 lg:p-12 overflow-y-auto bg-[#0a0a1a] pb-40">
            <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in duration-1000">
                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/5 pb-12">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center border border-primary/40 shadow-[0_0_40px_rgba(13,89,242,0.3)]">
                            <i className="fa-solid fa-jet-fighter text-4xl text-primary animate-pulse"></i>
                        </div>
                        <div>
                            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                                SkyDrive <span className="text-primary tracking-widest not-italic font-light">AI</span>
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Nexus Admin Aktif</div>
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="glass-panel px-6 py-4 rounded-3xl border border-white/10 bg-white/5">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Yönetici Paneli</p>
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    value={siteTitle}
                                    onChange={(e) => setSiteTitle(e.target.value)}
                                    className="bg-transparent border-none outline-none text-white font-bold text-sm border-b border-white/10 focus:border-primary transition-all"
                                />
                                <button onClick={() => handleUpdateTitle(siteTitle)} className="text-primary hover:scale-110 transition-transform"><i className="fa-solid fa-check"></i></button>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="grid lg:grid-cols-2 gap-8 items-start">
                    <div className="glass-panel p-8 lg:p-10 rounded-[3rem] border border-white/10 bg-black/40 backdrop-blur-3xl shadow-2xl space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-wider">Komut Merkezi</h2>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Uçan araba parametrelerini girin</p>
                        </div>

                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Örn: Krom kaplamalı, neon ışıklı, dikey kalkış yapabilen bir SkyDrive prototipi..."
                            className="w-full h-40 bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-lg placeholder:text-slate-700 focus:border-primary outline-none transition-all resize-none font-medium"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                disabled={loading}
                                onClick={() => generateMedia('image')}
                                className="group relative h-20 bg-primary hover:bg-primary/80 rounded-3xl overflow-hidden transition-all active:scale-95 disabled:opacity-50"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative flex items-center justify-center gap-3 text-white font-black uppercase text-xs tracking-widest">
                                    <i className="fa-solid fa-image text-xl"></i>
                                    TASARIM ÜRET
                                </div>
                            </button>
                            <button
                                disabled={loading}
                                onClick={() => generateMedia('video')}
                                className="group relative h-20 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl overflow-hidden transition-all active:scale-95 disabled:opacity-50"
                            >
                                <div className="relative flex items-center justify-center gap-3 text-white font-black uppercase text-xs tracking-widest">
                                    <i className="fa-solid fa-clapperboard text-xl text-primary"></i>
                                    VİDEO ÜRET
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="relative aspect-square lg:aspect-auto lg:h-[450px] rounded-[3rem] border border-white/10 bg-slate-900 overflow-hidden shadow-2xl group">
                        {loading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl z-20">
                                <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6 shadow-[0_0_30px_rgba(13,89,242,0.5)]"></div>
                                <h3 className="text-xl font-black text-white italic tracking-widest uppercase animate-pulse">{status}</h3>
                            </div>
                        ) : gallery.length > 0 ? (
                            gallery[0].type === 'image' ? (
                                <img src={gallery[0].url} className="w-full h-full object-cover animate-in zoom-in-110 duration-[20s] linear repeat-infinite" />
                            ) : (
                                <video src={gallery[0].url} autoPlay loop muted className="w-full h-full object-cover" />
                            )
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 opacity-20">
                                <i className="fa-solid fa-jet-fighter-up text-8xl mb-6"></i>
                                <p className="font-black uppercase tracking-[0.5em] text-xs">Bekleme Modu: Görüntü Analizi Hazır</p>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                        {gallery.length > 0 && (
                            <div className="absolute bottom-8 left-8 right-8">
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Sonuç Önizleme</p>
                                <h4 className="text-white font-bold truncate text-lg italic">"${gallery[0].prompt}"</h4>
                            </div>
                        )}
                    </div>
                </section>

                <section className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">SkyDrive <span className="text-blue-500">Galerisi</span></h3>
                        <button onClick={() => {
                            setGallery([]);
                            setStorageItem('skydrive_gallery', []);
                        }} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-red-500/20">TÜMÜNÜ TEMİZLE</button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {gallery.map((media) => (
                            <div key={media.id} className="group relative aspect-square rounded-3xl overflow-hidden border border-white/5 bg-white/5 hover:border-primary/50 transition-all cursor-pointer shadow-xl">
                                {media.type === 'image' ? (
                                    <img src={media.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={media.prompt} />
                                ) : (
                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                        <i className="fa-solid fa-play text-primary text-2xl"></i>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                                    <p className="text-[8px] font-black text-white uppercase tracking-wider line-clamp-2">{media.prompt}</p>
                                    <div className="flex gap-2 mt-3">
                                        <button className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs hover:scale-110 transition-transform"><i className="fa-solid fa-download"></i></button>
                                        <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xs hover:scale-110 transition-transform"><i className="fa-solid fa-eye"></i></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SkyDriveView;
