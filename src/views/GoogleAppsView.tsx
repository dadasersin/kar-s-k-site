import React, { useState } from 'react';

const GoogleAppsView: React.FC = () => {
  const [filter, setFilter] = useState('Hepsi');

  const apps = [
    { name: 'Google Arama', category: 'Araçlar', icon: 'fa-magnifying-glass', color: 'text-blue-500', desc: 'Dünyadaki bilgilere en hızlı erişim yolu.' },
    { name: 'YouTube', category: 'Eğlence', icon: 'fa-youtube', color: 'text-red-500', desc: 'Milyonlarca video, müzik ve içerik dünyası.' },
    { name: 'Google Haritalar', category: 'Navigasyon', icon: 'fa-map-location-dot', color: 'text-green-500', desc: 'Dünyayı keşfedin ve yolunuzu kolayca bulun.' },
    { name: 'Gmail', category: 'İletişim', icon: 'fa-envelope', color: 'text-red-400', desc: 'Hızlı, güvenli ve akıllı e-posta hizmeti.' },
    { name: 'Google Drive', category: 'Üretkenlik', icon: 'fa-hard-drive', color: 'text-blue-400', desc: 'Tüm dosyalarınız her zaman yanınızda.' },
    { name: 'Google Fotoğraflar', category: 'Eğlence', icon: 'fa-image', color: 'text-blue-600', desc: 'Anılarınızı yedekleyin ve kolayca organize edin.' },
    { name: 'Google Dokümanlar', category: 'Üretkenlik', icon: 'fa-file-lines', color: 'text-blue-500', desc: 'Çevrimiçi dökümanlar oluşturun ve düzenleyin.' },
    { name: 'Google E-Tablolar', category: 'Üretkenlik', icon: 'fa-file-excel', color: 'text-green-600', desc: 'Verilerinizi akıllı tablolarla yönetin.' },
    { name: 'Google Slaytlar', category: 'Üretkenlik', icon: 'fa-file-powerpoint', color: 'text-yellow-500', desc: 'Etkileyici sunumlar hazırlayın.' },
    { name: 'Google Meet', category: 'İletişim', icon: 'fa-video', color: 'text-blue-500', desc: 'Güvenli görüntülü toplantılar yapın.' },
    { name: 'Google Takvim', category: 'Üretkenlik', icon: 'fa-calendar-days', color: 'text-blue-400', desc: 'Zamanınızı verimli bir şekilde planlayın.' },
    { name: 'Google Keep', category: 'Üretkenlik', icon: 'fa-note-sticky', color: 'text-yellow-600', desc: 'Hızlı notlar alın ve hatırlatıcılar kurun.' },
    { name: 'Google Çeviri', category: 'Araçlar', icon: 'fa-language', color: 'text-blue-500', desc: 'Diller arası engelleri anında kaldırın.' },
    { name: 'Google Lens', category: 'Araçlar', icon: 'fa-camera-retro', color: 'text-blue-400', desc: 'Gördüğünüz her şeyi yapay zeka ile arayın.' },
    { name: 'Google Earth', category: 'Eğlence', icon: 'fa-earth-americas', color: 'text-blue-500', desc: 'Dünyayı 3D olarak uydudan keşfedin.' },
    { name: 'Google Chrome', category: 'Araçlar', icon: 'fa-chrome', color: 'text-blue-500', desc: 'Hızlı ve güvenli web tarayıcısı.' },
    { name: 'Google Play', category: 'Eğlence', icon: 'fa-play', color: 'text-blue-400', desc: 'Milyonlarca uygulama, oyun ve içerik.' },
    { name: 'Google News', category: 'Eğlence', icon: 'fa-newspaper', color: 'text-blue-500', desc: 'Size özel seçilmiş güncel haberler.' },
    { name: 'Google Chat', category: 'İletişim', icon: 'fa-comments', color: 'text-green-500', desc: 'Ekibinizle anlık olarak mesajlaşın.' },
    { name: 'Google Tasks', category: 'Üretkenlik', icon: 'fa-list-check', color: 'text-blue-500', desc: 'Yapılacak işlerinizi takip edin.' },
    { name: 'Gemini (AI)', category: 'Yapay Zeka', icon: 'fa-wand-magic-sparkles', color: 'text-purple-500', desc: 'Google\'ın en gelişmiş yapay zekası.' },
    { name: 'Google Cloud', category: 'İş', icon: 'fa-cloud', color: 'text-blue-400', desc: 'Bulut bilişim ve uygulama geliştirme.' },
    { name: 'Google Ads', category: 'İş', icon: 'fa-rectangle-ad', color: 'text-blue-500', desc: 'İşletmenizi Google üzerinden büyütün.' },
    { name: 'Google Analytics', category: 'İş', icon: 'fa-chart-simple', color: 'text-yellow-600', desc: 'Web sitesi ve uygulama verilerinizi analiz edin.' },
  ];

  const categories = ['Hepsi', ...Array.from(new Set(apps.map(a => a.category)))];
  const filteredApps = filter === 'Hepsi' ? apps : apps.filter(a => a.category === filter);

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark">
      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">Google Ekosistemi</h1>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Google'ın tüm araçları tek bir noktada</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredApps.map((app, i) => (
            <div
              key={app.name}
              className="glass-panel p-8 rounded-[2.5rem] flex flex-col items-start gap-6 group hover:border-primary/50 hover:bg-white/5 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                <i className={`fa-solid ${app.icon} text-2xl ${app.color}`}></i>
              </div>
              <div>
                <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-1 block opacity-50">{app.category}</span>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{app.name}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{app.desc}</p>
              </div>
              <button className="mt-auto pt-4 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                 <span className="text-[10px] font-black uppercase tracking-widest">Uygulamaya Git</span>
                 <i className="fa-solid fa-arrow-right-to-bracket text-[8px]"></i>
              </button>
            </div>
          ))}
        </div>

        <section className="bg-gradient-to-br from-primary/20 to-brandDark border border-primary/20 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
              <i className="fa-brands fa-google text-[15rem]"></i>
            </div>
            <div className="relative z-10 max-w-2xl">
               <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">Google Cloud Platform</h2>
               <p className="text-slate-400 leading-relaxed">Geliştiriciler ve işletmeler için dünyanın en gelişmiş bulut altyapısı. Yapay zeka modelleri, veritabanları ve sunucusuz mimarilerle uygulamalarınızı ölçeklendirin.</p>
               <button className="mt-8 px-10 py-4 bg-primary hover:brightness-110 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all text-xs">
                 KONSOLU AÇ
               </button>
            </div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
               <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center backdrop-blur-md">
                  <p className="text-2xl font-black text-white italic">100+</p>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Servis</p>
               </div>
               <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center backdrop-blur-md">
                  <p className="text-2xl font-black text-white italic">24/7</p>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Destek</p>
               </div>
            </div>
        </section>
      </div>
    </div>
  );
};

export default GoogleAppsView;
