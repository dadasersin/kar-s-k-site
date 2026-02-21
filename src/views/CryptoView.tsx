import React, { useState, useEffect, useRef } from 'react';
import { Bitcoin, TrendingUp, ShieldCheck, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const CryptoView: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const topCrypto = [
    { symbol: 'BTC', name: 'Bitcoin', price: '$67,797', change: '+1.45%', color: 'text-orange-400' },
    { symbol: 'ETH', name: 'Ethereum', price: '$1,955', change: '+2.10%', color: 'text-blue-400' },
    { symbol: 'SOL', name: 'Solana', price: '$83.53', change: '+5.42%', color: 'text-purple-400' },
    { symbol: 'BNB', name: 'Binance Coin', price: '$612.40', change: '-0.12%', color: 'text-yellow-400' },
    { symbol: 'ARB', name: 'Arbitrum', price: '$0.98', change: '+0.85%', color: 'text-blue-500' },
  ];

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${time}] ${msg}`]);
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        const indicators = ["SMA", "EMA", "RSI", "MACD", "VWAP"];
        const ind = indicators[Math.floor(Math.random() * indicators.length)];
        const action = Math.random() > 0.5 ? "AL sinyali üretildi" : "SAT sinyali üretildi";
        addLog(`${ind} Filtresi: ${action} (+${(Math.random() * 2).toFixed(2)}%)`);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Bot Control */}
          <div className="glass-panel rounded-[32px] p-8 backdrop-blur-xl border border-white/5 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black italic text-white uppercase tracking-tighter flex items-center gap-3">
                <Activity className="text-primary w-6 h-6" />
                Algoritmik Veri Motoru
              </h3>
              <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isRunning ? 'bg-primary/20 text-primary animate-pulse' : 'bg-gray-800 text-gray-500'}`}>
                {isRunning ? 'Aktif' : 'Beklemede'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {["SMA", "EMA", "RSI", "MACD", "VWAP", "TEMA"].map(ind => (
                <div key={ind} className="flex items-center gap-3 p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-primary/30 transition-colors">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary bg-transparent border-white/10" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{ind}</span>
                </div>
              ))}
            </div>

            <div className="bg-black/60 rounded-2xl border border-white/5 p-6 h-64 overflow-y-auto scrollbar-hide font-mono text-[10px]">
              {logs.length === 0 && <p className="text-gray-700 text-center py-20 uppercase font-black tracking-[0.3em]">Motoru başlatmak için strateji seçin...</p>}
              {logs.map((log, i) => (
                <div key={i} className="mb-1 text-primary/80 border-b border-white/5 pb-1 flex justify-between">
                  <span><span className="opacity-40">{log.split(' ')[0]}</span> {log.split(' ').slice(1).join(' ')}</span>
                  <Zap className="w-3 h-3 text-primary animate-pulse" />
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>

          {/* Top 5 Recommended Crypto - NEW SECTION */}
          <div className="glass-panel rounded-[32px] p-8 backdrop-blur-xl border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black italic text-white uppercase tracking-tighter flex items-center gap-3">
                <TrendingUp className="text-green-400 w-5 h-5" />
                Alınıp Satılacak Varlıklar (Top 5)
              </h3>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Güven Skoru: %92</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {topCrypto.map((crypto, idx) => (
                <motion.div
                  key={crypto.symbol}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-black/40 border border-white/5 p-4 rounded-2xl flex flex-col items-center hover:border-primary/40 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    {crypto.symbol === 'BTC' ? <Bitcoin className="w-6 h-6 text-orange-400" /> : <div className={`font-black ${crypto.color}`}>{crypto.symbol[0]}</div>}
                  </div>
                  <p className="text-[10px] font-black text-white mb-1">{crypto.symbol}</p>
                  <p className="text-[14px] font-bold text-primary mb-1">{crypto.price}</p>
                  <p className={`text-[9px] font-bold ${crypto.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {crypto.change}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary/10 to-brandDark border border-white/10 rounded-[32px] p-8 shadow-2xl sticky top-0">
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Strateji Kontrolü</h4>
            <div className="space-y-4">
              <button
                onClick={() => { setIsRunning(true); addLog("Sistem senkronize edildi. Motor başlatılıyor..."); }}
                disabled={isRunning}
                className="w-full py-4 bg-primary hover:brightness-110 disabled:bg-gray-800 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-primary/20 text-xs flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Stratejiyi Başlat
              </button>
              <button
                onClick={() => { setIsRunning(false); addLog("Motor durduruldu."); }}
                disabled={!isRunning}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest rounded-2xl transition-all border border-white/10 text-xs"
              >
                Durdur
              </button>
            </div>

            <div className="mt-10 p-6 bg-primary/5 rounded-[2rem] border border-primary/20">
              <p className="text-[9px] text-gray-500 uppercase font-black mb-2 tracking-widest">Başarı Oranı</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-white italic">84.2%</span>
                <span className="text-[10px] text-green-400 mb-1 font-bold">+2.4%</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-gray-500">Aktif İşlem</span>
                <span className="text-white">12</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-gray-500">24s Hacim</span>
                <span className="text-white">$1.2M</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoView;
