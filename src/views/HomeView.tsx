import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { getAllKeys } from '../utils/apiPool';

interface HomeViewProps {
  onViewChange: (view: AppView) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onViewChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [apiKeys, setApiKeys] = useState(getAllKeys());

  useEffect(() => {
    const interval = setInterval(() => {
      setApiKeys(getAllKeys());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onViewChange(AppView.CHAT);
    }
  };

  const maskKey = (key: string) => {
    if (!key) return '---';
    if (key.length <= 8) return '********';
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  return (
    <section id="home" className="min-h-screen p-4 lg:p-12 animate-in fade-in duration-700 pb-32 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 py-8">
          <div className="space-y-2">
            <h1 className="text-5xl lg:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
              Nexus <span className="text-primary">Portal</span>
            </h1>
            <p className="text-xs lg:text-sm text-slate-500 font-bold uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-8 h-px bg-primary"></span> Ersin Güleş • Dijital Mimari
            </p>
          </div>

          <div className="w-full lg:w-96">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Evrende bir şeyler ara..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:border-primary/50 outline-none transition-all"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors"></i>
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:brightness-110 transition-all"
              >
                ARA
              </button>
            </form>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <FeatureCard
            icon={<i className="fa-solid fa-bolt text-2xl"></i>}
            title="Hızlı Analiz"
            desc="Verilerinizi yapay zeka ile saniyeler içinde analiz edin."
            onClick={() => onViewChange(AppView.CHAT)}
          />
          <FeatureCard
            icon={<i className="fa-solid fa-image text-2xl"></i>}
            title="Görsel Üretimi"
            desc="Hayallerinizi fotorealistik görsellere dönüştürün."
            onClick={() => onViewChange(AppView.VISUALS)}
          />
          <FeatureCard
            icon={<i className="fa-solid fa-microphone text-2xl"></i>}
            title="Ses Sentezi"
            desc="Metinleri profesyonel seslendirmelere çevirin."
            onClick={() => onViewChange(AppView.AUDIO)}
          />
        </div>

        {/* API Pool Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <i className="fa-solid fa-key text-lg"></i>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">API Anahtar Havuzu (Canlı)</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Aktif rotasyon ve kota yönetimi</p>
              </div>
            </div>
            <button
               onClick={() => onViewChange(AppView.SETTINGS)}
               className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/10 transition-all"
            >
               YÖNET
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {apiKeys.map((key) => {
              const remaining = Math.max(0, (key.quotaLimit || 0) - (key.usageCount || 0));
              const progress = Math.min(100, ((key.usageCount || 0) / (key.quotaLimit || 1)) * 100);

              return (
                <div key={key.id} className="bg-surface/50 backdrop-blur-md border border-white/5 p-5 rounded-[2rem] group hover:border-primary/20 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${key.isQuotaExhausted ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                        <i className={`fa-solid ${key.provider === 'gemini' ? 'fa-gem' : 'fa-brain'} text-xs`}></i>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white uppercase truncate max-w-[100px]">{key.label}</p>
                        <p className="text-[8px] text-gray-500 font-bold uppercase">{key.provider}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[7px] font-black uppercase ${key.isQuotaExhausted ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                      {key.isQuotaExhausted ? 'DOLU' : 'AKTİF'}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[9px]">
                      <span className="text-gray-500 font-bold">ANAHTAR</span>
                      <span className="text-white font-mono">{maskKey(key.key)}</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="text-gray-500 font-bold">KALAN KOTA</span>
                        <span className={`font-black ${remaining < 100 ? 'text-red-400' : 'text-primary'}`}>{remaining} İŞLEM</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${key.isQuotaExhausted ? 'bg-red-500' : 'bg-primary'}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Health & Analysis Section */}
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
            <MetricBox label="OTURUM SÜRESİ" value="00:05:15" icon="fa-clock" />
            <MetricBox label="İŞLEM SÜRESİ" value="4,2 saniye" icon="fa-bolt" />
            <MetricBox label="KALAN SÜRE" value="1.8s" icon="fa-hourglass-half" />
            <MetricBox label="SİNİR SİSTEMİ" value="%24" icon="fa-brain" color="text-primary" />
            <MetricBox label="MANTIK MOTORU" value="Aktif" icon="fa-gears" color="text-green-500" />
            <MetricBox label="BEYİN KAPASİTESİ" value="%82" icon="fa-bolt-lightning" />
            <MetricBox label="API KOTASI (TOPLAM)" value={`${apiKeys.reduce((acc, k) => acc + (k.quotaLimit || 0), 0)}`} icon="fa-database" />
            <MetricBox label="API KOTASI (KULLANILAN)" value={`${apiKeys.reduce((acc, k) => acc + (k.usageCount || 0), 0)}`} icon="fa-chart-pie" />
            <MetricBox label="ÇALIŞMA SÜRESİ" value="14g 5s" icon="fa-server" />
            <MetricBox label="MEDYA MOTORU" value="Hazır" icon="fa-play" color="text-blue-400" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-surface/30 backdrop-blur-md border border-white/5 rounded-3xl p-6">
              <h5 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <i className="fa-solid fa-hard-drive text-primary"></i> Hafıza (Storage)
              </h5>
              <div className="space-y-4">
                <StorageItem label="Sohbet Kayıtları" value="2 Mesaj" icon="fa-message" />
                <StorageItem label="Görsel Varlıklar" value="0 Adet" icon="fa-image" />
                <StorageItem label="Local Storage" value="3.46 KB" icon="fa-folder-open" />
                <StorageItem label="GitHub Depo Boyutu" value="Yapılandırılmadı" icon="fa-github" />
              </div>
            </div>

            <div className="lg:col-span-2 bg-brandDark/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 font-mono relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <i className="fa-solid fa-network-wired text-6xl"></i>
              </div>
              <h5 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
                <i className="fa-solid fa-wave-square text-primary animate-pulse"></i> Sinaptik Akış (Canlı İzleme)
              </h5>
              <div className="space-y-2 text-[11px] relative z-10">
                <div className="flex gap-4 text-gray-500">
                  <span className="shrink-0 text-primary">10:42:01</span>
                  <span>Sinaptik Bağlantı Kuruldu</span>
                </div>
                <div className="flex gap-4 text-gray-500">
                  <span className="shrink-0 text-primary">10:42:05</span>
                  <span>Gemini-3-Flash API Yanıtı Alındı</span>
                </div>
                <div className="flex gap-4 text-gray-500">
                  <span className="shrink-0 text-primary">10:43:12</span>
                  <span>Hafıza Blokları Optimize Edildi</span>
                </div>
                <div className="flex gap-4 text-emerald-400 font-bold bg-emerald-400/5 p-1 rounded">
                  <span className="shrink-0 text-xs">10:45:00</span>
                  <span className="flex items-center gap-2">GitHub Senkronizasyonu Tamamlandı <span className="px-1.5 py-0.5 bg-emerald-500 text-black text-[8px] font-black rounded tracking-tighter">AKTİF</span></span>
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
