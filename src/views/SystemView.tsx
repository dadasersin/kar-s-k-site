import React from 'react';

const SystemView: React.FC = () => {
  const modules = [
    { name: 'Nöral Muhakeme', status: 'Optimal', load: '42%', color: 'text-primary' },
    { name: 'Yaratıcı Sentez', status: 'Aktif', load: '18%', color: 'text-purple-400' },
    { name: 'Zamansal İşleme', status: 'Beklemede', load: '0%', color: 'text-blue-400' },
    { name: 'Harici Senkronizasyon', status: 'Bağlı', load: '100%', color: 'text-emerald-400' },
  ];

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-panel rounded-[40px] p-10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">ÇEKİRDEK ÇEVRİMİÇİ</span>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white uppercase mb-4">Otonom Zeka Çekirdeği</h2>
            <p className="text-gray-400 max-w-2xl leading-relaxed mb-10 text-sm">
              Yapay Zeka Merkezi tam yetkiyle çalışmaktadır. Sistem şu anda gelişmiş muhakeme için <span className="text-primary font-bold">Jules Oturum Protokolü</span>'ne bağlıdır.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.map((m, i) => (
                <div key={i} className="p-6 bg-black/40 border border-white/5 rounded-3xl group hover:border-primary/30 transition-all shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{m.name}</h3>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 rounded-lg ${m.color}`}>{m.status}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-black italic text-white">{m.load}</div>
                    <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full bg-current ${m.color} transition-all duration-1000`} style={{ width: m.load }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[40px] p-10 relative overflow-hidden shadow-xl">
            <h3 className="text-xl font-black italic tracking-tighter text-white uppercase mb-6 flex items-center gap-3">
              <i className="fa-solid fa-terminal text-primary"></i>
              Komut Yürütme Günlüğü
            </h3>
            <div className="space-y-4 font-mono text-[10px] text-gray-500">
              <div className="flex gap-4 p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-primary">[14:22:01]</span>
                <span className="text-gray-300">KULLANICI_YETKİ_SEVİYESİ: MASTER_ERSIN_GULES</span>
              </div>
              <div className="flex gap-4 p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-primary">[14:25:12]</span>
                <span className="text-emerald-400 italic font-bold">JULES_OTURUMU: HARİCİ EL SIKIŞMA BAŞLATILIYOR...</span>
              </div>
              <div className="flex gap-4 p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-primary">[14:25:15]</span>
                <span className="text-emerald-500 font-bold uppercase">Bağlantı Kuruldu: Uzaktan Erişim Sağlandı</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8 h-full">
          <div className="bg-gradient-to-br from-primary/20 to-brandDark border border-primary/20 rounded-[40px] p-10 relative overflow-hidden h-full flex flex-col shadow-2xl">
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 blur-[80px] rounded-full"></div>
            <h3 className="text-xl font-black italic tracking-tighter text-white uppercase mb-8 border-b border-white/5 pb-2">YZ Öncelikleri</h3>

            <div className="space-y-6 flex-1">
              <ToggleItem label="Kendi Kendini Düzenleme" desc="YZ'nin arayüzü değiştirmesine izin ver" active />
              <ToggleItem label="Global Arama" desc="Gerçek zamanlı veri akışları" active />
              <ToggleItem label="Oturum Senkronizasyonu" desc="Jules harici bağlantısı" active color="bg-emerald-500" />
            </div>

            <div className="mt-auto p-6 bg-primary/10 border border-primary/20 rounded-3xl">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 italic">Uzaktan Bildirim</p>
              <p className="text-[11px] text-gray-400 italic leading-relaxed">
                "Sistem artık harici oturum köprülemesi için optimize edilmiştir. Ortamınız ve Jules protokolleri tam olarak hizalanmıştır."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToggleItem = ({ label, desc, active, color = 'bg-primary' }: { label: string, desc: string, active: boolean, color?: string }) => (
  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-primary/30 transition-all">
    <div>
      <p className="text-[11px] font-bold text-white uppercase tracking-widest">{label}</p>
      <p className="text-[9px] text-gray-500 uppercase font-medium">{desc}</p>
    </div>
    <div className={`w-10 h-5 ${active ? color : 'bg-gray-800'} rounded-full relative transition-colors shadow-lg`}>
      <div className={`absolute ${active ? 'right-0.5' : 'left-0.5'} top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-300`}></div>
    </div>
  </div>
);

export default SystemView;
