import React from 'react';

const IntegrationsHubView: React.FC = () => {
  const integrations = [
    { name: 'Google Drive', icon: 'fa-google-drive', color: 'text-blue-500', desc: 'Dosya ve veri depolama', status: 'Bağlı' },
    { name: 'Slack', icon: 'fa-slack', color: 'text-purple-500', desc: 'Anlık ekip bildirimleri', status: 'Bağlı' },
    { name: 'Discord', icon: 'fa-discord', color: 'text-indigo-500', desc: 'Topluluk yönetimi ve botlar', status: 'Beklemede' },
    { name: 'GitHub', icon: 'fa-github', color: 'text-white', desc: 'Kod ve versiyon kontrolü', status: 'Bağlı' },
    { name: 'Twitter (X)', icon: 'fa-x-twitter', color: 'text-white', desc: 'Sosyal medya otomasyonu', status: 'Pasif' },
    { name: 'LinkedIn', icon: 'fa-linkedin', color: 'text-blue-600', desc: 'Profesyonel ağ yönetimi', status: 'Pasif' },
    { name: 'Spotify', icon: 'fa-spotify', color: 'text-emerald-500', desc: 'Müzik ve podcast akışı', status: 'Bağlı' },
    { name: 'OpenAI', icon: 'fa-bolt', color: 'text-emerald-400', desc: 'Gelişmiş dil modelleri', status: 'Bağlı' }
  ];

  return (
    <div className="space-y-10 pb-20">
      <header className="space-y-2">
        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Entegrasyon Merkezi</h2>
        <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Tüm Harici Servisleri Tek Bir Noktadan Yönetin</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {integrations.map((app, idx) => (
          <div key={idx} className="glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-surface/30 hover:border-primary/50 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <i className={`fa-brands ${app.icon} ${app.color}`}></i>
              </div>
              <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg ${
                app.status === 'Bağlı' ? 'bg-emerald-500/10 text-emerald-500' :
                app.status === 'Beklemede' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-white/5 text-slate-500'
              }`}>{app.status}</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{app.name}</h3>
            <p className="text-xs text-slate-500 font-bold uppercase mb-6 leading-relaxed">{app.desc}</p>
            <button className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              app.status === 'Bağlı' ? 'bg-white/5 text-white hover:bg-red-500/20 hover:text-red-500' : 'bg-primary text-white hover:brightness-110'
            }`}>
              {app.status === 'Bağlı' ? 'BAĞLANTIYI KES' : 'ŞİMDİ BAĞLA'}
            </button>
          </div>
        ))}
      </div>

      <div className="glass-panel p-8 rounded-[3rem] border border-white/5 bg-black/20">
        <h3 className="text-xl font-bold text-white mb-6">Webhook ve API Anahtarları</h3>
        <div className="space-y-4">
          <KeyItem label="Default Gateway API" value="pk_live_************************" />
          <KeyItem label="Webhook Endpoint" value="https://portal.ersingules.com/api/v1/webhook" />
        </div>
      </div>
    </div>
  );
};

const KeyItem: React.FC<{label: string, value: string}> = ({label, value}) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10 gap-4">
    <div>
      <h4 className="text-sm font-bold text-white mb-1">{label}</h4>
      <p className="font-mono text-xs text-slate-500">{value}</p>
    </div>
    <div className="flex gap-2">
      <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-slate-400"><i className="fa-solid fa-copy"></i></button>
      <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-slate-400"><i className="fa-solid fa-rotate"></i></button>
    </div>
  </div>
);

export default IntegrationsHubView;
