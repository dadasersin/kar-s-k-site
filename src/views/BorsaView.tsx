import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, BarChart2, Briefcase, Info, X, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface StockPricePoint {
  date: string;
  price: number;
}

interface Stock {
  ticker: string;
  name: string;
  price: string;
  change: string;
  trend: 'up' | 'down';
  history1M: StockPricePoint[];
  history1Y: StockPricePoint[];
}

const mockHistory1M = (basePrice: number, trend: 'up' | 'down') => {
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const variation = Math.random() * 0.05 * (trend === 'up' ? 1 : -1);
    const price = basePrice * (1 + (i / 30) * variation + (Math.random() - 0.5) * 0.02);
    return {
      date: `${date.getDate()}.${date.getMonth() + 1}`,
      price: parseFloat(price.toFixed(2))
    };
  });
};

const mockHistory1Y = (basePrice: number, trend: 'up' | 'down') => {
  const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  return months.map((month, i) => {
    const variation = Math.random() * 0.2 * (trend === 'up' ? 1 : -1);
    const price = basePrice * (0.8 + (i / 12) * variation + Math.random() * 0.1);
    return {
      date: month,
      price: parseFloat(price.toFixed(2))
    };
  });
};

const topStocks: Stock[] = [
  {
    ticker: 'THYAO', name: 'Türk Hava Yolları', price: '₺324.50', change: '+2.4%', trend: 'up',
    history1M: mockHistory1M(324.50, 'up'),
    history1Y: mockHistory1Y(324.50, 'up')
  },
  {
    ticker: 'ASELS', name: 'Aselsan', price: '₺88.20', change: '+1.8%', trend: 'up',
    history1M: mockHistory1M(88.20, 'up'),
    history1Y: mockHistory1Y(88.20, 'up')
  },
  {
    ticker: 'TUPRS', name: 'Tüpraş', price: '₺182.10', change: '+3.1%', trend: 'up',
    history1M: mockHistory1M(182.10, 'up'),
    history1Y: mockHistory1Y(182.10, 'up')
  },
  {
    ticker: 'SISE', name: 'Şişecam', price: '₺48.15', change: '+0.9%', trend: 'up',
    history1M: mockHistory1M(48.15, 'up'),
    history1Y: mockHistory1Y(48.15, 'up')
  },
  {
    ticker: 'KCHOL', name: 'Koç Holding', price: '₺215.40', change: '+1.2%', trend: 'up',
    history1M: mockHistory1M(215.40, 'up'),
    history1Y: mockHistory1Y(215.40, 'up')
  },
];

const losingStocks: Stock[] = [
  {
    ticker: 'ISCTR', name: 'İş Bankası C', price: '₺16.45', change: '-1.2%', trend: 'down',
    history1M: mockHistory1M(16.45, 'down'),
    history1Y: mockHistory1Y(16.45, 'down')
  },
  {
    ticker: 'YKBNK', name: 'Yapı Kredi Bankası', price: '₺31.12', change: '-2.5%', trend: 'down',
    history1M: mockHistory1M(31.12, 'down'),
    history1Y: mockHistory1Y(31.12, 'down')
  },
  {
    ticker: 'AKBNK', name: 'Akbank', price: '₺42.80', change: '-0.8%', trend: 'down',
    history1M: mockHistory1M(42.80, 'down'),
    history1Y: mockHistory1Y(42.80, 'down')
  },
  {
    ticker: 'EREGL', name: 'Ereğli Demir Çelik', price: '₺45.60', change: '-3.2%', trend: 'down',
    history1M: mockHistory1M(45.60, 'down'),
    history1Y: mockHistory1Y(45.60, 'down')
  },
  {
    ticker: 'GUBRF', name: 'Gübre Fabrikaları', price: '₺152.40', change: '-5.7%', trend: 'down',
    history1M: mockHistory1M(152.40, 'down'),
    history1Y: mockHistory1Y(152.40, 'down')
  },
];

