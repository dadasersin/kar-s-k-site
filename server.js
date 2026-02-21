import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// CORS for local dev
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// ──────────────────────────────────────────────
// /api/config → Render env vars'ı runtime'da döner
// Sadece VITE_ ile başlayan değişkenleri paylaşır
// ──────────────────────────────────────────────
app.get('/api/config', (req, res) => {
    const config = {};
    const allowedKeys = [
        'VITE_GEMINI_API_KEY',
        'VITE_OPENAI_API_KEY',
        'VITE_DEEPSEEK_API_KEY',
        'VITE_GROK_API_KEY',
        'VITE_SUPABASE_URL',
        'VITE_SUPABASE_ANON_KEY',
    ];

    allowedKeys.forEach(key => {
        if (process.env[key]) {
            config[key] = process.env[key];
        }
    });

    res.json(config);
});

// ──────────────────────────────────────────────
// Vite build çıktısını serve et
// ──────────────────────────────────────────────
const distPath = join(__dirname, 'dist');
app.use(express.static(distPath));

// SPA fallback — tüm route'ları index.html'e yönlendir
app.get('*', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Sunucu çalışıyor: http://localhost:${PORT}`);
    console.log(`🔑 Config endpoint: http://localhost:${PORT}/api/config`);
});
