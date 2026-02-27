
export interface ModuleCapability {
  id: string;
  name: string;
  category: string;
  dataKey?: string; // localStorage key used
  methods?: string[]; // simulated methods or logic blocks
  description: string;
}

export const PORTAL_MODULE_REGISTRY: ModuleCapability[] = [
  {
    id: 'borsa',
    name: 'İstanbul Borsa',
    category: 'Finans',
    dataKey: 'bist_favorites',
    methods: ['fetchStockData', 'calculatePortfolioValue'],
    description: 'Anlık hisse senedi verileri ve portföy yönetimi sağlar.'
  },
  {
    id: 'crypto',
    name: 'Kripto Bot',
    category: 'Finans',
    dataKey: 'crypto_watchlist',
    methods: ['getCryptoPrice', 'analyzeMarketTrend'],
    description: 'Kripto para piyasası verilerini çeker ve teknik analiz yapar.'
  },
  {
    id: 'live_tv',
    name: 'Canlı TV',
    category: 'Medya',
    dataKey: 'tv_favorites',
    methods: ['getChannelStream', 'searchChannels'],
    description: 'IPTV ve YouTube üzerinden canlı yayın akışı sağlar.'
  },
  {
    id: 'chat',
    name: 'AI Sohbet',
    category: 'YZ',
    dataKey: 'chat_history',
    methods: ['sendMessage', 'getHistory', 'switchModel'],
    description: 'Çoklu model desteğiyle (Gemini, OpenAI, Claude) metin tabanlı etkileşim sağlar.'
  },
  {
    id: 'visuals',
    name: 'Görsel Stüdyo',
    category: 'YZ',
    dataKey: 'visual_assets',
    methods: ['generateImage', 'generateVideo', 'remixAsset'],
    description: 'Yapay zeka ile görsel ve video içerik üretimi yapar.'
  },
  {
    id: 'analytics',
    name: 'Analitik & Maliyet',
    category: 'Sistem',
    dataKey: 'api_usage_logs',
    methods: ['calculateCosts', 'getUsageMetrics'],
    description: 'API kullanım kotalarını ve maliyet analizlerini takip eder.'
  },
  {
    id: 'site_edit',
    name: 'Site Düzenleme',
    category: 'Sistem',
    dataKey: 'active_dynamic_modules',
    methods: ['registerModule', 'deleteModule', 'updateTitle'],
    description: 'Portalın dinamik yapısını ve modül kaydını yönetir.'
  },
  {
    id: 'ag_sync',
    name: 'AG Senkronize',
    category: 'Yedekleme',
    dataKey: 'sync_settings',
    methods: ['pushToCloud', 'pullFromCloud', 'verifyIntegrity'],
    description: 'Google Drive ve GitHub üzerinden veri senkronizasyonu yapar.'
  }
];

export const getRegistryKnowledge = (): string => {
  return PORTAL_MODULE_REGISTRY.map(m =>
    `MODÜL: ${m.name} (${m.id})\n- Kategori: ${m.category}\n- Veri Anahtarı: ${m.dataKey || 'N/A'}\n- Yetenekler: ${m.methods?.join(', ') || 'N/A'}\n- Açıklama: ${m.description}`
  ).join('\n\n');
};