const StockDetailModal: React.FC<{ stock: Stock; onClose: () => void }> = ({ stock, onClose }) => {
  const [timeframe, setTimeframe] = useState<'1M' | '1Y'>('1M');
  const data = timeframe === '1M' ? stock.history1M : stock.history1Y;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-brandDark border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-2xl font-bold">{stock.ticker}</h3>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${stock.trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {stock.change}
              </span>
            </div>
            <p className="text-gray-400">{stock.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <p className="text-xs text-gray-500 font-bold uppercase mb-1">Güncel Fiyat</p>
              <p className="text-2xl font-bold">{stock.price}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <p className="text-xs text-gray-500 font-bold uppercase mb-1">Günlük Değişim</p>
              <div className="flex items-center gap-2">
                <p className={`text-2xl font-bold ${stock.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {stock.change}
                </p>
                {stock.trend === 'up' ? <ArrowUpRight className="text-green-400" /> : <ArrowDownRight className="text-red-400" />}
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <p className="text-xs text-gray-500 font-bold uppercase mb-1">Hacim</p>
              <p className="text-2xl font-bold">₺1.2B</p>
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Fiyat Grafiği
              </h4>
              <div className="flex bg-black/40 p-1 rounded-lg">
                <button
                  onClick={() => setTimeframe('1M')}
                  className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${timeframe === '1M' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  1 AY
                </button>
                <button
                  onClick={() => setTimeframe('1Y')}
                  className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${timeframe === '1Y' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  1 YIL
                </button>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d59f2" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0d59f2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 12 }}
                  />
                  <YAxis
                    hide
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#666', marginBottom: '4px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#0d59f2"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const BorsaView: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  const marketStats = [
    { label: 'DOLAR', value: '₺43.84', change: '+0.12%', icon: <DollarSign className="w-5 h-5 text-green-400" /> },
    { label: 'EURO', value: '₺51.56', change: '-0.05%', icon: <DollarSign className="w-5 h-5 text-blue-400" /> },
    { label: 'GRAM ALTIN', value: '₺7,087', change: '+0.45%', icon: <TrendingUp className="w-5 h-5 text-yellow-400" /> },
    { label: 'BIST 100', value: '13,804', change: '+1.20%', icon: <BarChart2 className="w-5 h-5 text-primary" /> },
  ];

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto">
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
            className="bg-surface border border-white/5 p-6 rounded-custom"
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
        {/* Recommended Stocks List */}
        <div className="bg-surface border border-white/5 rounded-custom overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Alınacak İlk 5 Hisse (Yükselenler)
            </h3>
            <span className="text-xs text-green-400 font-bold px-2 py-1 bg-green-400/10 rounded">YZ ÖNERİSİ</span>
          </div>
          <div className="divide-y divide-white/5">
            {topStocks.map((stock, idx) => (
              <motion.div
                key={idx}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                onClick={() => setSelectedStock(stock)}
                className="p-4 cursor-pointer transition-colors flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-lg">{stock.ticker}</h4>
                  <p className="text-xs text-gray-400">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{stock.price}</p>
                  <p className="text-xs text-green-400 font-bold">
                    {stock.change} ▲
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Losers List */}
        <div className="bg-surface border border-white/5 rounded-custom overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-red-400 rotate-180" />
              Piyasanın En Çok Kaybedenleri
            </h3>
            <span className="text-xs text-red-400 font-bold px-2 py-1 bg-red-400/10 rounded">CANLI</span>
          </div>
          <div className="divide-y divide-white/5">
            {losingStocks.map((stock, idx) => (
              <motion.div
                key={idx}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                onClick={() => setSelectedStock(stock)}
                className="p-4 cursor-pointer transition-colors flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-lg">{stock.ticker}</h4>
                  <p className="text-xs text-gray-400">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{stock.price}</p>
                  <p className="text-xs text-red-400 font-bold">
                    {stock.change} ▼
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <div className="bg-primary/10 border border-primary/20 p-8 rounded-custom flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4">Detaylı Analiz Raporu İster Misiniz?</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Seçtiğiniz hisseler için yapay zeka destekli derinlemesine teknik ve temel analiz raporları oluşturabiliriz.
                  Bu raporlar sosyal medya duyarlılığı, bilanço verileri ve global piyasa trendlerini içerir.
                </p>
                <button className="px-8 py-3 bg-primary text-white font-bold rounded-custom shadow-[0_0_20px_rgba(13,89,242,0.3)] hover:brightness-110 transition-all flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  ANALİZ OLUŞTUR
                </button>
              </div>
              <div className="w-full md:w-64 h-48 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center">
                <BarChart2 className="w-24 h-24 text-primary/30" />
              </div>
           </div>
        </div>

        {/* Info Card */}
        <div className="space-y-6">
          <div className="bg-surface border border-white/5 p-6 rounded-custom">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Bilgilendirme
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Veriler 15 dakika gecikmelidir. Gösterilen grafikler ve analizler yapay zeka tarafından simüle edilmiştir. Gerçek yatırım kararlarınızdan önce uzman bir danışmana başvurun.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedStock && (
          <StockDetailModal
            stock={selectedStock}
            onClose={() => setSelectedStock(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BorsaView;
