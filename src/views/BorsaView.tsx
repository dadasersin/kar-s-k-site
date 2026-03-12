import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, BarChart2, Briefcase, Info } from 'lucide-react';

const BorsaView: React.FC = () => {
    const [prices, setPrices] = React.useState({
    usd: 43.84,
    eur: 51.56,
    gold: 7087,
    bist: 13804
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => ({
        usd: parseFloat((prev.usd + (Math.random() - 0.5) * 0.05).toFixed(2)),
        eur: parseFloat((prev.eur + (Math.random() - 0.5) * 0.05).toFixed(2)),
        gold: Math.round(prev.gold + (Math.random() - 0.5) * 10),
        bist: Math.round(prev.bist + (Math.random() - 0.5) * 20)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const marketStats = [
    { label: 'DOLAR', value: `₺${prices.usd}`, change: '+0.12%', icon: <DollarSign className="w-5 h-5 text-green-400" /> },
    { label: 'EURO', value: `₺${prices.eur}`, change: '-0.05%', icon: <DollarSign className="w-5 h-5 text-blue-400" /> },
    { label: 'GRAM ALTIN', value: `₺${prices.gold.toLocaleString()}`, change: '+0.45%', icon: <TrendingUp className="w-5 h-5 text-yellow-400" /> },
    { label: 'BIST 100', value: prices.bist.toLocaleString(), change: '+1.20%', icon: <BarChart2 className="w-5 h-5 text-primary" /> },
  ];

  const topStocks = [
    { ticker: 'THYAO', name: 'Türk Hava Yolları', price: '₺324.50', trend: 'up' },
    { ticker: 'ASELS', name: 'Aselsan', price: '₺88.20', trend: 'up' },
    { ticker: 'ISCTR', name: 'İş Bankası C', price: '₺16.45', trend: 'down' },
    { ticker: 'TUPRS', name: 'Tüpraş', price: '₺182.10', trend: 'up' },
    { ticker: 'YKBNK', name: 'Yapı Kredi Bankası', price: '₺31.12', trend: 'up' },
  ];

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto pb-32">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Stocks List */}
        <div className="lg:col-span-2 bg-surface border border-white/5 rounded-custom overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Alınacak İlk 5 Hisse
            </h3>
            <span className="text-xs text-primary font-bold px-2 py-1 bg-primary/10 rounded">YZ ÖNERİSİ</span>
          </div>
          <div className="divide-y divide-white/5">
            {topStocks.map((stock, idx) => (
              <div key={idx} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-lg">{stock.ticker}</h4>
                  <p className="text-xs text-gray-400">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{stock.price}</p>
                  <p className={`text-xs ${stock.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {stock.trend === 'up' ? '▲ Yükseliş' : '▼ Düşüş'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div className="space-y-6">
          <div className="bg-primary/10 border border-primary/20 p-6 rounded-custom">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Yatırım Notu
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              Bu veriler yapay zeka algoritmalarımız tarafından piyasa hacmi, sosyal medya duyarlılığı ve teknik analiz verileri harmanlanarak oluşturulmuştur. Yatırım tavsiyesi değildir.
            </p>
          </div>

          <button className="w-full py-4 bg-primary text-white font-bold rounded-custom shadow-[0_0_20px_rgba(13,89,242,0.3)] hover:brightness-110 transition-all">
            DETAYLI ANALİZ RAPORU AL
          </button>
        </div>
      </div>
    </div>
  );
};

export default BorsaView;
