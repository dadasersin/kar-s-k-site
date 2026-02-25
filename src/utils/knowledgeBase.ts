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
  } catch (e) {}

  // 2. Fetch Active Modules
  try {
    const modules = JSON.parse(localStorage.getItem('active_dynamic_modules') || '[]');
    sources.push(...modules.map((m: any) => ({
      id: m.id,
      name: m.label,
      type: 'tool' as const,
      content: m.code
    })));
  } catch (e) {}

  // 3. Add Hardcoded Knowledge Base Patterns
  sources.push({
    id: 'pattern-glassmorphism',
    name: 'Glassmorphism Style',
    type: 'config',
    content: 'bg-white/5 border border-white/10 backdrop-blur-md rounded-[2rem]'
  });

  return sources;
};

export const searchKnowledge = (query: string): string => {
  const all = getAggregatedKnowledge();
  const matches = all.filter(k =>
    k.name.toLowerCase().includes(query.toLowerCase()) ||
    k.content.toLowerCase().includes(query.toLowerCase())
  );

  if (matches.length === 0) return '';
  return `\n---\nKAYNAK VERİSİ (${matches[0].name}):\n${matches[0].content}\n---`;
};
