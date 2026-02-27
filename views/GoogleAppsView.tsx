import React, { useState } from 'react';

interface GoogleApp {
  name: string;
  category: string;
  icon: string;
  color: string;
  desc: string;
  url: string;
}

const GoogleAppsView: React.FC = () => {
  const [filter, setFilter] = useState('Hepsi');
  const [searchQuery, setSearchQuery] = useState('');

  const apps: GoogleApp[] = [
    { name: 'Google Arama', category: 'Araçlar', icon: 'fa-magnifying-glass', color: 'text-blue-500', desc: 'Dünyadaki bilgilere en hızlı erişim yolu.', url: 'https://www.google.com' },
    { name: 'YouTube', category: 'Eğlence', icon: 'fa-youtube', color: 'text-red-500', desc: 'Milyonlarca video, müzik ve içerik dünyası.', url: 'https://www.youtube.com' },
    { name: 'Google Haritalar', category: 'Navigasyon', icon: 'fa-map-location-dot', color: 'text-green-500', desc: 'Dünyayı keşfedin ve yolunuzu kolayca bulun.', url: 'https://maps.google.com' },
    { name: 'Gmail', category: 'İletişim', icon: 'fa-envelope', color: 'text-red-400', desc: 'Hızlı, güvenli ve akıllı e-posta hizmeti.', url: 'https://mail.google.com' },
    { name: 'Google Drive', category: 'Üretkenlik', icon: 'fa-hard-drive', color: 'text-blue-400', desc: 'Tüm dosyalarınız her zaman yanınızda.', url: 'https://drive.google.com' },
    { name: 'Google Fotoğraflar', category: 'Eğlence', icon: 'fa-image', color: 'text-blue-600', desc: 'Anılarınızı yedekleyin ve kolayca organize edin.', url: 'https://photos.google.com' },
    { name: 'Google Dokümanlar', category: 'Üretkenlik', icon: 'fa-file-lines', color: 'text-blue-500', desc: 'Çevrimiçi dökümanlar oluşturun ve düzenleyin.', url: 'https://docs.google.com' },
    { name: 'Google E-Tablolar', category: 'Üretkenlik', icon: 'fa-file-excel', color: 'text-green-600', desc: 'Verilerinizi akıllı tablolarla yönetin.', url: 'https://sheets.google.com' },
    { name: 'Google Slaytlar', category: 'Üretkenlik', icon: 'fa-file-powerpoint', color: 'text-yellow-500', desc: 'Etkileyici sunumlar hazırlayın.', url: 'https://slides.google.com' },
    { name: 'Google Meet', category: 'İletişim', icon: 'fa-video', color: 'text-blue-500', desc: 'Güvenli görüntülü toplantılar yapın.', url: 'https://meet.google.com' },
    { name: 'Google Takvim', category: 'Üretkenlik', icon: 'fa-calendar-days', color: 'text-blue-400', desc: 'Zamanınızı verimli bir şekilde planlayın.', url: 'https://calendar.google.com' },
    { name: 'Google Keep', category: 'Üretkenlik', icon: 'fa-note-sticky', color: 'text-yellow-600', desc: 'Hızlı notlar alın ve hatırlatıcılar kurun.', url: 'https://keep.google.com' },
    { name: 'Google Çeviri', category: 'Araçlar', icon: 'fa-language', color: 'text-blue-500', desc: 'Diller arası engelleri anında kaldırın.', url: 'https://translate.google.com' },
    { name: 'Google Lens', category: 'Araçlar', icon: 'fa-camera-retro', color: 'text-blue-400', desc: 'Gördüğünüz her şeyi yapay zeka ile arayın.', url: 'https://lens.google.com' },
    { name: 'Google Earth', category: 'Eğlence', icon: 'fa-earth-americas', color: 'text-blue-500', desc: 'Dünyayı 3D olarak uydudan keşfedin.', url: 'https://earth.google.com' },
    { name: 'Google Chrome', category: 'Araçlar', icon: 'fa-chrome', color: 'text-blue-500', desc: 'Hızlı ve güvenli web tarayıcısı.', url: 'https://www.google.com/chrome/' },
    { name: 'Google Play', category: 'Eğlence', icon: 'fa-play', color: 'text-blue-400', desc: 'Milyonlarca uygulama, oyun ve içerik.', url: 'https://play.google.com' },
    { name: 'Google News', category: 'Eğlence', icon: 'fa-newspaper', color: 'text-blue-500', desc: 'Size özel seçilmiş güncel haberler.', url: 'https://news.google.com' },
    { name: 'Google Chat', category: 'İletişim', icon: 'fa-comments', color: 'text-green-500', desc: 'Ekibinizle anlık olarak mesajlaşın.', url: 'https://chat.google.com' },
    { name: 'Google Tasks', category: 'Üretkenlik', icon: 'fa-list-check', color: 'text-blue-500', desc: 'Yapılacak işlerinizi takip edin.', url: 'https://tasks.google.com' },
    { name: 'Gemini (AI)', category: 'Yapay Zeka', icon: 'fa-wand-magic-sparkles', color: 'text-purple-500', desc: 'Google\'ın en gelişmiş yapay zekası.', url: 'https://gemini.google.com' },
    { name: 'Google Cloud', category: 'İş', icon: 'fa-cloud', color: 'text-blue-400', desc: 'Bulut bilişim ve uygulama geliştirme.', url: 'https://console.cloud.google.com' },
    { name: 'Google Ads', category: 'İş', icon: 'fa-rectangle-ad', color: 'text-blue-500', desc: 'İşletmenizi Google üzerinden büyütün.', url: 'https://ads.google.com' },
    { name: 'Google Analytics', category: 'İş', icon: 'fa-chart-simple', color: 'text-yellow-600', desc: 'Web sitesi ve uygulama verilerinizi analiz edin.', url: 'https://analytics.google.com' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
    }
  };

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
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Google'ın tüm araçları aktif kullanımda</p>
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

        {/* Global Google Search Bar */}
        <section className="glass-panel p-6 rounded-[2.5rem] bg-white/5 border border-white/10 shadow-2xl">
           <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                 <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"></i>
                 <input
                   type="text"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Google'da aktif arama yapın..."
                   className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-white outline-none focus:border-primary transition-all"
                 />
              </div>
              <button type="submit" className="px-8 bg-primary hover:brightness-110 text-white font-black uppercase tracking-widest rounded-2xl transition-all text-[10px]">
                ARA
              </button>
           </form>
        </section>

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
              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto pt-4 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0"
              >
                 <span className="text-[10px] font-black uppercase tracking-widest">Uygulamayı Aç</span>
                 <i className="fa-solid fa-arrow-up-right-from-square text-[8px]"></i>
              </a>
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
               <button
                onClick={() => window.open('https://console.cloud.google.com', '_blank')}
                className="mt-8 px-10 py-4 bg-primary hover:brightness-110 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all text-xs"
               >
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
