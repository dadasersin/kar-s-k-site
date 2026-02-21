import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Bitcoin, TrendingUp, ShieldCheck, Zap, Activity, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  color: string;
}

const CryptoView: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const [cryptos, setCryptos] = useState<CryptoData[]>([
    { symbol: 'BTC', name: 'Bitcoin', price: 67797, change: 1.45, color: 'text-orange-400' },
    { symbol: 'ETH', name: 'Ethereum', price: 1955, change: 2.10, color: 'text-blue-400' },
    { symbol: 'SOL', name: 'Solana', price: 83.53, change: 5.42, color: 'text-purple-400' },
    { symbol: 'BNB', name: 'Binance Coin', price: 612.40, change: -0.12, color: 'text-yellow-400' },
    { symbol: 'ARB', name: 'Arbitrum', price: 0.98, change: 0.85, color: 'text-blue-500' },
    { symbol: 'XRP', name: 'Ripple', price: 0.62, change: -1.2, color: 'text-blue-300' },
    { symbol: 'DOGE', name: 'Dogecoin', price: 0.16, change: 4.5, color: 'text-yellow-500' },
    { symbol: 'DOT', name: 'Polkadot', price: 7.21, change: -0.5, color: 'text-pink-500' },
    { symbol: 'LINK', name: 'Chainlink', price: 18.42, change: 1.2, color: 'text-blue-600' },
    { symbol: 'ADA', name: 'Cardano', price: 0.45, change: -2.3, color: 'text-blue-800' },
  ]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${time}] ${msg}`].slice(-50));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCryptos(prev => prev.map(c => {
        const move = (Math.random() - 0.5) * (c.price * 0.002);
        const newPrice = c.price + move;
        const newChange = c.change + (Math.random() - 0.5) * 0.1;
        return { ...c, price: newPrice, change: newChange };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        const indicators = ["SMA", "EMA", "RSI", "MACD", "VWAP"];
        const ind = indicators[Math.floor(Math.random() * indicators.length)];
        const action = Math.random() > 0.5 ? "AL sinyali üretildi" : "SAT sinyali üretildi";
        addLog(`${ind} Filtresi: ${action} (+ ${(Math.random() * 2).toFixed(2)}%)`);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedCrypto(null); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);
  const filteredCryptos = useMemo(() => {
    return cryptos.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cryptos, searchTerm]);

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
              <Activity className="text-primary w-8 h-8" />
              Kripto Bot & Algoritmik Analiz
            </h1>
            <p className="text-slate-500 text-sm mt-1 uppercase font-bold tracking-widest">Gerçek Zamanlı Piyasa ve Sinyal Takibi</p>
          </div>

          <div className="relative group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
             <input
               type="text"
               placeholder="KRİPTO ARA (BTC, ETH...)"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-primary transition-all w-full md:w-64"
             />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Top Picks / Search Results */}
            <div className="glass-panel rounded-[40px] p-8 backdrop-blur-xl border border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black italic text-white uppercase tracking-tighter flex items-center gap-3">
                  <TrendingUp className="text-green-400 w-5 h-5" />
                  {searchTerm ? 'Arama Sonuçları' : 'Alınıp Satılacak Varlıklar'}
                </h3>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Güven Skoru: %92</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {filteredCryptos.map((crypto, idx) => (
                  <motion.div
                    key={crypto.symbol}
                    layoutId={crypto.symbol}
                    onClick={() => setSelectedCrypto(crypto)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-black/40 border border-white/5 p-4 rounded-3xl flex flex-col items-center hover:border-primary/40 transition-all group cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      {crypto.symbol === 'BTC' ? <Bitcoin className="w-7 h-7 text-orange-400" /> : <div className={`text-lg font-black ${crypto.color}`}>{crypto.symbol[0]}</div>}
                    </div>
                    <p className="text-[10px] font-black text-white mb-1 uppercase tracking-tighter">{crypto.symbol}</p>
                    <p className="text-[14px] font-bold text-primary mb-1 italic tracking-tighter">${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className={`text-[9px] font-bold ${crypto.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Log Section */}
            <div className="glass-panel rounded-[40px] p-8 border border-white/5 shadow-2xl">
               <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-black italic text-white uppercase tracking-tighter flex items-center gap-3">
                  <Activity className="text-primary w-5 h-5" />
                  Sinyal Akışı & Motor Logları
                </h3>
                <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isRunning ? 'bg-primary/20 text-primary animate-pulse' : 'bg-gray-800 text-gray-500'}`}>
                  {isRunning ? 'Aktif' : 'Beklemede'}
                </span>
              </div>
              <div className="bg-black/60 rounded-3xl border border-white/5 p-6 h-80 overflow-y-auto scrollbar-hide font-mono text-[11px]">
                {logs.length === 0 && <p className="text-gray-700 text-center py-24 uppercase font-black tracking-[0.3em] italic">Analiz motorunu başlatın...</p>}
                {logs.map((log, i) => (
                  <div key={i} className="mb-2 text-primary/80 border-b border-white/5 pb-2 flex justify-between items-center group">
                    <span><span className="opacity-40 font-bold mr-2">{log.split(' ')[0]}</span> {log.split(' ').slice(1).join(' ')}</span>
                    <Zap className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary/10 to-brandDark border border-primary/20 rounded-[40px] p-8 shadow-2xl sticky top-8">
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Motor Kontrolü</h4>
              <div className="space-y-4">
                <button
                  onClick={() => { setIsRunning(true); addLog("Sistem senkronize edildi. Motor başlatılıyor..."); }}
                  disabled={isRunning}
                  className="w-full py-4 bg-primary hover:brightness-110 disabled:bg-gray-800 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary/20 text-xs flex items-center justify-center gap-2"
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
                  <span className="text-3xl font-black text-white italic tracking-tighter">84.2%</span>
                  <span className="text-[10px] text-green-400 mb-1 font-bold tracking-tighter">+2.4%</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                 <div className="flex justify-between items-center p-3 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Aktif İşlem</span>
                    <span className="text-sm font-black text-white italic">12</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">24s Hacim</span>
                    <span className="text-sm font-black text-white italic">.2M</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Crypto Details Modal */}
      <AnimatePresence>
        {selectedCrypto && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
             <motion.div
               layoutId={selectedCrypto.symbol}
               className="w-full max-w-lg bg-surface border border-white/10 rounded-[40px] p-8 shadow-2xl relative overflow-hidden"
             >
                <button
                  onClick={() => setSelectedCrypto(null)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-6 mb-8">
                   <div className={`w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center ${selectedCrypto.color}`}>
                      {selectedCrypto.symbol === 'BTC' ? <Bitcoin className="w-10 h-10" /> : <span className="text-3xl font-black">{selectedCrypto.symbol[0]}</span>}
                   </div>
                   <div>
                      <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{selectedCrypto.name}</h2>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{selectedCrypto.symbol} / USDT</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Fiyat</p>
                      <p className="text-2xl font-black text-primary italic tracking-tighter">${selectedCrypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                   </div>
                   <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">24s Değişim</p>
                      <p className={`text-2xl font-black italic tracking-tighter ${selectedCrypto.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                         {selectedCrypto.change >= 0 ? '+' : ''}{selectedCrypto.change.toFixed(2)}%
                      </p>
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-xs font-black text-white uppercase tracking-widest italic flex items-center gap-2 border-b border-white/5 pb-2">
                     <Activity className="w-4 h-4 text-primary" />
                     Algoritmik Göstergeler
                   </h3>
                   <div className="grid grid-cols-3 gap-3">
                      {["RSI (14)", "MACD", "MA (50)"].map(ind => (
                        <div key={ind} className="p-3 bg-white/5 rounded-2xl text-center border border-white/5">
                           <p className="text-[8px] text-slate-500 font-black uppercase mb-1">{ind}</p>
                           <p className="text-xs font-black text-white">{(Math.random() * 100).toFixed(1)}</p>
                        </div>
                      ))}
                   </div>
                   <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center justify-between">
                      <span className="text-[10px] font-black text-primary uppercase">Öneri</span>
                      <span className="text-xs font-black text-white uppercase italic bg-primary px-3 py-1 rounded-full">GÜÇLÜ AL</span>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CryptoView;
