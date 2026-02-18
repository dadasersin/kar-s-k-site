import { useState, useEffect, useRef } from 'react';

// --- Types ---
type Tool = {
  id: number;
  title: string;
  desc: string;
  category: string;
  color: string;
  img: string;
};

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
};

// --- Components ---

const HomeSection = () => (
  <section className="section-transition p-8 lg:p-12 relative animate-in fade-in duration-700" id="home">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full orb-glow -z-10"></div>
    <div className="max-w-6xl mx-auto pt-20">
      <header className="mb-16">
        <h2 className="text-primary font-bold tracking-[0.3em] uppercase mb-4">Sistem Operasyon Merkezi</h2>
        <h3 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
          Geleceği<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Yeniden Kurgula.</span>
        </h3>
        <div className="flex flex-wrap gap-8">
          <div className="bg-surface/50 backdrop-blur-md border border-white/5 p-6 rounded-custom w-40">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Durum</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              <p className="text-lg font-bold">Aktif</p>
            </div>
          </div>
          <div className="bg-surface/50 backdrop-blur-md border border-white/5 p-6 rounded-custom w-40">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Modüller</p>
            <p className="text-lg font-bold">12 Birim</p>
          </div>
          <div className="bg-surface/50 backdrop-blur-md border border-white/5 p-6 rounded-custom w-40">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Gecikme</p>
            <p className="text-lg font-bold text-primary">1.2ms</p>
          </div>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>}
          title="Hızlı Analiz"
          desc="Verilerinizi yapay zeka ile saniyeler içinde analiz edin."
        />
        <FeatureCard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>}
          title="Görsel Üretimi"
          desc="Hayallerinizi fotorealistik görsellere dönüştürün."
        />
        <FeatureCard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>}
          title="Ses Sentezi"
          desc="Metinleri profesyonel seslendirmelere çevirin."
        />
      </div>
    </div>
  </section>
);

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="group bg-surface hover:bg-white/5 border border-white/5 p-6 rounded-custom transition-all cursor-pointer">
    <div className="w-12 h-12 bg-primary/10 rounded-custom flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h4 className="font-bold mb-2">{title}</h4>
    <p className="text-sm text-gray-400">{desc}</p>
  </div>
);

