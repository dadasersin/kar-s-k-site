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
      'Stat kartlarından (Gecikme, Aktif Modüller) sistemin güncel durumunu kontrol edin.',
      'Hızlı erişim kartlarını kullanarak en çok kullandığınız araçlara saniyeler içinde ulaşın.'
    ],
    tips: ['Gecikme süresi 2ms üzerine çıkarsa "AG Başlatıcı" kullanarak bellek fix uygulayın.']
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
      '"Geliştirmeyi Başlat" butonuna tıklayarak AI\'nın tüm entegre repolardan veri çekmesini bekleyin.',
      'Üretilen görsel önizlemeyi ve kodu inceleyin.',
      '"SİTEYE EKLE VE YAYINLA" butonuna basarak yeni modülü kalıcı olarak sol menüye ekleyin.'
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
      'Ekranda beliren "https://...trycloudflare.com" linkini kopyalayın.',
      'Cursor ayarlarında "OpenAI Base URL" kısmına bu linki yapıştırın.'
    ],
    tips: ['Session hatası alırsanız VS Code üzerinden Google Cloud Code oturumunuzu kontrol edin.']
  },
  {
    id: 'figma_studio',
    title: 'Figma Stüdyo',
    category: 'Tasarım',
    description: 'MCP protokolü üzerinden Figma tasarımlarını analiz edip kod üreten stüdyo.',
    steps: [
      'Figma dosya linkini veya MCP Socket kanal ID\'nizi ilgili alana girin.',
      '"BAĞLANTIYI BAŞLAT" butonuna basarak tasarım verilerini çekin.',
      '"AKILLI ANALİZ" butonuna basarak tasarım hatalarını ve kod önerilerini görün.'
    ],
    tips: ['"Kod Çıktısı" butonunu kullanarak tasarımı doğrudan React bileşenine dönüştürebilirsiniz.']
  },
  {
    id: 'seline',
    title: 'Seline Asistan',
    category: 'Gizlilik',
    description: 'Gizlilik odaklı, yerel verilerinizi vektör veritabanında saklayan özel asistan.',
    steps: [
      'Yerel klasörlerinizi "Klasör Senk" butonu ile Seline\'e tanıtın.',
      'Vektör veritabanı taraması bittiğinde sorularınızı sorun.',
      'Mesajlaşma kanallarını (WhatsApp/Slack) bağlayarak asistanı 7/24 aktif tutun.'
    ],
    tips: ['Tüm veriler sadece yerel sisteminizde tutulur, buluta gönderilmez.']
  },
  {
    id: 'jules_awesome',
    title: 'Jules Awesome List',
    category: 'Geliştirici Araçları',
    description: 'Google Labs Jules Agent için küratörlüğü yapılmış en iyi prompt koleksiyonu.',
    steps: [
      'Sol menüden "Jules Awesome" sekmesine geçin.',
      'Kategoriler arasından (Hata Ayıklama, Dokümantasyon, vb.) ihtiyacınız olanı seçin.',
      'İstediğiniz promptun yanındaki "Kopyala" ikonuna basarak panonuza alın.',
      'Jules Agent veya herhangi bir LLM üzerinde bu promptu kullanın.'
    ],
    tips: ['Her prompt modern yazılım prensiplerine (SOLID, Design Patterns) uygun olarak optimize edilmiştir.']
  },
  {
    id: 'ag_sync',
    title: 'AG Senkronize',
    category: 'Yedekleme',
    description: 'Projelerinizi anlık olarak Google Drive ile yedekleyen otomasyon aracı.',
    steps: [
      'Yedeklenecek yerel proje klasörünü ayarlardan seçin.',
      '"ŞİMDİ YEDEKLE" butonuna basarak sıkıştırılmış yedeği buluta gönderin.',
      'Hata durumunda "TEMİZLEME SİHİRBAZI"nı kullanın.'
    ],
    tips: ['Planlı yedekleme özelliğini açarak her gün otomatik yedek alabilirsiniz.']
  }
  // Diğer 40+ modül için veriler eklenecek...
];
