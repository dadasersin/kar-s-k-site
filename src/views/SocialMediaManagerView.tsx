import React from 'react';

const SocialMediaManagerView: React.FC = () => {
  return (
    <div className="space-y-10 pb-20">
      <header className="space-y-2">
        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Sosyal Medya Yönetimi</h2>
        <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Multi-Platform Paylaşım ve Etkileşim Otomasyonu</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel p-8 rounded-[3rem] border border-white/5 bg-surface/30">
            <h3 className="text-xl font-bold text-white mb-6">Yeni Paylaşım Oluştur</h3>
            <textarea
              placeholder="Neler oluyor? Tüm platformlarda paylaşmak için yazın..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-lg focus:border-primary outline-none min-h-[200px]"
            />
            <div className="mt-6 flex flex-wrap gap-4">
               <MediaButton icon="fa-image" label="Görsel Ekle" />
               <MediaButton icon="fa-video" label="Video Ekle" />
               <MediaButton icon="fa-hashtag" label="Hashtag Öner" />
               <MediaButton icon="fa-clock" label="Zamanla" />
            </div>
            <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="flex gap-4">
                 <PlatformToggle icon="fa-x-twitter" active />
                 <PlatformToggle icon="fa-instagram" active />
                 <PlatformToggle icon="fa-linkedin" active />
                 <PlatformToggle icon="fa-facebook" />
               </div>
               <button className="px-10 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform w-full md:w-auto">PAYLAŞIM YAP</button>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[3rem] border border-white/5 bg-surface/30">
            <h3 className="text-xl font-bold text-white mb-6">Zamanlanmış Paylaşımlar</h3>
            <div className="space-y-4">
              <ScheduledItem platform="Instagram" time="Bugün, 18:00" text="Geleceğin Yapay Zeka Sistemleri #AI #Jules" />
              <ScheduledItem platform="Twitter" time="Yarın, 10:30" text="Kodlama artık daha kolay. Yeni Workflow motorumuz yayında!" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-surface/30">
            <h3 className="text-lg font-bold text-white mb-6">Performans Analizi</h3>
            <div className="space-y-6">
              <MetricItem label="Toplam Erişim" value="1.2M" trend="+14%" />
              <MetricItem label="Etkileşim Oranı" value="5.8%" trend="+2.1%" />
              <MetricItem label="Yeni Takipçi" value="4,560" trend="+820" />
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-indigo-500/10 to-transparent">
            <h3 className="text-lg font-bold text-white mb-2">AI İçerik Önerisi</h3>
            <p className="text-xs text-slate-500 font-bold uppercase mb-6 leading-relaxed">Yapay zeka, takipçi kitlenizin en aktif olduğu saatleri ve sevdiği konuları analiz ederek size öneriler sunar.</p>
            <button className="w-full py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all text-xs">STRATEJİ OLUŞTUR</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MediaButton: React.FC<{icon: string, label: string}> = ({icon, label}) => (
  <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all">
    <i className={`fa-solid ${icon}`}></i>
    {label}
  </button>
);

const PlatformToggle: React.FC<{icon: string, active?: boolean}> = ({icon, active}) => (
  <button className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-slate-600'}`}>
    <i className={`fa-brands ${icon}`}></i>
  </button>
);

const ScheduledItem: React.FC<{platform: string, time: string, text: string}> = ({platform, time, text}) => (
  <div className="p-4 bg-black/20 rounded-2xl border border-white/5 flex gap-4">
    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
      <i className={`fa-brands ${platform === 'Instagram' ? 'fa-instagram' : 'fa-x-twitter'}`}></i>
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-start mb-1">
        <span className="text-[10px] font-black text-primary uppercase">{platform} • {time}</span>
        <button className="text-slate-600 hover:text-white"><i className="fa-solid fa-ellipsis-h"></i></button>
      </div>
      <p className="text-xs text-slate-300 line-clamp-1">{text}</p>
    </div>
  </div>
);

const MetricItem: React.FC<{label: string, value: string, trend: string}> = ({label, value, trend}) => (
  <div className="space-y-1">
    <div className="flex justify-between items-end">
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
      <span className="text-xs font-bold text-emerald-500">{trend}</span>
    </div>
    <p className="text-2xl font-black text-white italic">{value}</p>
  </div>
);

export default SocialMediaManagerView;
