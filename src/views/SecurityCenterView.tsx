import React from 'react';

const SecurityCenterView: React.FC = () => {
  return (
    <div className="space-y-10 pb-32">
      <header className="space-y-2">
        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Güvenlik Merkezi</h2>
        <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">AI Destekli Tehdit Analizi ve Kalkan Yönetimi</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatBox label="Sistem Durumu" value="GÜVENLİ" sub="Tüm modüller aktif" color="text-emerald-500" />
        <StatBox label="Bloke Edilen Tehdit" value="1,247" sub="Son 24 saat içinde" color="text-primary" />
        <StatBox label="Güvenlik Skoru" value="98.2%" sub="Global standartlarda" color="text-cyan-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-[3rem] border border-white/5 bg-surface/30">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center"><i className="fa-solid fa-shield-halved"></i></span>
            Aktif Koruma Kalkanları
          </h3>
          <div className="space-y-4">
            <ShieldToggle label="Firewall AI" desc="Gelen trafik analizi" active />
            <ShieldToggle label="Auth Sentinel" desc="Yetkisiz erişim engelleme" active />
            <ShieldToggle label="Data Encryption" desc="Uçtan uca şifreleme" active />
            <ShieldToggle label="Phishing Guard" desc="Sahte içerik tespiti" />
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[3rem] border border-white/5 bg-surface/30">
          <h3 className="text-xl font-bold text-white mb-6">Son Güvenlik Olayları</h3>
          <div className="space-y-4">
            <EventItem time="12:45" type="Login" status="Başarılı" desc="Yeni cihaz: MacOS / İstanbul" color="text-emerald-500" />
            <EventItem time="11:20" type="Alert" status="Blok" desc="Brute-force saldırısı engellendi" color="text-red-500" />
            <EventItem time="09:15" type="System" status="Sync" desc="Güvenlik veritabanı güncellendi" color="text-primary" />
            <EventItem time="04:30" type="Scan" status="Temiz" desc="Rutin sistem taraması tamamlandı" color="text-emerald-500" />
          </div>
        </div>
      </div>

      <div className="glass-panel p-10 rounded-[3rem] border border-white/5 bg-gradient-to-br from-primary/10 to-transparent">
         <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-full border-4 border-primary border-t-transparent animate-spin flex items-center justify-center">
              <i className="fa-solid fa-user-shield text-4xl text-primary"></i>
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="text-2xl font-bold text-white uppercase italic">Deep-Scan Analizi Başlat</h4>
              <p className="text-slate-400">Yapay zeka tüm dosyalarınızı, veritabanınızı ve bağlantılarınızı en ince ayrıntısına kadar tarayarak potansiyel açıkları raporlar.</p>
            </div>
            <button className="px-10 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform">TARAMAYI BAŞLAT</button>
         </div>
      </div>
    </div>
  );
};

const StatBox: React.FC<{label: string, value: string, sub: string, color: string}> = ({label, value, sub, color}) => (
  <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-surface/30">
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{label}</p>
    <h3 className={`text-3xl font-black italic tracking-tighter ${color}`}>{value}</h3>
    <p className="text-[9px] text-slate-500 uppercase font-black mt-2 opacity-50">{sub}</p>
  </div>
);

const ShieldToggle: React.FC<{label: string, desc: string, active?: boolean}> = ({label, desc, active}) => (
  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
    <div>
      <h4 className="text-sm font-bold text-white">{label}</h4>
      <p className="text-[10px] text-slate-500 font-bold uppercase">{desc}</p>
    </div>
    <div className={`w-12 h-6 rounded-full relative transition-colors ${active ? 'bg-primary' : 'bg-slate-700'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'right-1' : 'left-1'}`}></div>
    </div>
  </div>
);

const EventItem: React.FC<{time: string, type: string, status: string, desc: string, color: string}> = ({time, type, status, desc, color}) => (
  <div className="flex items-center gap-4 p-4 bg-black/20 rounded-2xl border border-white/5">
    <div className="text-[10px] font-black text-slate-600">{time}</div>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-white">{type}</span>
        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-white/5 ${color}`}>{status}</span>
      </div>
      <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{desc}</p>
    </div>
  </div>
);

export default SecurityCenterView;
