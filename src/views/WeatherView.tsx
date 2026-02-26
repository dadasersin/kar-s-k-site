import React, { useState } from 'react';
import { Cloud, Sun, CloudRain, Wind, MapPin, Calendar, ArrowRight, Droplets, Sunrise, Sunset, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const WeatherView: React.FC = () => {
    const [city, setCity] = useState('İstanbul');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    // Simulated weather data
    const weatherData = {
        temp: 18,
        condition: 'Parçalı Bulutlu',
        high: 22,
        low: 14,
        humidity: 65,
        wind: 12,
        feelsLike: 17,
        uvIndex: 4,
        visibility: 10,
        pressure: 1012,
        forecast: [
            { day: 'Paz', temp: 20, condition: 'Güneşli' },
            { day: 'Pzt', temp: 19, condition: 'Bulutlu' },
            { day: 'Sal', temp: 17, condition: 'Yağmurlu' },
            { day: 'Çar', temp: 18, condition: 'Parçalı Bulutlu' },
            { day: 'Per', temp: 21, condition: 'Güneşli' },
        ]
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setLoading(true);
        setTimeout(() => {
            setCity(searchQuery);
            setLoading(false);
            setSearchQuery('');
        }, 1000);
    };

    return (
        <div className="p-4 lg:p-12 animate-in fade-in duration-700 min-h-screen pb-32 bg-brandDark">
            <div className="max-w-6xl mx-auto space-y-10">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(13,89,242,0.3)]">
                                <Cloud className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Hava Durumu</h1>
                                <p className="text-slate-500 text-[10px] font-black tracking-[0.3em] uppercase mt-2">Atmosferik Analiz & Tahmin Sistemi</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="w-full md:w-96 relative group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Şehir ara..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-primary/50 outline-none transition-all placeholder:text-slate-600"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
                    </form>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Current Weather Card */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel p-10 rounded-[3rem] border border-white/10 bg-gradient-to-br from-white/10 to-transparent shadow-2xl relative overflow-hidden h-full min-h-[400px]"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-10">
                                <Cloud className="w-64 h-64 text-white" />
                            </div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-primary">
                                            <MapPin className="w-4 h-4" />
                                            <span className="text-xs font-black uppercase tracking-widest">{city}</span>
                                        </div>
                                        <h2 className="text-8xl font-black text-white tracking-tighter italic">{weatherData.temp}°</h2>
                                        <p className="text-xl font-bold text-slate-300 uppercase tracking-tight">{weatherData.condition}</p>
                                    </div>
                                    <div className="bg-primary/20 border border-primary/30 p-4 rounded-3xl flex flex-col items-center">
                                        <Sun className="w-10 h-10 text-primary mb-2 animate-pulse" />
                                        <span className="text-[10px] font-black text-white uppercase">{new Date().toLocaleDateString('tr-TR', { weekday: 'long' })}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 bg-black/30 p-8 rounded-[2rem] border border-white/5 backdrop-blur-md">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hissedilen</p>
                                        <p className="text-xl font-bold text-white">{weatherData.feelsLike}°</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nem</p>
                                        <p className="text-xl font-bold text-white">%{weatherData.humidity}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rüzgar</p>
                                        <p className="text-xl font-bold text-white">{weatherData.wind} km/s</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">UV İndeksi</p>
                                        <p className="text-xl font-bold text-white">{weatherData.uvIndex}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Forecast Sidebar */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-surface/30 shadow-xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] italic">5 Günlük Tahmin</h3>
                                <Calendar className="w-4 h-4 text-slate-500" />
                            </div>

                            <div className="space-y-6">
                                {weatherData.forecast.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
                                        <span className="text-xs font-bold text-slate-400 w-12">{item.day}</span>
                                        <div className="flex items-center gap-3">
                                            {item.condition === 'Güneşli' ? <Sun className="w-4 h-4 text-yellow-500" /> :
                                                item.condition === 'Yağmurlu' ? <CloudRain className="w-4 h-4 text-blue-500" /> :
                                                    <Cloud className="w-4 h-4 text-slate-400" />}
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">{item.condition}</span>
                                        </div>
                                        <span className="text-sm font-black text-white">{item.temp}°</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-white/5 flex flex-col items-center justify-center space-y-2">
                                <Sunrise className="w-6 h-6 text-orange-500" />
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Gün Doğumu</p>
                                <p className="text-sm font-bold text-white">07:12</p>
                            </div>
                            <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-white/5 flex flex-col items-center justify-center space-y-2">
                                <Sunset className="w-6 h-6 text-primary" />
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Gün Batımı</p>
                                <p className="text-sm font-bold text-white">18:45</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Görünürlük', value: `${weatherData.visibility} km`, icon: <MapPin className="w-4 h-4" /> },
                        { label: 'Basınç', value: `${weatherData.pressure} hPa`, icon: <ArrowRight className="w-4 h-4" /> },
                        { label: 'Çiy Noktası', value: '11°', icon: <Droplets className="w-4 h-4" /> },
                        { label: 'Rüzgar Gülü', value: 'KKB', icon: <Wind className="w-4 h-4" /> },
                    ].map((stat, i) => (
                        <div key={i} className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500">
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-lg font-bold text-white uppercase">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeatherView;
