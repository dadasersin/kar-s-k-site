import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, BarChart2, Info, TrendingDown, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Stock {
  ticker: string;
  name: string;
  price: string;
  change: string;
}

interface HistoricalData {
  name: string;
  price: number;
}

const generateMockData = (basePrice: number, count: number): HistoricalData[] => {
  return Array.from({ length: count }, (_, i) => ({
    name: `Gün ${i + 1}`,
    price: basePrice + Math.random() * (basePrice * 0.1) - (basePrice * 0.05)
  }));
};

const BorsaView: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [timeframe, setTimeframe] = useState<'D' | 'H' | 'A' | 'Y'>('A');

  const marketStats = [
    { label: 'DOLAR', value: '₺43.84', change: '+0.12%', icon: <DollarSign className="w-5 h-5 text-green-400" /> },
    { label: 'EURO', value: '₺51.56', change: '-0.05%', icon: <DollarSign className="w-5 h-5 text-blue-400" /> },
    { label: 'GRAM ALTIN', value: '₺7,087', change: '+0.45%', icon: <TrendingUp className="w-5 h-5 text-yellow-400" /> },
    { label: 'BIST 100', value: '13,804', change: '+1.20%', icon: <BarChart2 className="w-5 h-5 text-primary" /> },
  ];

  const winners = [
    { ticker: 'THYAO', name: 'Türk Hava Yolları', price: '₺324.50', change: '+5.42%' },
    { ticker: 'ASELS', name: 'Aselsan', price: '₺88.20', change: '+4.10%' },
    { ticker: 'TUPRS', name: 'Tüpraş', price: '₺182.10', change: '+3.85%' },
    { ticker: 'YKBNK', name: 'Yapı Kredi Bankası', price: '₺31.12', change: '+3.12%' },
    { ticker: 'EREGL', name: 'Erdemir', price: '₺48.50', change: '+2.90%' },
  ];

  const losers = [
    { ticker: 'ISCTR', name: 'İş Bankası C', price: '₺16.45', change: '-2.15%' },
    { ticker: 'KCHOL', name: 'Koç Holding', price: '₺210.30', change: '-1.80%' },
    { ticker: 'SAHOL', name: 'Sabancı Holding', price: '₺92.15', change: '-1.45%' },
    { ticker: 'AKBNK', name: 'Akbank', price: '₺54.20', change: '-1.20%' },
    { ticker: 'BIMAS', name: 'BİM Mağazalar', price: '₺480.00', change: '-0.95%' },
  ];

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock);
  };

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto overflow-y-auto h-full pb-32 relative">
      <header className="mb-12">
        <h2 className="text-3xl font-bold mb-2">İstanbul Borsa Paneli</h2>
        <p className="text-gray-400">Canlı piyasa verileri ve yapay zeka destekli yatırım önerileri.</p>
      </header>

      {/* Market Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {marketStats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-surface border border-white/5 p-6 rounded-custom cursor-pointer hover:border-primary/30 transition-all"
            onClick={() => handleStockClick({ ticker: stat.label, price: stat.value, change: stat.change, name: stat.label })}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white/5 rounded-lg">{stat.icon}</div>
              <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Winners List */}
        <div className="bg-surface border border-white/5 rounded-custom overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-green-500/5">
            <h3 className="font-bold flex items-center gap-2 text-green-400">
              <TrendingUp className="w-5 h-5" />
              Günün Yükselenleri
            </h3>
          </div>
          <div className="divide-y divide-white/5">
            {winners.map((stock, idx) => (
              <div
                key={idx}
                className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer"
                onClick={() => handleStockClick(stock)}
              >
                <div>
                  <h4 className="font-bold text-lg">{stock.ticker}</h4>
                  <p className="text-xs text-gray-400">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{stock.price}</p>
                  <p className="text-xs text-green-400 font-bold">{stock.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Losers List */}
        <div className="bg-surface border border-white/5 rounded-custom overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-red-500/5">
            <h3 className="font-bold flex items-center gap-2 text-red-400">
              <TrendingDown className="w-5 h-5" />
              Günün Düşenleri
            </h3>
          </div>
          <div className="divide-y divide-white/5">
            {losers.map((stock, idx) => (
              <div
                key={idx}
                className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer"
                onClick={() => handleStockClick(stock)}
              >
                <div>
                  <h4 className="font-bold text-lg">{stock.ticker}</h4>
                  <p className="text-xs text-gray-400">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{stock.price}</p>
                  <p className="text-xs text-red-400 font-bold">{stock.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/20 p-8 rounded-custom flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h4 className="font-bold text-xl mb-4 flex items-center gap-2">
            <Info className="w-6 h-6 text-primary" />
            Yapay Zeka Yatırım Asistanı
          </h4>
          <p className="text-gray-300 leading-relaxed">
            Nöral ağlarımız Borsa İstanbul verilerini, küresel piyasa trendlerini ve sosyal medya duyarlılığını saniyelik olarak analiz eder. Portföyünüzü optimize etmek için detaylı analiz raporu alabilirsiniz.
          </p>
        </div>
        <button className="px-8 py-4 bg-primary text-white font-bold rounded-custom shadow-[0_0_20px_rgba(13,89,242,0.3)] hover:brightness-110 transition-all whitespace-nowrap">
          ANALİZ RAPORU OLUŞTUR
        </button>
      </div>

      <AnimatePresence>
        {selectedStock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-brandDark border border-white/10 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedStock(null)}
                className="absolute top-6 right-6 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-8 border-b border-white/5 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center gap-4 mb-2">
                   <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center font-black text-xl text-white">
                      {selectedStock.ticker[0]}
                   </div>
                   <div>
                      <h3 className="text-2xl font-bold text-white">{selectedStock.ticker}</h3>
                      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{selectedStock.name}</p>
                   </div>
                   <div className="ml-auto text-right pr-12">
                      <p className="text-3xl font-black text-white italic">{selectedStock.price}</p>
                      <p className={`font-bold ${selectedStock.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{selectedStock.change}</p>
                   </div>
                </div>
              </div>

              <div className="flex-1 p-8 flex flex-col">
                <div className="flex gap-2 mb-8">
                  {(['D', 'H', 'A', 'Y'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeframe(t)}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === t ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                    >
                      {t === 'D' ? 'GÜNLÜK' : t === 'H' ? 'HAFTALIK' : t === 'A' ? 'AYLIK' : 'YILLIK'}
                    </button>
                  ))}
                </div>

                <div className="flex-1 min-h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={generateMockData(parseFloat(selectedStock.price.replace('₺', '').replace(',', '')), timeframe === 'D' ? 24 : timeframe === 'H' ? 7 : timeframe === 'A' ? 30 : 365)}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d59f2" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0d59f2" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                      <XAxis dataKey="name" hide />
                      <YAxis hide domain={['auto', 'auto']} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '12px' }}
                        itemStyle={{ color: '#0d59f2' }}
                      />
                      <Area type="monotone" dataKey="price" stroke="#0d59f2" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-8 bg-black/40 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Hacim</p>
                  <p className="text-sm font-bold text-white">₺4.2B</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Piyasa Değeri</p>
                  <p className="text-sm font-bold text-white">₺120.5B</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">F/K Oranı</p>
                  <p className="text-sm font-bold text-white">12.4</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">YZ Beklentisi</p>
                  <p className="text-sm font-bold text-green-500">GÜÇLÜ AL</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BorsaView;
