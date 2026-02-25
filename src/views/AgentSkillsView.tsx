import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: string;
  url?: string;
  tags: string[];
}

const SKILLS_DATA: Skill[] = [
  // Resmi Beceriler
  {
    id: 'docx',
    name: 'Word Belge İşleyici',
    description: 'Değişiklikleri izleyerek Word belgeleri oluşturun, düzenleyin ve analiz edin.',
    category: 'Belge İşleme',
    provider: 'Anthropic',
    tags: ['DOCX', 'Resmi']
  },
  {
    id: 'xlsx',
    name: 'E-Tablo Uzmanı',
    description: 'Formüller, grafikler ve veri dönüşümleri ile e-tablo manipülasyonu.',
    category: 'Veri ve Analiz',
    provider: 'Anthropic',
    tags: ['XLSX', 'Veri']
  },
  {
    id: 'pptx',
    name: 'Sunum Sihirbazı',
    description: 'Slaytları, düzenleri ve şablonları okuyun, oluşturun ve ayarlayın.',
    category: 'Belge İşleme',
    provider: 'Anthropic',
    tags: ['PPTX', 'Sunum']
  },
  {
    id: 'pdf',
    name: 'PDF Analizörü',
    description: 'PDF\'lerden metin, tablo ve meta verileri ayıklayın.',
    category: 'Belge İşleme',
    provider: 'Anthropic',
    tags: ['PDF', 'OCR']
  },
  // Composio Becerileri
  {
    id: 'skill-creator',
    name: 'Beceri Oluşturucu',
    description: 'Claude için özelleştirilmiş iş akışları ve beceriler tasarlayın.',
    category: 'Geliştirme',
    provider: 'Composio',
    tags: ['Custom', 'Workflow']
  },
  {
    id: 'content-research-writer',
    name: 'İçerik Araştırma Yazarı',
    description: 'Derinlemesine araştırma yaparak profesyonel içerikler ve raporlar oluşturun.',
    category: 'Otomasyon',
    provider: 'Composio',
    tags: ['Research', 'Writing']
  },
  {
    id: 'lead-research-assistant',
    name: 'Müşteri Adayı Araştırmacısı',
    description: 'Satış ve pazarlama için potansiyel müşteri verilerini analiz edin ve toplayın.',
    category: 'Veri ve Analiz',
    provider: 'Composio',
    tags: ['B2B', 'Sales']
  },
  // Geliştirme Araçları
  {
    id: 'aws-skills',
    name: 'AWS Bulut Geliştirici',
    description: 'CDK en iyi uygulamaları ile AWS üzerinde uygulama geliştirme.',
    category: 'Geliştirme',
    provider: 'Topluluk',
    tags: ['AWS', 'Cloud', 'CDK']
  },
  {
    id: 'playwright-automation',
    name: 'Web Otomasyonu (Playwright)',
    description: 'Web uygulamalarını test etmek için tarayıcı otomasyonu.',
    category: 'Geliştirme',
    provider: 'Topluluk',
    tags: ['Testing', 'Automation']
  },
  {
    id: 'ios-simulator',
    name: 'iOS Simülatör Kontrolü',
    description: 'Test ve geliştirme için iOS simülatörü ile etkileşime girin.',
    category: 'Geliştirme',
    provider: 'Topluluk',
    tags: ['Mobile', 'iOS', 'Swift']
  },
  {
    id: 'swiftui-skills',
    name: 'SwiftUI Tasarım Rehberi',
    description: 'Apple tarafından yazılmış SwiftUI ve platform rehberliği.',
    category: 'Geliştirme',
    provider: 'Apple',
    tags: ['SwiftUI', 'Apple']
  },
  // Veri ve Analiz
  {
    id: 'csv-summarizer',
    name: 'CSV Özetleyici',
    description: 'CSV dosyalarını analiz edin ve görselleştirmelerle içgörüler oluşturun.',
    category: 'Veri ve Analiz',
    provider: 'Topluluk',
    tags: ['CSV', 'Data Science']
  },
  {
    id: 'kaggle-skill',
    name: 'Kaggle Entegrasyonu',
    description: 'Hesap kurulumundan yarışma raporlarına kadar tam Kaggle entegrasyonu.',
    category: 'Veri ve Analiz',
    provider: 'Topluluk',
    tags: ['Kaggle', 'Python']
  },
  // Entegrasyon ve Otomasyon
  {
    id: 'dev-browser',
    name: 'Geliştirici Tarayıcısı',
    description: 'Ajanlar için web tarama yeteneği sağlar.',
    category: 'Otomasyon',
    provider: 'Topluluk',
    tags: ['Web', 'Agent']
  },
  {
    id: 'spotify-skill',
    name: 'Spotify API Kontrolü',
    description: 'Spotify müzik kitaplığını yönetin ve çalma listeleri oluşturun.',
    category: 'Otomasyon',
    provider: 'Topluluk',
    tags: ['Music', 'API']
  },
  {
    id: 'commune',
    name: 'Commune E-posta Ajanı',
    description: 'Kalıcı adresli, semantik aramalı ve triyajlı ajan yerel e-posta kutusu.',
    category: 'Otomasyon',
    provider: 'Topluluk',
    tags: ['Email', 'AI Inbox']
  },
  // Güvenlik
  {
    id: 'threat-hunting',
    name: 'Tehdit Avcısı (Sigma)',
    description: 'Sigma algılama kurallarını kullanarak tehditleri avlayın.',
    category: 'Güvenlik',
    provider: 'Topluluk',
    tags: ['Security', 'Sigma']
  },
  {
    id: 'vincent-wallet',
    name: 'Vincent Kripto Cüzdanı',
    description: 'Ajan transferleri, takaslar ve işlemler için güvenli EVM cüzdanı.',
    category: 'Güvenlik',
    provider: 'Topluluk',
    tags: ['Crypto', 'Wallet', 'EVM']
  },
  // Araştırma
  {
    id: 'context-engineering',
    name: 'Bağlam Mühendisliği',
    description: 'İleri düzey bağlam (context) mühendisliği teknikleri.',
    category: 'Araştırma',
    provider: 'Topluluk',
    tags: ['Prompting', 'Context']
  },
  {
    id: 'mind-cloning',
    name: 'Zihin Klonlama',
    description: 'LLM becerileri ile dijital zihin klonlama teknikleri.',
    category: 'Araştırma',
    provider: 'Topluluk',
    tags: ['Future AI', 'Research']
  }
];

const AgentSkillsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Hepsi');
  const [installingId, setInstallingId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const categories = ['Hepsi', ...new Set(SKILLS_DATA.map(s => s.category))];

  const filteredSkills = SKILLS_DATA.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Hepsi' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const installSkill = (skill: Skill) => {
    setInstallingId(skill.id);
    setLogs([]);

    const messages = [
      `> Beceriyi kurma işlemi başlatılıyor: ${skill.name}`,
      `> Kaynaklar çekiliyor: ${skill.provider}/${skill.id}`,
      `> Metadata doğrulanıyor...`,
      `> Bağımlılıklar kontrol ediliyor...`,
      `> SKILL.md dosyası sisteme entegre ediliyor...`,
      `> Yerel yapılandırma güncelleniyor...`,
      `✔ Kurulum başarıyla tamamlandı: ${skill.name}`
    ];

    messages.forEach((msg, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, msg]);
        if (index === messages.length - 1) {
          // Register skill as dynamic module
          try {
            const activeModules = JSON.parse(localStorage.getItem('active_dynamic_modules') || '[]');
            if (!activeModules.some((m: any) => m.id === skill.id)) {
              activeModules.push({
                id: skill.id,
                label: skill.name,
                code: `// Skill Module: ${skill.name}\n// Provider: ${skill.provider}\n// Category: ${skill.category}\n\n${skill.description}`,
                icon: skill.category === 'Belge İşleme' ? 'fa-file-lines' :
                      skill.category === 'Veri ve Analiz' ? 'fa-chart-pie' :
                      skill.category === 'Geliştirme' ? 'fa-code' :
                      skill.category === 'Otomasyon' ? 'fa-robot' :
                      skill.category === 'Güvenlik' ? 'fa-shield-halved' : 'fa-flask',
                timestamp: Date.now()
              });
              localStorage.setItem('active_dynamic_modules', JSON.stringify(activeModules));
              // Trigger a storage event to update the sidebar if needed (though App.tsx handles it usually)
              window.dispatchEvent(new Event('storage'));
            }
          } catch (e) {
            console.error('Failed to register skill module', e);
          }

          setTimeout(() => setInstallingId(null), 2000);
        }
      }, (index + 1) * 600);
    });
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/30 shadow-lg shadow-primary/20">
            <i className="fa-solid fa-brain text-3xl"></i>
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white font-sans">
              YAPAY ZEKA <span className="text-primary">AJAN BECERİLERİ</span>
            </h1>
            <p className="text-slate-400 font-medium">Heilcheng/Awesome-Agent-Skills Koleksiyonu</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Beceri Ara</label>
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
              <input
                type="text"
                placeholder="Örn: Belge işleme, AWS, Veri..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                  selectedCategory === cat
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredSkills.map((skill) => (
            <motion.div
              layout
              key={skill.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-primary/50 transition-all group relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 right-0 p-3">
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-slate-800 text-slate-400 rounded-md">
                  {skill.provider}
                </span>
              </div>

              <div className="mb-4">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-4">
                  <i className={`fa-solid ${
                    skill.category === 'Belge İşleme' ? 'fa-file-lines' :
                    skill.category === 'Veri ve Analiz' ? 'fa-chart-pie' :
                    skill.category === 'Geliştirme' ? 'fa-code' :
                    skill.category === 'Otomasyon' ? 'fa-robot' :
                    skill.category === 'Güvenlik' ? 'fa-shield-halved' : 'fa-flask'
                  } text-xl`}></i>
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{skill.name}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-grow">{skill.description}</p>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-800/50 flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {skill.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">
                      #{tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => installSkill(skill)}
                  disabled={installingId !== null}
                  className="w-full py-3 bg-primary/10 border border-primary/30 text-primary rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                >
                  {installingId === skill.id ? 'Kuruluyor...' : 'Beceriyi Kur'}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Installation Terminal Overlay */}
      <AnimatePresence>
        {installingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 20, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#0d0d0d] border border-primary/30 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20"
            >
              <div className="bg-slate-900 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Terminal - Skills Installer</span>
              </div>
              <div className="p-8 font-mono text-sm space-y-2 min-h-[300px]">
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={log.startsWith('✔') ? 'text-green-500 font-bold' : 'text-slate-300'}
                  >
                    {log}
                  </motion.div>
                ))}
                <div className="w-2 h-5 bg-primary animate-pulse inline-block align-middle ml-1"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentSkillsView;
