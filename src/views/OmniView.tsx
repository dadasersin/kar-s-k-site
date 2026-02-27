import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutGrid, Search, Cpu, Image, Music, Terminal, Shield, Zap,
    BarChart3, Globe, Code2, Rocket, ArrowRight, Star, Settings2,
    Box, Workflow, Share2, Database, Layers
} from 'lucide-react';
import { AppView } from '../types';

interface OmniViewProps {
    onViewChange: (view: AppView) => void;
}

const FEATURE_CATEGORIES = [
    { id: 'all', label: 'TÜMÜ', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'ai', label: 'YAPAY ZEKA', icon: <Cpu className="w-4 h-4" /> },
    { id: 'creativity', label: 'YARATICILIK', icon: <Image className="w-4 h-4" /> },
    { id: 'development', label: 'YAZILIM', icon: <Code2 className="w-4 h-4" /> },
    { id: 'system', label: 'SİSTEM', icon: <Settings2 className="w-4 h-4" /> },
    { id: 'data', label: 'VERİ & ANALİZ', icon: <BarChart3 className="w-4 h-4" /> },
];

const OmniView: React.FC<OmniViewProps> = ({ onViewChange }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const features = [
        { id: AppView.BUILDER, label: 'Live AI Developer', icon: <Rocket />, category: 'ai', desc: 'Gerçek zamanlı kod üretimi ve canlı önizleme.' },
        { id: AppView.ANTIGRAVITY, label: 'Antigravity Engine', icon: <Zap />, category: 'ai', desc: 'Merkezi yapay zeka yönetim motoru.' },
        { id: AppView.VISUALS, label: 'Visual Studio', icon: <Image />, category: 'creativity', desc: 'Gelişmiş görsel üretim ve işleme.' },
        { id: AppView.MUSIC, label: 'Music Studio', icon: <Music />, category: 'creativity', desc: 'AI destekli müzik ve ses üretimi.' },
        { id: AppView.WEATHER, label: 'Hava Durumu', icon: <Globe />, category: 'data', desc: 'Atmosferik analiz ve tahmin sistemi.' },
        { id: AppView.CRYPTO, label: 'Crypto Lab', icon: <BarChart3 />, category: 'data', desc: 'Kripto para piyasası ve analiz.' },
        { id: AppView.AGENTIC_CONFIG, label: 'Agentic Workflow', icon: <Workflow />, category: 'ai', desc: 'Otonom ajan ve akış yapılandırması.' },
        { id: AppView.SELINE, label: 'Seline Security', icon: <Shield />, category: 'system', desc: 'Gelişmiş güvenlik ve denetim katmanı.' },
        { id: AppView.DOCKER_AI, label: 'Docker AI', icon: <Box />, category: 'development', desc: 'Konteyner ve altyapı yönetimi.' },
        { id: AppView.GITHUB_SYNC, label: 'GitHub Sync', icon: <Share2 />, category: 'development', desc: 'Otomatik kaynak kod senkronizasyonu.' },
        { id: AppView.ANALYTICS, label: 'System Analytics', icon: <Layers />, category: 'data', desc: 'Derin sistem performansı ve veri analizi.' },
        // more features can be added here
    ];

    const filteredFeatures = features.filter(f => {
        const matchesSearch = f.label.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'all' || f.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="p-6 lg:p-12 animate-in fade-in duration-1000 min-h-screen pb-32 bg-brandDark">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <header className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-primary">
                                <LayoutGrid className="w-5 h-5" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Integrated Hub</span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
                                OMNI<span className="text-primary tracking-normal not-italic">VIEW</span>
                            </h1>
                            <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mt-4">Tüm Sistem Gücü Tek Bir Noktada</p>
                        </div>

                        <div className="w-full md:w-96 relative group">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Özelliklerde ara..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm text-white focus:border-primary/50 outline-none transition-all placeholder:text-slate-600 backdrop-blur-md"
                            />
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
                        </div>
                    </div>

                    {/* Category Navigation */}
                    <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar border-b border-white/5">
                        {FEATURE_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeCategory === cat.id
                                        ? 'bg-primary text-white shadow-[0_0_20px_rgba(13,89,242,0.4)]'
                                        : 'bg-white/5 text-slate-500 hover:bg-white/10 border border-white/5 hover:border-white/10'
                                    }`}
                            >
                                {cat.icon}
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredFeatures.map((feature) => (
                            <motion.div
                                key={feature.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -5 }}
                                onClick={() => onViewChange(feature.id)}
                                className="group relative cursor-pointer"
                            >
                                <div className="absolute -inset-px bg-gradient-to-br from-primary/50 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
                                <div className="glass-panel relative p-8 rounded-[2.5rem] border border-white/10 bg-white/5 hover:bg-white/10 transition-all overflow-hidden h-full flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                {React.cloneElement(feature.icon as React.ReactElement, { className: 'w-7 h-7' })}
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[8px] font-black text-primary uppercase">Başlat</span>
                                                <ArrowRight className="w-3 h-3 text-primary" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold text-white uppercase tracking-tight">{feature.label}</h3>
                                            <p className="text-slate-500 text-xs leading-relaxed">{feature.desc}</p>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex items-center justify-between">
                                        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                                            {feature.category}
                                        </div>
                                        <Star className="w-3 h-3 text-white/10 group-hover:text-primary transition-colors" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* AI Orchestration Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-panel p-10 rounded-[3rem] border border-primary/30 bg-gradient-to-br from-primary/20 to-transparent relative overflow-hidden group shadow-2xl shadow-primary/5"
                >
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                        <Rocket className="w-64 h-64 text-white" />
                    </div>
                    <div className="relative z-10 space-y-6 max-w-2xl">
                        <h2 className="text-3xl lg:text-4xl font-black text-white italic tracking-tighter uppercase">Omni Orchestrator</h2>
                        <p className="text-slate-300 text-sm leading-relaxed font-medium">
                            Sistemin tüm gücünü tek bir komutla birleştirin. Yapay zeka motorumuz tüm aktif modülleri koordine ederek karmaşık görevleri otonom olarak tamamlayabilir.
                        </p>
                        <button className="flex items-center gap-3 bg-white text-brandDark px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95">
                            Omni Panel'i Başlat
                            <Zap className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OmniView;
