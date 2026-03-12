import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Statik dosyaları (build edilmiş hali) sunar
app.use(express.static(path.join(__dirname, 'dist')));

// Render için kritik olan port tanımı
const PORT = process.env.PORT || 3000;

// Tüm istekleri index.html'e yönlendir (SPA desteği)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sunucu ${PORT} portunda başarıyla başlatıldı!`);
});
