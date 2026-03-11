import React, { useState, useEffect, useRef } from 'react';
import { Bitcoin, TrendingUp, ShieldCheck, Zap, Activity, Settings, Play, Square, Database, Terminal, LineChart as ChartIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStorageItem } from '../utils/storage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface BinanceConfig {
  apiKey: string;
  apiSecret: string;
  pair1: string;
  pair2: string;
  winRate: number;
}

interface DataPoint {
  time: string;
  price: number;
  rsi: number;
}

const CryptoView: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [config, setConfig] = useState<BinanceConfig>(getStorageItem('binance_config', {
    apiKey: '',
    apiSecret: '',
    pair1: 'BNB',
    pair2: 'USDT',
    winRate: 1.02
  }));

  const [stats, setStats] = useState({
    rsi: 50,
    macd: 'HOLD',
    price: 600,
    balance: '0.00',
    lastPrice: 600,
    strategy: 'WAITING'
  });

  // Use refs to access latest state inside interval without triggering re-runs
  const statsRef = useRef(stats);
  useEffect(() => { statsRef.current = stats; }, [stats]);

  const logEndRef = useRef<HTMLDivElement>(null);

  const topCrypto = [
    { symbol: 'BTC', name: 'Bitcoin', price: '7,797', change: '+1.45%', color: 'text-orange-400' },
    { symbol: 'ETH', name: 'Ethereum', price: ',955', change: '+2.10%', color: 'text-blue-400' },
    { symbol: 'SOL', name: 'Solana', price: '3.53', change: '+5.42%', color: 'text-purple-400' },
    { symbol: 'BNB', name: 'Binance Coin', price: '12.40', change: '-0.12%', color: 'text-yellow-400' },
    { symbol: 'ARB', name: 'Arbitrum', price: '-bash.98', change: '+0.85%', color: 'text-blue-500' },
  ];

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${time}] ${msg}`].slice(-100));
  };

  const saveConfig = () => {
    localStorage.setItem('binance_config', JSON.stringify(config));
    addLog("Sistem: Binance yapılandırması güncellendi.");
  };

  useEffect(() => {
    if (isRunning) {
      addLog(`___DATE______TIME_____BALANCE___${config.pair1}___RSI__MACD___PRICE______STRATEGY__`);

      const interval = setInterval(() => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const currentStats = statsRef.current;

        const newPrice = currentStats.price + (Math.random() - 0.48) * 4;
        const newRsi = Math.floor(30 + Math.random() * 50);
        const macdOptions = ['BUY', 'SELL', 'HOLD'];
        const newMacd = macdOptions[Math.floor(Math.random() * 3)];

        let strategy = 'HOLD';
        const winRate = config.winRate;
        let lastPrice = currentStats.lastPrice;

        if (newPrice * winRate < lastPrice && (newMacd === 'BUY' || newRsi < 35)) {
           strategy = 'BUY';
           lastPrice = newPrice;
        } else if (newPrice > lastPrice * winRate && (newRsi > 65 || newMacd === 'SELL')) {
           strategy = 'SELL';
           lastPrice = newPrice;
        }

        const currentBalance = (Math.random() * 5 + 10).toFixed(4);

        setStats({
          price: newPrice,
          rsi: newRsi,
          macd: newMacd,
          balance: currentBalance,
          lastPrice: lastPrice,
          strategy: strategy
        });

        setChartData(prev => [...prev, { time, price: Number(newPrice.toFixed(2)), rsi: newRsi }].slice(-20));

        const logMsg = `${currentBalance}  ${config.pair1}  ${newRsi}  ${newMacd}  ${newPrice.toFixed(4)}  ${strategy}`;
        addLog(logMsg);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isRunning, config.pair1, config.winRate]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="p-4 lg:p-12 overflow-y-auto h-full pb-32 bg-brandDark animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-12">

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shadow-2xl shadow-primary/10">
                 <Activity className="w-8 h-8" />
              </div>
              <div>
                 <h1 className="text-4xl lg:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Binance <span className="text-primary">Bot Engine</span></h1>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                    <span className="w-8 h-px bg-primary"></span> Algoritmik Al-Sat Sistemi v3.0
                 </p>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-bold text-slate-400 uppercase">Durum: <span className={isRunning ? 'text-primary animate-pulse' : 'text-red-500'}>{isRunning ? 'ÇALIŞIYOR' : 'DURDURULDU'}</span></div>
              <button
                onClick={() => isRunning ? setIsRunning(false) : setIsRunning(true)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl ${isRunning ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-primary text-white shadow-primary/20'}`}
              >
                {isRunning ? <Square size={24} /> : <Play size={24} className="ml-1" />}
              </button>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <div className="lg:col-span-1 space-y-6">
             <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-surface/30 shadow-2xl space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                   <Settings className="w-4 h-4 text-primary" />
                   <h3 className="text-xs font-black text-white uppercase tracking-widest">Bot Yapılandırması</h3>
                </div>

                <div className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Binance API Key</label>
                      <input
                        type="password"
                        value={config.apiKey}
                        onChange={e => setConfig({...config, apiKey: e.target.value})}
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-primary/50 outline-none transition-all"
                        placeholder="V6y...8Xz"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">API Secret</label>
                      <input
                        type="password"
                        value={config.apiSecret}
                        onChange={e => setConfig({...config, apiSecret: e.target.value})}
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-primary/50 outline-none transition-all"
                        placeholder="Se...cret"
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                         <label className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Varlık</label>
                         <input
                           type="text"
                           value={config.pair1}
                           onChange={e => setConfig({...config, pair1: e.target.value.toUpperCase()})}
                           className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-primary/50 outline-none transition-all"
                           placeholder="BNB"
                         />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Quote</label>
                         <input
                           type="text"
                           value={config.pair2}
                           onChange={e => setConfig({...config, pair2: e.target.value.toUpperCase()})}
                           className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-primary/50 outline-none transition-all"
                           placeholder="USDT"
                         />
                      </div>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Kâr Hedefi (WinRate)</label>
                      <input
                        type="number"
                        step="0.001"
                        value={config.winRate}
                        onChange={e => setConfig({...config, winRate: parseFloat(e.target.value)})}
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-primary/50 outline-none transition-all"
                      />
                   </div>

                   <button
                     onClick={saveConfig}
                     className="w-full py-4 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 rounded-2xl transition-all"
                   >
                      AYARLARI KAYDET
                   </button>
                </div>
             </div>

             <div className="bg-primary/5 border border-primary/20 p-6 rounded-[2.5rem] space-y-6">
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Gösterge Paneli</p>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-slate-300 uppercase">RSI (14)</span>
                         <span className={`text-sm font-black ${stats.rsi > 70 ? 'text-red-400' : stats.rsi < 35 ? 'text-green-400' : 'text-primary'}`}>{stats.rsi}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-slate-300 uppercase">MACD Durumu</span>
                         <span className={`text-sm font-black ${stats.macd === 'BUY' ? 'text-green-400' : stats.macd === 'SELL' ? 'text-red-400' : 'text-slate-500'}`}>{stats.macd}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-slate-300 uppercase">Son İşlem</span>
                         <span className="text-sm font-black text-white">{stats.lastPrice.toFixed(2)}</span>
                      </div>
                   </div>
                </div>
                <div className="pt-4 border-t border-white/5">
                   <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Sinyal Gücü</p>
                   <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                      <div className="w-2/3 h-full bg-primary"></div>
                   </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
             <div className="glass-panel p-8 rounded-[3rem] border border-white/10 bg-brandDark/50 shadow-2xl h-[350px]">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                      <ChartIcon className="w-4 h-4 text-primary" />
                      <h3 className="text-xs font-black text-white uppercase tracking-widest">Canlı Piyasa Analizi</h3>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-primary"></div>
                         <span className="text-[9px] font-bold text-slate-400 uppercase">Fiyat</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                         <span className="text-[9px] font-bold text-slate-400 uppercase">RSI</span>
                      </div>
                   </div>
                </div>
                <div className="w-full h-[220px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0D59F2" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0D59F2" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="time" hide />
                        <YAxis domain={['auto', 'auto']} hide />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                          itemStyle={{ fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="price" stroke="#0D59F2" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
                        <Line type="monotone" dataKey="rsi" stroke="#10b981" strokeWidth={1} dot={false} />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>

             <div className="glass-panel p-8 rounded-[3rem] border border-white/10 bg-black/40 shadow-2xl flex flex-col h-[400px]">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                      <Terminal className="w-4 h-4 text-primary" />
                      <h3 className="text-xs font-black text-white uppercase tracking-widest italic">Binance Bot Terminali</h3>
                   </div>
                   <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                      <span className="text-[8px] font-black text-primary uppercase">Syncing...</span>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-1 scrollbar-hide bg-black/60 rounded-3xl p-6 border border-white/5 shadow-inner">
                   {logs.length === 0 && (
                     <div className="h-full flex flex-col items-center justify-center text-slate-700 space-y-4 opacity-50">
                        <Database className="w-12 h-12" />
                        <p className="uppercase font-black tracking-[0.4em] text-xs italic">Sistem başlatılmayı bekliyor...</p>
                     </div>
                   )}
                   {logs.map((log, i) => (
                     <div key={i} className="flex gap-4 group hover:bg-white/5 transition-colors p-1 rounded">
                        <span className="text-slate-600 shrink-0 select-none opacity-40">{(i+1).toString().padStart(3, '0')}</span>
                        <span className={`
                          ${log.includes('BUY') ? 'text-green-400 font-black' : ''}
                          ${log.includes('SELL') ? 'text-red-400 font-black' : ''}
                          ${log.includes('DATE') ? 'text-primary font-black border-b border-primary/10 pb-1 mb-2 block w-full' : 'text-slate-400'}
                        `}>{log}</span>
                     </div>
                   ))}
                   <div ref={logEndRef} />
                </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CryptoView;
