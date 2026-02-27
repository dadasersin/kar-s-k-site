export interface KnowledgeSource {
  id: string;
  name: string;
  type: 'prompt' | 'skill' | 'config' | 'tool';
  content: string;
}

export const getAggregatedKnowledge = (): KnowledgeSource[] => {
  const sources: KnowledgeSource[] = [];

  // 1. Fetch Prompts from localStorage/Presets
  try {
    const customPrompts = JSON.parse(localStorage.getItem('prompt_library') || '[]');
    sources.push(...customPrompts.map((p: any) => ({
      id: p.id,
      name: p.title,
      type: 'prompt' as const,
      content: p.text
    })));
  } catch (e) { }

  // 2. Fetch Active Modules
  try {
    const modules = JSON.parse(localStorage.getItem('active_dynamic_modules') || '[]');
    sources.push(...modules.map((m: any) => ({
      id: m.id,
      name: m.label,
      type: 'tool' as const,
      content: m.code
    })));
  } catch (e) { }

  // 3. Add Hardcoded Knowledge Base Patterns
  sources.push({
    id: 'pattern-glassmorphism',
    name: 'Glassmorphism Style',
    type: 'config',
    content: 'bg-white/5 border border-white/10 backdrop-blur-md rounded-[2rem]'
  });

  sources.push({
    id: 'pattern-weather-display',
    name: 'Weather Analytics Display',
    type: 'skill',
    content: 'Modern glassmorphic weather UI with neon highlights. Uses Lucide icons (Cloud, Sun, Wind, Thermometer). Includes temperature display, 5-day forecast grid, and atmospheric statistics section. Responsive layout for portal integration.'
  });

  // 4. Global System Architecture & Capabilities
  sources.push({
    id: 'system-inventory',
    name: 'Portal System Inventory',
    type: 'config',
    content: `Tech Stack: React, Vite, Tailwind CSS, Lucide Icons, Framer Motion. 
    Available Views (AppView): Home, Tools, Creative, Dashboard, Chat, Visuals, Audio, Live, Music, Gallery, Builder, Workflow, Crypto, Requests, System, Automation, Prompts, Analytics, Google Apps, Docker AI, Settings, Jules Studio, Art Studio, Game Dev, Security, Integrations, Social Media, Borsa, Youtube, Live TV, System Expert, Ruwis AI, Antigravity, Figma Studio, Agent Skills, Prompt Master, Quotio, AG Toolkit, Dev Tools, Coder Config, Agentic Config, Transparent PNG, SkillShare, Seline, AG2API, Cursor Bridge, Khoata Tool, Codex Switcher, AG Copilot, AG Usage Checker, Prompt Expert, Cursor Proxy, AG Sync, AG Launcher, User Manual, Site Edit, Jules Awesome, Android NDK, Weather.
    Theme: Dark mode, glassmorphism, neon blue/indigo primaries, futuristic aesthetic.`
  });

  sources.push({
    id: 'pattern-omniview-orchestration',
    name: 'OmniView Universal Hub',
    type: 'skill',
    content: 'Central command center that aggregates all system modules. Features category-based filtering, universal search, and high-end visual orchestration. Acts as the primary entry point for all portal functionalities, providing a unified and cohesive user experience.'
  });

  // Learned Memory Source
  try {
    const memory = JSON.parse(localStorage.getItem('neural_brain_memory') || '[]');
    memory.forEach((m: any) => {
      sources.push({
        id: `learned-${m.id}`,
        name: `Learned: ${m.topic}`,
        type: 'skill',
        content: m.info
      });
    });
  } catch (e) {
    console.error("Failed to load learned memory", e);
  }

  return sources;
};

export const saveLearnedKnowledge = (topic: string, info: string) => {
  try {
    const memory = JSON.parse(localStorage.getItem('neural_brain_memory') || '[]');
    memory.push({
      id: Date.now().toString(),
      topic,
      info,
      timestamp: Date.now()
    });
    localStorage.setItem('neural_brain_memory', JSON.stringify(memory.slice(-50))); // Keep last 50 learnings
  } catch (e) {
    console.error("Failed to save learned knowledge", e);
  }
};

export const getQuickWeather = (city: string) => {
  // Mock forecast for the "Neural Brain" to use
  const conditions = ['Güneşli', 'Bulutlu', 'Hafif Yağmurlu', 'Parçalı Bulutlu'];
  const temp = Math.floor(Math.random() * (25 - 10) + 10);
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  return `${city} için güncel durum: ${temp}°C, ${condition}.`;
};

export const searchKnowledge = (query: string): string => {
  const all = getAggregatedKnowledge();

  // Try specific search first
  const specificMatch = all.find(k =>
    k.name.toLowerCase().includes(query.toLowerCase()) ||
    (k.type === 'skill' && k.content.toLowerCase().includes(query.toLowerCase()))
  );

  const inventory = all.find(k => k.id === 'system-inventory');
  const glass = all.find(k => k.id === 'pattern-glassmorphism');

  let result = '\n---\nSİSTEM ALTYAPI BİLGİSİ:\n';
  if (inventory) result += inventory.content + '\n';
  if (glass) result += `Tasarım Kalıbı: ${glass.content}\n`;

  if (specificMatch && specificMatch.id !== 'system-inventory') {
    result += `\nÖZEL EŞLEŞME (${specificMatch.name}):\n${specificMatch.content}\n`;
  }

  result += '---\n';
  return result;
};
