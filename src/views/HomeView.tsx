import React, { useState, useEffect } from 'react';
import { getStorageItem } from '../utils/storage';
import { getAllKeys } from '../utils/apiPool';
import { AppView } from '../types';

interface HomeViewProps {
  onViewChange: (view: AppView | string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onViewChange }) => {
  const [sessionSeconds, setSessionSeconds] = useState(315); // Start at 00:05:15
  const [neuralLoad, setNeuralLoad] = useState(24);
  const [processTime, setProcessTime] = useState(4.2);
  const [remainingTime, setRemainingTime] = useState(1.8);
  const [brainCapacity, setBrainCapacity] = useState(82);
  const [logs, setLogs] = useState([
    { time: '10:42:01', text: 'Sinaptik Bağlantı Kuruldu', color: 'text-primary' },
    { time: '10:42:05', text: 'Gemini-3-Flash API Yanıtı Alındı', color: 'text-emerald-400' },
    { time: '10:43:12', text: 'Hafıza Blokları Optimize Edildi', color: 'text-indigo-400' },
    { time: '10:45:00', text: 'GitHub Senkronizasyonu Tamamlandı', color: 'text-primary', badge: 'AKTİF' }
  ]);

  const [apiKeys, setApiKeys] = useState(getAllKeys());
  const [dynamicModuleCount, setDynamicModuleCount] = useState(0);

  const refreshState = () => {
    setApiKeys(getAllKeys());
    setDynamicModuleCount(getStorageItem('active_dynamic_modules', []).length);
  };

  useEffect(() => {
    refreshState();
    const timer = setInterval(() => {
      setSessionSeconds(prev => prev + 1);
      setNeuralLoad(prev => Math.max(20, Math.min(30, prev + (Math.random() - 0.5))));
      setProcessTime(prev => Math.max(3.5, Math.min(5.0, prev + (Math.random() - 0.5) * 0.1)));
      setRemainingTime(prev => {
        let next = prev - 0.1;
        return next <= 0 ? 2.0 : parseFloat(next.toFixed(1));
      });
      setBrainCapacity(prev => Math.max(80, Math.min(85, prev + (Math.random() - 0.5))));
    }, 1000);

    const logTimer = setInterval(() => {
       const info = localStorage.getItem('last_ai_usage_info');
       if (info) {
          const parsed = JSON.parse(info);
          if (Date.now() - parsed.timestamp < 5000) {
              refreshState();
          }
       }
    }, 5000);

    return () => {
        clearInterval(timer);
        clearInterval(logTimer);
    };
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const keys = getAllKeys();
  const totalUsed = keys.reduce((acc, k) => acc + (k.usageCount || 0), 0);
  const totalLimit = keys.reduce((acc, k) => acc + (k.quotaLimit || 500), 0);
  const quotaRemaining = Math.max(0, totalLimit - totalUsed);

  const localStorageSizeKB = (JSON.stringify(localStorage).length / 1024).toFixed(2);
  const chatHistoryLength = getStorageItem('chat_history', []).length;

  return (
    <div className="flex-1 p-4 lg:p-12 overflow-y-auto bg-brandDark/20 pb-40" id="home">
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000">

        {/* Header */}
        <header className="border-b border-white/5 pb-12">
          <h1 className="text-6xl lg:text-8xl font-black text-white italic tracking-tighter uppercase leading-none text-glow">
            NEXUS <span className="text-primary">PORTAL</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black tracking-[0.6em] uppercase mt-6 ml-2">Portal Sahibi • Ersin Güleş</p>
        </header>

        {/* Dashboard Title */}
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <i className="fa-solid fa-microchip text-primary"></i>
            </div>
            <div>
                <h2 className="text-xl font-black text-white uppercase italic tracking-wider">SİSTEM SAĞLIĞI VE ANALİZ</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Gelişmiş sinir sistemi metrikleri ve mantık motoru durumu</p>
            </div>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <MetricCard label="OTURUM SÜRESİ" value={formatTime(sessionSeconds)} icon="fa-hourglass-start" />
          <MetricCard label="İŞLEM SÜRESİ" value={`${processTime.toFixed(1)} saniye`} icon="fa-bolt" />
          <MetricCard label="KALAN SÜRE" value={`${remainingTime.toFixed(1)}s`} icon="fa-clock" />
          <MetricCard label="SİNİR SİSTEMİ" value={`%${Math.round(neuralLoad)}`} color="text-primary" icon="fa-network-wired" />
          <MetricCard label="MANTIK MOTORU" value="Aktif" color="text-emerald-400" icon="fa-brain" />
          <MetricCard label="BEYİN KAPASİTESİ" value={`%${Math.round(brainCapacity)}`} icon="fa-microchip" />
          <MetricCard label="API KOTASI (KALAN)" value={`${(quotaRemaining/1000).toFixed(1)}k`} color="text-primary" icon="fa-key" />
          <MetricCard label="API KOTASI (KULLANILAN)" value={totalUsed.toString()} icon="fa-chart-line" />
          <MetricCard label="ÇALIŞMA SÜRESİ" value="14g 5s" icon="fa-calendar-check" />
          <MetricCard label="MEDYA MOTORU" value="Hazır" color="text-indigo-400" icon="fa-clapperboard" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Storage Section */}
          <div className="portal-card p-8 bg-brandDark/40">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                <i className="fa-solid fa-database text-primary"></i> Hafıza (Storage)
            </h3>
            <div className="space-y-6">
                <StorageRow label="Sohbet Kayıtları" value={`${chatHistoryLength} Mesaj`} />
                <StorageRow label="Görsel Varlıklar" value="0 Adet" />
                <StorageRow label="Local Storage" value={`${localStorageSizeKB} KB`} />
                <StorageRow label="GitHub Depo Boyutu" value="Yapılandırılmadı" />
                <StorageRow label="Aktif Modüller" value={`${dynamicModuleCount} Modül`} />
            </div>
          </div>

          {/* Synaptic Flow Logs */}
          <div className="lg:col-span-2 portal-card p-8 bg-brandDark/60 font-mono relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <i className="fa-solid fa-dna text-7xl"></i>
            </div>
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                <i className="fa-solid fa-wave-square text-primary animate-pulse"></i> Sinaptik Akış (Canlı İzleme)
            </h3>
            <div className="space-y-3 text-[11px]">
                {logs.map((log, i) => (
                    <div key={i} className="flex gap-6 items-center">
                        <span className="text-slate-600 shrink-0">[{log.time}]</span>
                        <span className={`${log.color} font-bold`}>{log.text}</span>
                        {log.badge && <span className="bg-primary text-white text-[8px] px-2 py-0.5 rounded font-black tracking-tighter uppercase">{log.badge}</span>}
                    </div>
                ))}
                <div className="flex gap-6 items-center animate-pulse pt-2 text-primary">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span className="italic">Yeni sinaptik veriler bekleniyor...</span>
                </div>
            </div>
          </div>

          {/* API Keys Pool */}
          <div className="lg:col-span-3 portal-card p-8">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                  <i className="fa-solid fa-key text-primary"></i> API Anahtar Havuzu (Canlı)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {apiKeys.map(k => {
                  const usage = k.usageCount || 0;
                  const limit = k.quotaLimit || 500;
                  const percent = Math.min(100, (usage / limit) * 100);

                  return (
                    <div key={k.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3 hover:border-primary/40 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <i className={`fa-solid ${k.provider === 'gemini' ? 'fa-gem' : 'fa-brain'} text-[10px] text-primary`}></i>
                          <p className="text-[10px] font-bold text-white uppercase truncate max-w-[100px]">{k.label}</p>
                        </div>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${k.isQuotaExhausted ? 'bg-red-500 text-white' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {k.isQuotaExhausted ? 'DOLU' : 'AKTİF'}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-black text-gray-500">
                          <span>{usage} / {limit}</span>
                          <span>%{percent.toFixed(0)}</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${percent > 90 ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                      <p className="text-[8px] text-gray-600 font-mono truncate">Key: ****{k.key.slice(-4)}</p>
                    </div>
                  );
                })}
              </div>
          </div>

          {/* Logic Processing Layer */}
          <div className="lg:col-span-3 portal-card p-10 bg-gradient-to-br from-brandDark to-black border-primary/10">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                <i className="fa-solid fa-brain text-primary"></i> Mantık Katmanı (Logic Processing)
            </h3>
            <div className="grid md:grid-cols-3 gap-12">
                <LogicItem
                    title="KARAR MEKANİZMASI"
                    desc="Multimodal veri analizi ve önceliklendirme algoritması aktif."
                />
                <LogicItem
                    title="YAPAY SİNİR AĞI"
                    desc="Dinamik API rotasyonu ve hata tolerans yönetimi optimize edildi."
                />
                <LogicItem
                    title="SEMANTİK İŞLEME"
                    desc={<>Bağlamsal hafıza geri çağırma hızı: <span className="text-primary font-bold">142ms</span> <span className="text-[10px] text-emerald-400 font-bold uppercase ml-2">(Optimize)</span></>}
                />
            </div>
          </div>

        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<i className="fa-solid fa-music text-xl"></i>}
            title="Suno AI Müzik"
            desc="Saniyeler içinde profesyonel kalitede şarkılar üretin."
            onClick={() => onViewChange(AppView.SUNO)}
          />
          <FeatureCard
            icon={<i className="fa-solid fa-image text-xl"></i>}
            title="Görsel Üretimi"
            desc="Hayallerinizi fotorealistik görsellere dönüştürün."
            onClick={() => onViewChange(AppView.VISUALS)}
          />
          <FeatureCard
            icon={<i className="fa-solid fa-bolt-lightning text-xl"></i>}
            title="Hızlı Analiz"
            desc="Verilerinizi yapay zeka ile saniyeler içinde analiz edin."
            onClick={() => onViewChange(AppView.TOOLS)}
          />
        </div>

      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, onClick }: { icon: React.ReactNode, title: string, desc: string, onClick?: () => void }) => (
  <div className="group portal-card p-6 cursor-pointer hover:border-primary/40 transition-all" onClick={onClick}>
    <div className="w-12 h-12 bg-primary/10 rounded-custom flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h4 className="font-bold mb-2 text-white uppercase tracking-wider">{title}</h4>
    <p className="text-sm text-gray-400">{desc}</p>
  </div>
);

const MetricCard = ({ label, value, icon, color = "text-white" }: { label: string, value: string, icon: string, color?: string }) => (
    <div className="portal-card p-6 bg-brandDark/40 hover:border-primary/30 transition-all group">
        <div className="flex justify-between items-start mb-4">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
            <i className={`fa-solid ${icon} text-[11px] text-primary/30 group-hover:text-primary transition-colors`}></i>
        </div>
        <p className={`text-xl font-black italic tracking-tighter ${color}`}>{value}</p>
    </div>
);

const StorageRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{label}</span>
        <span className="text-xs font-black text-white">{value}</span>
    </div>
);

const LogicItem = ({ title, desc }: { title: string, desc: React.ReactNode }) => (
    <div className="space-y-3">
        <h4 className="text-xs font-black text-primary uppercase tracking-widest">{title}</h4>
        <div className="h-px bg-white/10 w-12"></div>
        <div className="text-[11px] text-slate-400 leading-relaxed font-bold">{desc}</div>
    </div>
);

export default HomeView;
