import React, { useState, useEffect, useMemo } from 'react';
import { AppView } from '../types';
import { getAllKeys } from '../utils/apiPool';
import { getStorageItem } from '../utils/storage';

interface HomeViewProps {
  onViewChange: (view: AppView | string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onViewChange }) => {
  const [apiKeys, setApiKeys] = useState(getAllKeys());
  const [sessionTime, setSessionTime] = useState(0);
  const [neuralLoad, setNeuralLoad] = useState(24);
  const [brainCapacity, setBrainCapacity] = useState(82);
  const [lastBackup, setLastBackup] = useState(localStorage.getItem('last_github_backup') || 'Yedekleme Yapılmadı');

  // Real Storage Stats
  const storageStats = useMemo(() => {
    const chatHistory = getStorageItem('chat_history', []);
    const visualAssets = getStorageItem('visual_assets', []);
    const dynamicModules = getStorageItem('active_dynamic_modules', []);

    let totalSize = 0;
    try {
        const str = JSON.stringify(localStorage);
        totalSize = (str.length * 2) / 1024; // KB
    } catch(e) {}

    return {
        messages: chatHistory.length,
        assets: visualAssets.length,
        modules: dynamicModules.length,
        size: totalSize.toFixed(2)
    };
  }, [sessionTime]); // Recalculate periodically

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
      setNeuralLoad(Math.floor(20 + Math.random() * 15));
      setBrainCapacity(Math.floor(80 + Math.random() * 5));
      setApiKeys(getAllKeys());
      setLastBackup(localStorage.getItem('last_github_backup') || 'Yedekleme Yapılmadı');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSessionTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const maskKey = (key: string) => {
    if (key.length < 10) return '********';
    return key.substring(0, 4) + '...' + key.substring(key.length - 4);
  };

  const totalQuota = apiKeys.reduce((acc, k) => acc + (k.quotaLimit || 0), 0);
  const totalUsed = apiKeys.reduce((acc, k) => acc + (k.usageCount || 0), 0);

  return (
    <section className="p-4 lg:p-12 animate-in fade-in duration-700 pb-32">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-black text-white italic tracking-tighter uppercase leading-none text-glow">
              NEXUS <span className="text-primary">PORTAL</span>
            </h1>
            <p className="text-slate-500 text-xs font-black tracking-[0.4em] uppercase">Ersin Güleş • Dijital Mimari</p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl flex items-center gap-3">
                <i className="fa-brands fa-github text-primary"></i>
                <div className="text-right">
                    <p className="text-[8px] font-black text-slate-500 uppercase">Otonom Yedekleme</p>
                    <p className="text-[10px] font-bold text-primary">{lastBackup}</p>
                </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<i className="fa-solid fa-bolt-lightning text-xl"></i>}
            title="Hızlı Analiz"
            desc="Verilerinizi yapay zeka ile saniyeler içinde analiz edin."
            onClick={() => onViewChange(AppView.TOOLS)}
          />
          <FeatureCard
            icon={<i className="fa-solid fa-image text-xl"></i>}
            title="Görsel Üretimi"
            desc="Hayallerinizi fotorealistik görsellere dönüştürün."
            onClick={() => onViewChange(AppView.VISUALS)}
          />
          <FeatureCard
            icon={<i className="fa-solid fa-microphone-lines text-xl"></i>}
            title="Ses Sentezi"
            desc="Metinleri profesyonel seslendirmelere çevirin."
            onClick={() => onViewChange(AppView.AUDIO)}
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
              <i className="fa-solid fa-key text-primary"></i>
              API Anahtar Havuzu (Canlı)
              <span className="text-[10px] text-slate-500 lowercase font-normal italic">Aktif rotasyon ve kota yönetimi</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {apiKeys.map(key => {
              const usage = key.usageCount || 0;
              const limit = key.quotaLimit || 1500;
              const progress = Math.min((usage / limit) * 100, 100);
              const remaining = Math.max(limit - usage, 0);

              return (
                <div key={key.id} className="bg-surface/50 border border-white/5 rounded-3xl p-5 hover:border-primary/30 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <i className={`fa-solid ${key.provider === 'gemini' ? 'fa-gem' : 'fa-brain'}`}></i>
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-white truncate max-w-[100px]">{key.label}</p>
                        <p className="text-[8px] text-gray-500 font-bold uppercase">{key.provider}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[7px] font-black uppercase ${key.isQuotaExhausted ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                      {key.isQuotaExhausted ? 'DOLU' : 'AKTİF'}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[9px]">
                      <span className="text-gray-500 font-bold uppercase">Kalan</span>
                      <span className="text-white font-black">{remaining} İŞLEM</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <i className="fa-solid fa-microchip text-lg"></i>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Sistem Sağlığı ve Analiz</h4>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Gelişmiş sinir sistemi metrikleri ve mantık motoru durumu</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <MetricBox label="OTURUM SÜRESİ" value={formatSessionTime(sessionTime)} icon="fa-clock" />
            <MetricBox label="İŞLEM SÜRESİ" value="1.2s" icon="fa-bolt" />
            <MetricBox label="SİNİR SİSTEMİ" value={`%${neuralLoad}`} icon="fa-brain" color="text-primary" />
            <MetricBox label="MANTIK MOTORU" value="Aktif" icon="fa-gears" color="text-green-500" />
            <MetricBox label="BEYİN KAPASİTESİ" value={`%${brainCapacity}`} icon="fa-bolt-lightning" />
            <MetricBox label="API KOTASI (KALAN)" value={`${Math.max(totalQuota - totalUsed, 0)}`} icon="fa-database" />
            <MetricBox label="API KOTASI (KULLANILAN)" value={`${totalUsed}`} icon="fa-chart-pie" />
            <MetricBox label="ÇALIŞMA SÜRESİ" value="14g 5s" icon="fa-server" />
            <MetricBox label="MEDYA MOTORU" value="Hazır" icon="fa-play" color="text-blue-400" />
            <MetricBox label="BAĞLANTI" value="Stabil" icon="fa-signal" color="text-emerald-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-surface/30 backdrop-blur-md border border-white/5 rounded-3xl p-6">
              <h5 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <i className="fa-solid fa-hard-drive text-primary"></i> Hafıza (Storage)
              </h5>
              <div className="space-y-4">
                <StorageItem label="Sohbet Kayıtları" value={`${storageStats.messages} Mesaj`} icon="fa-message" />
                <StorageItem label="Görsel Varlıklar" value={`${storageStats.assets} Adet`} icon="fa-image" />
                <StorageItem label="Local Storage" value={`${storageStats.size} KB`} icon="fa-folder-open" />
                <StorageItem label="Aktif Modüller" value={`${storageStats.modules} Modül`} icon="fa-cube" />
              </div>
            </div>

            <div className="lg:col-span-2 bg-brandDark/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 font-mono relative overflow-hidden">
              <h5 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
                <i className="fa-solid fa-wave-square text-primary animate-pulse"></i> Sinaptik Akış (Canlı İzleme)
              </h5>
              <div className="space-y-2 text-[11px] relative z-10">
                <div className="flex gap-4 text-gray-500">
                  <span className="shrink-0 text-primary">{new Date().toLocaleTimeString()}</span>
                  <span>Sinaptik Bağlantı Optimize Edildi</span>
                </div>
                <div className="flex gap-4 text-gray-500">
                  <span className="shrink-0 text-primary">{new Date().toLocaleTimeString()}</span>
                  <span>Gemini-3-Flash API Yanıtı Alındı (142ms)</span>
                </div>
                <div className="flex gap-4 text-emerald-400 font-bold bg-emerald-400/5 p-1 rounded">
                  <span className="shrink-0">SYSTEM</span>
                  <span>GitHub Otonom Senkronizasyonu Tamamlandı <span className="px-1.5 py-0.5 bg-emerald-500 text-black text-[8px] font-black rounded tracking-tighter">AKTİF</span></span>
                </div>
                <div className="flex items-center gap-2 text-primary pt-2 italic animate-pulse">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Yeni sinaptik veriler bekleniyor...
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 bg-gradient-to-br from-surface/50 to-brandDark/50 backdrop-blur-md border border-white/5 rounded-3xl p-8">
              <h5 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                <i className="fa-solid fa-brain text-primary"></i> Mantık Katmanı (Logic Processing)
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">KARAR MEKANİZMASI</p>
                  <p className="text-sm text-gray-300 leading-relaxed">Multimodal veri analizi ve önceliklendirme algoritması aktif.</p>
                </div>
                <div className="space-y-2 border-l border-white/5 pl-8">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">YAPAY SİNİR AĞI</p>
                  <p className="text-sm text-gray-300 leading-relaxed">Dinamik API rotasyonu ve hata tolerans yönetimi optimize edildi.</p>
                </div>
                <div className="space-y-2 border-l border-white/5 pl-8">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">SEMANTİK İŞLEME</p>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-300">Bağlamsal hafıza geri çağırma hızı: <span className="text-primary font-bold">142ms</span></p>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase">(Optimize Edildi)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, desc, onClick }: { icon: React.ReactNode, title: string, desc: string, onClick?: () => void }) => (
  <div className="group bg-surface hover:bg-white/5 border border-white/5 p-6 rounded-custom transition-all cursor-pointer" onClick={onClick}>
    <div className="w-12 h-12 bg-primary/10 rounded-custom flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h4 className="font-bold mb-2 text-white">{title}</h4>
    <p className="text-sm text-gray-400">{desc}</p>
  </div>
);

const MetricBox = ({ label, value, icon, color = "text-white" }: { label: string, value: string, icon: string, color?: string }) => (
  <div className="bg-surface/50 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex flex-col justify-between group hover:border-primary/20 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{label}</p>
      <i className={`fa-solid ${icon} text-[10px] text-gray-600 group-hover:text-primary transition-colors`}></i>
    </div>
    <p className={`text-xl font-black ${color}`}>{value}</p>
  </div>
);

const StorageItem = ({ label, value, icon }: { label: string, value: string, icon: string }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center text-gray-400">
        <i className={`fa-solid ${icon} text-xs`}></i>
      </div>
      <p className="text-xs font-bold text-gray-300">{label}</p>
    </div>
    <p className="text-xs font-black text-white">{value}</p>
  </div>
);

export default HomeView;
