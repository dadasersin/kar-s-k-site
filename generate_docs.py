import os

modules = {
    "Home": "Portalın merkezi yönetim ve izleme paneli. Sistem sağlığı, aktif modüller ve hızlı arama özelliklerini içerir.",
    "Borsa": "BIST ve global piyasaların canlı takibi. Favori hisseler, teknik analiz grafikleri ve piyasa haberlerini sunar.",
    "Crypto": "Kripto para piyasalarının 7/24 takibi. Fiyat uyarıları, portföy yönetimi ve zincir üstü veri analizi.",
    "LiveAiDeveloper": "Yapay zeka destekli otonom uygulama geliştirme motoru. Yeni modüller tasarlar, kodlar ve sisteme entegre eder.",
    "LiveTv": "400'den fazla yerli ve yabancı kanalın canlı yayını. Akıllı proxy sistemi ile kesintisiz izleme deneyimi.",
    "NeuralLogic": "Sistemin karar verme süreçlerini ve akıl yürütme zincirlerini görselleştiren nöral izleme paneli.",
    "Audio": "Metinden sese (TTS), ses klonlama ve sesli asistan özelliklerini barındıran ses işleme merkezi.",
    "Visuals": "DALL-E, Midjourney ve Stable Diffusion modelleri ile profesyonel görsel üretimi ve düzenleme.",
    "AgentSkills": "AI ajanları için özelleştirilmiş beceri ve yetenek kütüphanesi. Cursor ve Windsurf için optimize edilmiştir.",
    "Antigravity": "Sistem optimizasyonu, bellek yönetimi ve WSL2 bağlantı sorunlarını çözen teknik araç seti.",
    "FigmaStudio": "Figma tasarımlarını anlık olarak analiz edip React koduna dönüştüren tasarım köprüsü.",
    "PromptMaster": "En iyi YZ sonuçları için hazırlanmış, kategorize edilmiş profesyonel prompt kütüphanesi.",
    "UserManual": "Portalın tüm özelliklerini adım adım açıklayan interaktif kullanım kılavuzu.",
    "Weather": "Konum bazlı canlı hava durumu takibi ve 5 günlük detaylı tahmin raporları.",
    "SkyDrive": "Geleceğin ulaşım araçları ve konsept tasarımların sergilendiği vizyoner galeri.",
    "GoogleAiStudio": "Google AI Studio'nun (Gemini) portal içerisine tam entegre edilmiş çalışma alanı."
}

os.makedirs("docs/modules", exist_ok=True)

for name, desc in modules.items():
    filename = f"docs/modules/{name}.md"
    content = f"""# {name} Modülü

## Nedir?
{desc}

## Nasıl Kullanılır?
1. Yan menüden **{name}** sekmesine tıklayın.
2. Modülün sunduğu araçları kullanarak işlemlerinizi gerçekleştirin.
3. Ayarlar kısmından modüle özel yapılandırmaları özelleştirin.

## Temel Özellikler
- **Hızlı Erişim**: Kullanıcı dostu arayüz.
- **AI Entegrasyonu**: Tüm süreçlerde yapay zeka desteği.
- **Canlı Veri**: Anlık güncelleme ve senkronizasyon.

---
*Ersin Güleş Portal - Sistem Dokümantasyonu*
"""
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)

print(f"{len(modules)} modül dokümanı başarıyla oluşturuldu.")
