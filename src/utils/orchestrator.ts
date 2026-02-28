export type Intent = 'BUILD' | 'WEATHER' | 'SEARCH_LEARN' | 'CHAT' | 'SKYDRIVE';

interface OrchestrationResult {
    intent: Intent;
    target?: string;
    payload?: any;
}

export const detectIntent = (text: string): OrchestrationResult => {
    const lowerText = text.toLowerCase();

    // 0. SkyDrive Intent
    if (
        lowerText.includes('skydrive') ||
        lowerText.includes('uçan araba') ||
        lowerText.includes('nexus') ||
        lowerText.includes('aerodinamik')
    ) {
        return { intent: 'SKYDRIVE', target: text };
    }

    // 1. Build Intent (Create/Add page)
    if (
        lowerText.includes('ekle') ||
        lowerText.includes('yap') ||
        lowerText.includes('oluştur') ||
        lowerText.includes('sayfası') ||
        lowerText.includes('create') ||
        lowerText.includes('add page')
    ) {
        if (!lowerText.includes('neyap') && !lowerText.includes('nasıl yapılır')) {
            return { intent: 'BUILD', target: text };
        }
    }

    // 2. Weather Intent
    if (
        lowerText.includes('hava durumu') ||
        lowerText.includes('weather') ||
        lowerText.includes('sicaklik') ||
        lowerText.includes('yağmur')
    ) {
        const cityMatch = text.match(/([A-Z][a-z]+)/); // Simple capitalized word match for city
        return {
            intent: 'WEATHER',
            target: cityMatch ? cityMatch[0] : 'Sakarya'
        };
    }

    // 3. Search & Learn Intent
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

    // 4. Default to Chat
    return { intent: 'CHAT' };
};
