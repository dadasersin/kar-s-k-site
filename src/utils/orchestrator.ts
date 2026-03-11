export type Intent = 'BUILD' | 'WEATHER' | 'SEARCH_LEARN' | 'CHAT' | 'SKYDRIVE' | 'NEWS' | 'INTEGRATE_LINK';

interface OrchestrationResult {
    intent: Intent;
    target?: string;
    payload?: any;
}

export const detectIntent = (text: string): OrchestrationResult => {
    const lowerText = text.toLowerCase();

    // 0. Link Integration Intent
    const urlPattern = /(https?:\/\/[^\s]+)/i;
    const urlMatch = text.match(urlPattern);
    if (urlMatch && (lowerText.includes('entegre') || lowerText.includes('ekle') || lowerText.includes('bağla') || lowerText.includes('link'))) {
        return {
            intent: 'INTEGRATE_LINK',
            target: urlMatch[0],
            payload: { originalText: text }
        };
    }

    // 1. News Intent
    if (lowerText.includes('haber') || lowerText.includes('gündem') || lowerText.includes('news')) {
        return { intent: 'NEWS', target: text };
    }

    // 2. SkyDrive Intent
    if (
        lowerText.includes('skydrive') ||
        lowerText.includes('uçan araba') ||
        lowerText.includes('nexus') ||
        lowerText.includes('aerodinamik')
    ) {
        return { intent: 'SKYDRIVE', target: text };
    }

    // 3. Build Intent (Create/Add page/module)
    if (
        lowerText.includes('ekle') ||
        lowerText.includes('yap') ||
        lowerText.includes('oluştur') ||
        lowerText.includes('hazırla') ||
        lowerText.includes('sayfası') ||
        lowerText.includes('modülü') ||
        lowerText.includes('create') ||
        lowerText.includes('add page') ||
        lowerText.includes('build')
    ) {
        if (!lowerText.includes('neyap') && !lowerText.includes('nasıl yapılır') && !lowerText.includes('neler yapabilirsin')) {
            const buildMatch = text.match(/(?:bana\s+)?(.+?)\s+(?:hazırla|yap|oluştur|ekle)/i);
            return {
                intent: 'BUILD',
                target: buildMatch ? buildMatch[1].trim() : text
            };
        }
    }

    // 4. Weather Intent
    if (
        lowerText.includes('hava durumu') ||
        lowerText.includes('weather') ||
        lowerText.includes('sicaklik') ||
        lowerText.includes('yağmur')
    ) {
        const cityMatch = text.match(/([A-Z][a-z]+)/);
        return {
            intent: 'WEATHER',
            target: cityMatch ? cityMatch[0] : 'Sakarya'
        };
    }

    // 5. Search & Learn Intent
    if (
        lowerText.includes('araştır') ||
        lowerText.includes('öğren') ||
        lowerText.includes('kaydet') ||
        lowerText.includes('hafızana al') ||
        lowerText.includes('search') ||
        lowerText.includes('learn about')
    ) {
        return { intent: 'SEARCH_LEARN', target: text };
    }

    // 6. Default to Chat
    return { intent: 'CHAT' };
};
