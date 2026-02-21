/**
 * Runtime Config Loader
 *
 * Render'daki env değişkenlerini /api/config endpoint'inden çeker.
 * Yerel geliştirmede import.meta.env'e geri döner.
 * main.tsx'de loadRemoteConfig() çağrıldıktan sonra tüm uygulama
 * getConfig(key) ile bu değerlere erişebilir.
 */

// In-memory config store
const runtimeConfig: Record<string, string> = {};

/**
 * Uygulamanın render edilmeden önce çağrılan başlatma fonksiyonu.
 * /api/config endpoint'ini çekerek keyleri belleğe alır.
 * Localhost'ta veya endpoint yoksa sessizce devam eder.
 */
export const loadRemoteConfig = async (): Promise<void> => {
    try {
        // Sadece production'da (Render) remote config çekmeye çalış
        const response = await fetch('/api/config', {
            signal: AbortSignal.timeout(3000), // 3 saniye timeout
        });
        if (response.ok) {
            const data: Record<string, string> = await response.json();
            Object.assign(runtimeConfig, data);
            console.log(`✅ Runtime config yüklendi: ${Object.keys(data).length} anahtar`);
        }
    } catch {
        // Yerel geliştirmede /api/config yoktur — sorun değil
        console.log('ℹ️ Runtime config endpoint bulunamadı, yerel mod aktif.');
    }
};

/**
 * Verilen VITE_ key için değer döner.
 * Önce runtime config'e bakar (Render), sonra import.meta.env'e (lokal).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const metaEnv = (import.meta as any).env as Record<string, string>;

export const getConfig = (key: string): string => {
    return runtimeConfig[key] || metaEnv[key] || '';
};

/**
 * Render ortamında en az bir API key var mı?
 */
export const hasAnyApiKey = (): boolean => {
    const keys = [
        'VITE_GEMINI_API_KEY',
        'VITE_OPENAI_API_KEY',
        'VITE_DEEPSEEK_API_KEY',
        'VITE_GROK_API_KEY',
    ];
    return keys.some(k => getConfig(k).length > 5);
};
