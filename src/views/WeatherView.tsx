import React, { useState, useEffect } from 'react';
import {
  Cloud,
  CloudRain,
  CloudLightning,
  Sun,
  CloudSnow,
  Wind,
  Droplets,
  Thermometer,
  Search,
  MapPin,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: React.ReactNode;
  forecast: Array<{
    day: string;
    temp: number;
    icon: React.ReactNode;
  }>;
}

const WeatherView: React.FC = () => {
  const [city, setCity] = useState('İstanbul');
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Simulated weather data fetch
  const fetchWeather = (cityName: string) => {
    setLoading(true);
    setTimeout(() => {
      const mockWeather: WeatherData = {
        city: cityName,
        temp: Math.floor(Math.random() * 15) + 15,
        condition: 'Parçalı Bulutlu',
        humidity: 65,
        windSpeed: 12,
        description: 'Hafif rüzgarlı ve açık bir gökyüzü bekleniyor.',
        icon: <Cloud className="w-16 h-16 text-blue-400" />,
        forecast: [
          { day: 'Pzt', temp: 22, icon: <Sun className="w-6 h-6 text-yellow-400" /> },
          { day: 'Sal', temp: 20, icon: <Cloud className="w-6 h-6 text-blue-300" /> },
          { day: 'Çar', temp: 18, icon: <CloudRain className="w-6 h-6 text-blue-500" /> },
          { day: 'Per', temp: 21, icon: <Sun className="w-6 h-6 text-yellow-400" /> },
          { day: 'Cum', temp: 23, icon: <Sun className="w-6 h-6 text-yellow-400" /> },
        ]
      };
      setWeather(mockWeather);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) fetchWeather(city);
  };

  return (
    <div className="p-4 lg:p-8 min-h-full bg-brandDark text-white overflow-y-auto pb-32">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white flex items-center gap-3">
              <Cloud className="text-primary w-8 h-8" />
              Hava Durumu
            </h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Atmosferik Analiz ve Tahmin</p>
          </div>

          <form onSubmit={handleSearch} className="relative w-full md:w-64">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Şehir ara..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 pl-12 text-sm focus:border-primary outline-none transition-all placeholder:text-slate-600"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary rounded-lg text-white hover:bg-blue-600 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </header>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-96 flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Veriler Senkronize Ediliyor...</p>
              </div>
            </motion.div>
          ) : weather && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Current Weather Card */}
              <div className="md:col-span-2 glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-surface/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
                  {weather.icon}
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">{weather.city}, Türkiye</span>
                      </div>
                      <h1 className="text-7xl font-black tracking-tighter italic">{weather.temp}°</h1>
                      <p className="text-xl font-bold text-primary uppercase tracking-tighter mt-2">{weather.condition}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Droplets className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Nem</span>
                      </div>
                      <p className="font-bold text-lg text-white">%{weather.humidity}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Wind className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Rüzgar</span>
                      </div>
                      <p className="font-bold text-lg text-white">{weather.windSpeed} km/s</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Thermometer className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Hissedilen</span>
                      </div>
                      <p className="font-bold text-lg text-white">{weather.temp - 2}°</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Forecast Sidebar */}
              <div className="md:col-span-1 space-y-6">
                <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10 bg-black/40 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <Calendar className="w-4 h-4 text-primary" />
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">5 Günlük Tahmin</h3>
                  </div>

                  <div className="flex-1 flex flex-col justify-between gap-4">
                    {weather.forecast.map((day, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                        <span className="text-xs font-bold text-slate-400 w-8">{day.day}</span>
                        <div className="flex-1 flex justify-center">
                          {day.icon}
                        </div>
                        <span className="text-xs font-black text-white w-8 text-right">{day.temp}°</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Analysis */}
              <div className="md:col-span-3 glass-panel p-6 rounded-[2rem] border border-white/10 bg-surface/20 flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <CloudRain className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">AI Atmosfer Notu</h4>
                      <p className="text-xs text-slate-400 max-w-xl">{weather.description}</p>
                   </div>
                </div>
                <div className="hidden lg:block text-right">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">GÜNCELLEME</p>
                   <p className="text-[10px] font-bold text-primary italic">ŞİMDİ</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WeatherView;
