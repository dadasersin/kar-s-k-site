import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, BarChart2, Info, TrendingDown } from 'lucide-react';

const BorsaView: React.FC = () => {
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

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto overflow-y-auto h-full pb-32">
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
              <div key={idx} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between">
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
              <div key={idx} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between">
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
    </div>
  );
};

export default BorsaView;