const ToolsSection = () => {
  const [filter, setFilter] = useState('Hepsi');
  const tools: Tool[] = [
    {
      id: 1,
      title: "Neural Art Studio",
      desc: "Stable Diffusion tabanlı görsel üretici.",
      category: "Görsel",
      color: "bg-primary",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjLcL_x9ZzuolUwKSx9NaPV4ofzoxeZKN7xRZo3VKZhejgtQrVRIEvLa7e3BlZrFQzjT4rN03nfR6q3oht9eQGHMBkHC6Y8eLOLEejILpSTFUla1wzly9MktfvQTKCOAHYUupu8NVazOWa79q5E5OadIVZe4tA-dNMkV8Ms3G2lF_sjZUpoj1OHbnjUvJnE8x1f3HtFwlDlJYO7ar3kgDVxZkfa3Em_ULAwKhSKEzYUGqmMr1UkdYiLnfAOyETNGy-9uZWYy-PEOy3"
    },
    {
      id: 2,
      title: "Echo Voice Gen",
      desc: "Gerçekçi ses klonlama ve TTS aracı.",
      category: "Ses",
      color: "bg-indigo-500",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDu_sB1iEt3gK3al5JqBd7jOuYrz42qAOuClMv8BTAoVI6PwBpQWvvTw17cyxLAqdNTRmlFvt96B-sSGIJC7AUF5EYkol-Fc8HYChvxjhPd8dFdiUs2uie4Xkcp3FxQJe3wKFLV8Kglth0wUYnbCV-kmfhubRfvq65-amI3zdOyv6u7HcjTk6TgU2f3GX8jVbLwQnjDk-U5hs5st7k9kXwP814HT1N7vFfjf1X2JbfSm3c5HceC5cctbVfKD28Nr3Cc9daODWDSS3jt"
    },
    {
      id: 3,
      title: "LogicBot v4",
      desc: "Kodlama ve matematik odaklı LLM.",
      category: "Metin",
      color: "bg-teal-500",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsvAwOh8fOrEYp6HliL-LNHnil-3MoxTg7a3M-XoS7R1kCyxI95BLHnJwIDN0Tjbo7vKnJr8B0sEJPAV6HkfZEzRLt3I_JeuipHfl0rs-ZemcWW7LxKPRGnAifyRyNESqB8GO7lOmAkJmUBLdPToXPT7Ge0gRPv9Zqe6E6s4nwfeKclvlPRBMrX33W1veMJA-Jm70zNybQL_W7BzRshgFzUy0paStlBVV3uxWg62IiPfxVT9hu-Pp3PNKubaMj6HQjS7yohwaoJZx2"
    },
    {
      id: 4,
      title: "Motion Flow AI",
      desc: "Görsellerden sinematik videolar üretin.",
      category: "Video",
      color: "bg-pink-500",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPnQmvn6XWOQr0njkvt5XY-Lhi-Ko3KBpkAYL26Q4Wu8EbaOn1zTo0L149W5tzp4Rjd3-xpbKv8M6WmnFI2SvEGaTnfird0CfWizuKVkJ_MoudOnMFUTOaAurh6bMB-JdqcuMcBQTyj2MQSW2VbySfAF1PhkvC8E5ukG-uGRrGeIPvXnntX-XEVVtEI1yCZZkl0QoBzlzdu9j39S9QyHpIUM9z5qn0a-N6Q6dsyxY78MoEFRQSUW0lXv_tLAXqRA_wukGyVWfh262j"
    }
  ];

  const filteredTools = filter === 'Hepsi' ? tools : tools.filter(t => t.category === filter);

  return (
    <section className="section-transition p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500" id="tools">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">YZ Araç Kütüphanesi</h2>
            <p className="text-gray-400">Ersin Güleş tarafından küratörlüğü yapılmış özel araçlar.</p>
          </div>
          <div className="flex gap-2 bg-surface p-1 rounded-custom border border-white/5">
            {['Hepsi', 'Görsel', 'Ses', 'Metin'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-sm font-bold rounded-custom transition-all ${
                  filter === cat ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <div key={tool.id} className="bg-surface border border-white/5 rounded-custom overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="aspect-video bg-gray-800 relative overflow-hidden">
                <img src={tool.img} alt={tool.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <span className={`absolute top-3 left-3 px-2 py-1 ${tool.color} text-[10px] font-bold uppercase rounded-custom`}>{tool.category}</span>
              </div>
              <div className="p-5">
                <h5 className="font-bold mb-1">{tool.title}</h5>
                <p className="text-xs text-gray-400 mb-4">{tool.desc}</p>
                <button
                  onClick={() => alert(`${tool.title} modülü başlatılıyor...`)}
                  className="w-full py-2 bg-white/5 hover:bg-primary hover:text-white text-primary border border-primary/20 transition-colors text-xs font-bold rounded-custom uppercase"
                >
                  Başlat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CreativeSection = () => {
  const [focalLength, setFocalLength] = useState(50);
  const [exposure, setExposure] = useState(50);
  const [lighting, setLighting] = useState('Dramatik');
  const [renderProgress, setRenderProgress] = useState<number | null>(null);

  const lightingColors: Record<string, string> = {
    'Stüdyo': 'rgba(255, 255, 255, 0.4)',
    'Neon': 'rgba(236, 72, 153, 0.6)',
    'Güneşli': 'rgba(251, 191, 36, 0.5)',
    'Dramatik': 'rgba(13, 89, 242, 0.7)'
  };

  return (
    <section className="section-transition p-0 h-screen flex flex-col animate-in fade-in duration-500" id="creative">
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas/Preview Area */}
        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #333 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

          {/* Mock 3D Model with Dynamic Controls */}
          <div
            className="w-64 h-64 border-2 relative"
            style={{
              transformStyle: 'preserve-3d',
              animation: `spin ${11 - focalLength / 10}s linear infinite`,
              borderColor: lightingColors[lighting],
              filter: `brightness(${0.5 + exposure / 100})`,
              boxShadow: `0 0 ${exposure / 2}px ${lightingColors[lighting]}`
            }}
          >
            <div className="absolute inset-0 border border-current rotate-45 opacity-50"></div>
            <div className="absolute inset-0 border border-current -rotate-45 opacity-50"></div>
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full blur-md"
              style={{ backgroundColor: lightingColors[lighting].replace('0.7', '1').replace('0.6', '1').replace('0.5', '1').replace('0.4', '1') }}
            ></div>
          </div>

          <div className="absolute bottom-8 left-8 flex gap-4">
            <div className="bg-surface/80 backdrop-blur border border-white/10 p-4 rounded-custom">
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Durum</p>
              <p className="text-xs font-mono">Render: Hazır | Mod: {lighting}</p>
            </div>
            <div className="bg-surface/80 backdrop-blur border border-white/10 p-4 rounded-custom">
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Koordinatlar</p>
              <p className="text-xs font-mono">X: {focalLength}.45 | Y: -{exposure}.20 | Z: 0.00</p>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="w-80 bg-surface border-l border-white/5 p-6 flex flex-col gap-6 overflow-y-auto">
          <div>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              Kamera Ayarları
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold flex justify-between">
                  <span>Dönüş Hızı</span>
                  <span className="text-primary font-mono">{focalLength}</span>
                </label>
                <input
                  className="w-full accent-primary bg-white/5 rounded-lg appearance-none h-1 mt-2 cursor-pointer"
                  type="range"
                  min="1" max="100"
                  value={focalLength}
                  onChange={(e) => setFocalLength(parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold flex justify-between">
                  <span>Pozlama</span>
                  <span className="text-primary font-mono">{exposure}</span>
                </label>
                <input
                  className="w-full accent-primary bg-white/5 rounded-lg appearance-none h-1 mt-2 cursor-pointer"
                  type="range"
                  min="1" max="100"
                  value={exposure}
                  onChange={(e) => setExposure(parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
          <div className="h-px bg-white/5 w-full"></div>
          <div>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              Işıklandırma
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {['Stüdyo', 'Neon', 'Güneşli', 'Dramatik'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLighting(mode)}
                  className={`p-3 border rounded-custom text-xs font-bold transition-all ${
                    lighting === mode
                      ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(13,89,242,0.2)]'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-primary/50'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <div className="h-px bg-white/5 w-full"></div>
          <button
            onClick={() => {
            if (renderProgress !== null) return;
            setRenderProgress(0);
            const interval = setInterval(() => {
              setRenderProgress(prev => {
                if (prev === null) return 0;
                if (prev >= 100) {
                    clearInterval(interval);
                  setTimeout(() => setRenderProgress(null), 2000);
                  return 100;
                  }
                return prev + 5;
              });
            }, 100);
            }}
          disabled={renderProgress !== null}
          className="mt-auto w-full py-4 bg-primary text-white font-bold rounded-custom shadow-[0_0_20px_rgba(13,89,242,0.3)] hover:brightness-110 active:scale-95 transition-all uppercase disabled:opacity-50"
          >
          {renderProgress === null ? 'Sahneyi Render Et' : renderProgress === 100 ? 'TAMAMLANDI!' : `RENDER EDİLİYOR... %${renderProgress}`}
          </button>
        </div>
      </div>
    </section>
  );
};

const MusicSection = () => {
  const [playingId, setPlayingId] = useState<number | null>(null);

  const togglePlay = (id: number) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <section className="section-transition p-8 lg:p-12 animate-in fade-in duration-500" id="music">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Müzik Kitaplığı</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              onClick={() => togglePlay(i)}
              className={`bg-surface border p-4 rounded-custom flex items-center gap-4 group cursor-pointer transition-all ${
                playingId === i ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-white/5 hover:bg-white/5'
              }`}
            >
              <div className={`w-16 h-16 rounded-custom flex items-center justify-center transition-all ${
                playingId === i ? 'bg-primary text-white' : 'bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white'
              }`}>
                {playingId === i ? (
                   <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                ) : (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                )}
              </div>
              <div className="flex-1">
                <h4 className={`font-bold transition-colors ${playingId === i ? 'text-primary' : ''}`}>Nöral Frekanslar v{i}</h4>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">AI Generated • 3:45</p>
                  {playingId === i && (
                    <div className="flex gap-0.5 items-end h-3">
                      <div className="w-0.5 bg-primary animate-music-bar-1"></div>
                      <div className="w-0.5 bg-primary animate-music-bar-2"></div>
                      <div className="w-0.5 bg-primary animate-music-bar-3"></div>
                    </div>
                  )}
                </div>
              </div>
              <button className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const GallerySection = () => {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <section className="section-transition p-8 lg:p-12 animate-in fade-in duration-500" id="gallery">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Üretilen Sanat Galerisi</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              onClick={() => setSelectedImg(`https://picsum.photos/seed/${i + 20}/1200`)}
              className="aspect-square bg-surface border border-white/5 rounded-custom overflow-hidden group relative cursor-pointer"
            >
              <img src={`https://picsum.photos/seed/${i + 20}/400`} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <button className="bg-white text-brandDark p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all shadow-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal View */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 lg:p-12 animate-in fade-in duration-300"
          onClick={() => setSelectedImg(null)}
        >
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          </button>
          <img src={selectedImg} alt="Preview" className="max-w-full max-h-full rounded-custom shadow-2xl animate-in zoom-in-95 duration-300" />
        </div>
      )}
    </section>
  );
};

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Merhaba Ersin. Sana bugün nasıl yardımcı olabilirim?", sender: 'ai' }
  ]);
  const [inputText, setInputText] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatOpen]);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Simulated AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: getAIResponse(inputText),
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (input: string) => {
    const text = input.toLowerCase();
    if (text.includes('optimize')) return "Sistem kaynakları analiz ediliyor... CPU yükü %12 azaltıldı. Bellek yönetimi optimize edildi.";
    if (text.includes('selam') || text.includes('merhaba')) return "Tekrar merhaba Ersin. Portal üzerinden tüm sistemler aktif durumda.";
    if (text.includes('durum')) return "Tüm modüller yeşil. Gecikme süresi 1.2ms. Stabilite %99.9.";
    return "Anlaşıldı. Bu komut üzerine çalışıyorum.";
  };

  const startVoiceRecognition = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'tr-TR';

      recognition.onstart = () => {
        setIsListening(true);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Tarayıcınız ses tanımayı desteklemiyor.");
    }
  };

  const navLinks = [
    { id: 'home', label: 'Ana Sayfa', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
      </svg>
    )},
    { id: 'tools', label: 'YZ Araçları', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
      </svg>
    )},
    { id: 'creative', label: '3D Sahne', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
      </svg>
    )},
    { id: 'music', label: 'Müzik', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
      </svg>
    )},
    { id: 'gallery', label: 'Galeri', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
      </svg>
    )},
  ];

  return (
    <div className="bg-brandDark text-gray-100 font-sans selection:bg-primary/30 selection:text-white min-h-screen">
      <aside className="fixed left-0 top-0 h-screen w-20 lg:w-64 bg-surface border-r border-white/5 flex flex-col z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-custom flex items-center justify-center shadow-[0_0_20px_rgba(13,89,242,0.4)]">
            <span className="font-bold text-xl">EG</span>
          </div>
          <div className="hidden lg:block">
            <h1 className="font-bold text-sm tracking-tight">Ersin Güleş</h1>
            <p className="text-[10px] text-primary uppercase font-bold tracking-widest">Portal Sahibi</p>
          </div>
        </div>
        <nav className="flex-1 mt-8 px-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveSection(link.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-custom transition-all duration-300 ${
                activeSection === link.id
                  ? 'text-primary bg-primary/10 shadow-inner'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <div className={activeSection === link.id ? 'scale-110 transition-transform' : ''}>
                {link.icon}
              </div>
              <span className="hidden lg:block font-medium">{link.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="hidden lg:block bg-brandDark/50 p-3 rounded-custom border border-white/10 hover:border-primary/30 transition-colors cursor-pointer group" onClick={() => setIsMusicPlaying(!isMusicPlaying)}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isMusicPlaying ? 'bg-primary text-white shadow-[0_0_15px_rgba(13,89,242,0.4)]' : 'bg-primary/20 text-primary'}`}>
                {isMusicPlaying ? (
                  <div className="flex items-end gap-0.5 h-3">
                    <div className="w-0.5 bg-current animate-music-bar-1"></div>
                    <div className="w-0.5 bg-current animate-music-bar-2"></div>
                    <div className="w-0.5 bg-current animate-music-bar-3"></div>
                  </div>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path></svg>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Şimdi Çalıyor</p>
                <p className={`text-xs font-medium truncate ${isMusicPlaying ? 'text-primary' : ''}`}>Nöral Frekanslar v2</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-gray-400 group-hover:text-gray-300">
              <button className="hover:text-primary transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"></path></svg></button>
              <button className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                {isMusicPlaying ? (
                   <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" clipRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"></path></svg>
                ) : (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.333-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path></svg>
                )}
              </button>
              <button className="hover:text-primary transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11.555 14.832A1 1 0 0110 14V6a1 1 0 011.555-.832l6 4a1 1 0 010 1.664l-6 4z"></path></svg></button>
            </div>
          </div>
        </div>
      </aside>
      <main className="ml-20 lg:ml-64 min-h-screen relative overflow-x-hidden">
        {activeSection === 'home' && <HomeSection />}
        {activeSection === 'tools' && <ToolsSection />}
        {activeSection === 'creative' && <CreativeSection />}
        {activeSection === 'music' && <MusicSection />}
        {activeSection === 'gallery' && <GallerySection />}
      </main>

      {/* Quick Chat Widget */}
      <div className="fixed bottom-6 right-6 w-80 z-[60]" id="quick-chat">
        {/* Chat Toggle */}
        <button
          onClick={toggleChat}
          className={`ml-auto flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ${
            isChatOpen ? 'bg-surface text-primary rotate-90 border border-white/10' : 'bg-primary text-white hover:scale-110'
          }`}
        >
          {isChatOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
          )}
        </button>

        {/* Chat Window */}
        {isChatOpen && (
          <div className="absolute bottom-20 right-0 w-80 bg-surface border border-white/10 rounded-custom shadow-2xl flex flex-col overflow-hidden max-h-[500px] animate-in slide-in-from-bottom-8 fade-in duration-300">
            <div className="p-4 bg-primary/10 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-bold text-sm uppercase tracking-wider">Hızlı Sohbet</span>
              </div>
              <button onClick={toggleChat} className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </button>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-[300px] scrollbar-hide">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}
                >
                  <span className={`text-[10px] font-bold uppercase ${msg.sender === 'user' ? 'text-gray-500 mr-2' : 'text-primary ml-2'}`}>
                    {msg.sender === 'user' ? 'Sen' : 'Asistan'}
                  </span>
                  <div className={`p-3 rounded-custom text-sm max-w-[85%] shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {isListening && (
              <div className="px-4 py-2 flex items-center justify-center gap-1 bg-primary/5 border-t border-white/5">
                <span className="text-[10px] text-primary font-bold uppercase mr-2 animate-pulse">Dinleniyor...</span>
                <div className="flex items-center gap-0.5 h-4">
                  <div className="w-0.5 h-2 bg-primary animate-[bounce_1s_infinite_0s]"></div>
                  <div className="w-0.5 h-4 bg-primary animate-[bounce_1s_infinite_0.2s]"></div>
                  <div className="w-0.5 h-3 bg-primary animate-[bounce_1s_infinite_0.4s]"></div>
                  <div className="w-0.5 h-4 bg-primary animate-[bounce_1s_infinite_0.6s]"></div>
                  <div className="w-0.5 h-2 bg-primary animate-[bounce_1s_infinite_0.8s]"></div>
                </div>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-brandDark/20">
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-white/5 border border-white/10 rounded-custom px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600"
                  placeholder="Komut yazın..."
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button
                  type="button"
                  onClick={startVoiceRecognition}
                  className={`p-2 rounded-custom transition-all ${isListening ? 'bg-primary/20 text-primary scale-110 shadow-[0_0_10px_rgba(13,89,242,0.3)]' : 'bg-white/5 text-gray-500 hover:text-primary'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </button>
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-primary p-2 rounded-custom text-white disabled:opacity-50 disabled:grayscale transition-all active:scale-90"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
