export interface ManualEntry {
  id: string;
  title: string;
  category: string;
  description: string;
  steps: string[];
  tips: string[];
}

export const MODULE_MANUALS: ManualEntry[] = [
  {
    id: 'home',
    title: 'Ana Sayfa (Home)',
    category: 'Sistem',
    description: 'Portalın merkezi kontrol noktasıdır. Sistem sağlığını ve aktif modülleri buradan izleyebilirsiniz.',
    steps: [
      'Sol menüden "Ana Sayfa" ikonuna tıklayın.',
      'Sistem Sağlığı ve Analiz panelinden metrikleri kontrol edin.',
      'Hızlı arama çubuğunu kullanarak Google araması yapın.'
    ],
    tips: ['Gecikme süresi 2ms üzerine çıkarsa "AG Başlatıcı" kullanarak bellek fix uygulayın.']
  },
  {
    id: 'borsa',
    title: 'Borsa Takibi',
    category: 'Finans',
    description: 'BIST ve global piyasaların canlı takibi ve analizi için kullanılan modül.',
    steps: [
      'Hisse senetlerini aratın ve portföyünüze ekleyin.',
      'Grafikleri teknik analiz araçlarıyla inceleyin.',
      'Piyasa derinliğini ve aracı kurum dağılımlarını görün.'
    ],
    tips: ['Favori listenizi Supabase üzerinden senkronize edebilirsiniz.']
  },
  {
    id: 'neural_logic',
    title: 'Neural Logic',
    category: 'YZ Servisleri',
    description: 'Sistemin bilişsel süreçlerini ve karar verme zincirlerini izlemenizi sağlar.',
    steps: [
      'Aktif akıl yürütme zincirlerini sol panelden seçin.',
      'Zihin haritası üzerinde her adımın nasıl işlendiğini görün.',
      'Öğrenilen verilerin hafızaya nasıl alındığını takip edin.'
    ],
    tips: ['Karar mekanizması multimodal veri analizi ile çalışır.']
  },
  {
    id: 'live_tv',
    title: 'Live TV / Medya',
    category: 'Medya',
    description: 'Dünya genelinden yüzlerce canlı TV kanalına erişim sağlar.',
    steps: [
      'Kategori listesinden (Haber, Spor, Sinema vb.) seçim yapın.',
      'Kanalların yanındaki kalite seçeneklerini kontrol edin.',
      'Akıllı Proxy ayarları ile donma sorunlarını giderin.'
    ],
    tips: ['Video.js tabanlı oynatıcı otomatik olarak en iyi akışı seçer.']
  },
  {
    id: 'weather',
    title: 'Hava Durumu',
    category: 'Sistem',
    description: 'Anlık konum tabanlı hava durumu ve gelecek tahmin raporları.',
    steps: [
      'Sistem konumunuzu otomatik algılayacaktır.',
      'Detaylı tahminler için "5 Günlük" sekmesine geçin.',
      'Sıcaklık ve nem gibi kritik metrikleri ana ekranda görün.'
    ],
    tips: ['OpenWeatherMap API üzerinden gerçek zamanlı veri çekilir.']
  },
  {
    id: 'chat',
    title: 'AI Sohbet (Chat)',
    category: 'YZ Servisleri',
    description: 'Tüm YZ modelleri (Gemini, Claude, OpenAI) ile tek bir arayüzden konuşun.',
    steps: [
      'Model seçim panelinden kullanmak istediğiniz YZ servisini seçin.',
      'Dosya eklemek için "+" butonunu kullanarak döküman analizi başlatın.',
      'Web araması özelliğini açarak en güncel internet verilerine erişin.'
    ],
    tips: ['Sistem Uzmanı personasını seçerek portal hakkında teknik destek alabilirsiniz.']
  },
  {
    id: 'live_developer',
    title: 'LİVE AI DEVELOPER',
    category: 'Geliştirici Araçları',
    description: 'Portal için otonom olarak yeni özellikler ve modüller inşa eden gelişmiş motor.',
    steps: [
      'Komut merkezine eklemek istediğiniz özelliği Türkçe olarak yazın.',
      '"Geliştirmeyi Başlat" butonuna tıklayarak AI\'nın veri çekmesini bekleyin.',
      'Üretilen görsel önizlemeyi ve kodu inceleyin.',
      '"SİTEYE EKLE VE YAYINLA" butonuna basarak yeni modülü kalıcı hale getirin.'
    ],
    tips: ['Yeni modül eklediğinizde sistem otomatik olarak GitHub yedeği oluşturur.']
  },
  {
    id: 'cursor_proxy',
    title: 'Cursor AG Proxy',
    category: 'Antigravity / Cursor',
    description: 'Google modellerini Cursor IDE içerisine entegre eden köprü.',
    steps: [
      '"PROXY BAŞLAT" butonuna basarak güvenli tüneli aktif edin.',
      'Ekranda beliren Cloudflare linkini kopyalayın.',
      'Cursor ayarlarında "OpenAI Base URL" kısmına bu linki yapıştırın.'
    ],
    tips: ['Session hatası alırsanız Google Cloud Code oturumunuzu kontrol edin.']
  }
];
