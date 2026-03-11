import React, { useState, useEffect } from 'react';
import { AppView } from '../types';

interface HomeViewProps {
  onViewChange: (view: AppView | string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onViewChange }) => {
  const [sessionSeconds, setSessionSeconds] = useState(315); // 00:05:15

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="p-4 lg:p-12 animate-in fade-in duration-700 pb-32">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="border-b border-white/5 pb-12">
          <h1 className="text-5xl lg:text-7xl font-black text-white italic tracking-tighter uppercase leading-none text-glow">
            NEXUS <span className="text-primary">PORTAL</span>
          </h1>
          <p className="text-slate-500 text-xs font-black tracking-[0.4em] uppercase mt-4">Ersin Güleş • Dijital Mimari</p>
        </header>

        <div className="space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <i className="fa-solid fa-microchip text-lg"></i>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white uppercase tracking-tighter">Sistem Sağlığı ve Analiz</h4>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Gelişmiş sinir sistemi metrikleri ve mantık motoru durumu</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <MetricBox label="OTURUM SÜRESİ" value={formatTime(sessionSeconds)} />
            <MetricBox label="İŞLEM SÜRESİ" value="4,2 saniye" />
            <MetricBox label="KALAN SÜRE" value="1.8s" />
            <MetricBox label="SİNİR SİSTEMİ" value="%24" color="text-primary" />
            <MetricBox label="MANTIK MOTORU" value="Aktif" color="text-green-500" />
            <MetricBox label="BEYİN KAPASİTESİ" value="%82" />
            <MetricBox label="API KOTASI (KALAN)" value="1.2k" />
            <MetricBox label="API KOTASI (KULLANILAN)" value="300" />
            <MetricBox label="ÇALIŞMA SÜRESİ" value="14g 5s" />
            <MetricBox label="MEDYA MOTORU" value="Hazır" color="text-blue-400" />
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
                  <span className="shrink-0 text-primary">10:45:00</span>
                  <span>GitHub Senkronizasyonu Tamamlandı <span className="px-1.5 py-0.5 bg-emerald-500 text-black text-[8px] font-black rounded tracking-tighter ml-2 uppercase">AKTİF</span></span>
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
                    <p className="text-[10px] text-emerald-400 font-bold uppercase">(Optimize)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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

const MetricBox = ({ label, value, color = "text-white" }: { label: string, value: string, color?: string }) => (
  <div className="bg-surface/50 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex flex-col justify-between hover:border-primary/20 transition-colors">
    <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-4">{label}</p>
    <p className={`text-xl font-black ${color}`}>{value}</p>
  </div>
);

const StorageItem = ({ label, value, icon }: { label: string, value: string, icon: string }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
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
