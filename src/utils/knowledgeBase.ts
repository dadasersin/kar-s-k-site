import { getStorageItem } from './storage';
import { searchPythonLibrary } from './pythonKnowledge';

export interface KnowledgeSource {
  id: string;
  name: string;
  type: 'prompt' | 'skill' | 'config' | 'tool' | 'python';
  content: string;
}

export const getAggregatedKnowledge = (): KnowledgeSource[] => {
  const sources: KnowledgeSource[] = [];

  // 1. Fetch Prompts
  try {
    const customPrompts = getStorageItem('prompt_library', []);
    sources.push(...customPrompts.map((p: any) => ({
      id: p.id,
      name: p.title,
      type: 'prompt' as const,
      content: p.text
    })));
  } catch (e) { }

  // 2. Fetch Active Modules
  try {
    const modules = getStorageItem('active_dynamic_modules', []);
    sources.push(...modules.map((m: any) => ({
      id: m.id,
      name: m.label,
      type: 'tool' as const,
      content: m.code
    })));
  } catch (e) { }

  // 3. System Patterns
  sources.push({
    id: 'pattern-glassmorphism',
    name: 'Glassmorphism Style',
    type: 'config',
    content: 'bg-white/5 border border-white/10 backdrop-blur-md rounded-[2rem]'
  });

  // 4. Global Architecture
  sources.push({
    id: 'system-inventory',
    name: 'Portal System Inventory',
    type: 'config',
    content: `Tech Stack: React, Vite, Tailwind CSS, Lucide Icons, Framer Motion. 
    Theme: Dark mode, glassmorphism, neon blue/indigo primaries.
    Capability: Autonomous coding, real-time data integration, local Python library reference.`
  });

  // 5. Learned Memory
  try {
    const memory = getStorageItem('neural_brain_memory', []);
    memory.forEach((m: any) => {
      sources.push({
        id: `learned-${m.id}`,
        name: `Learned: ${m.topic}`,
        type: 'skill',
        content: m.info
      });
    });
  } catch (e) { }

  return sources;
};

export const saveLearnedKnowledge = (topic: string, info: string) => {
  try {
    const memory = getStorageItem('neural_brain_memory', []);
    memory.push({ id: Date.now().toString(), topic, info, timestamp: Date.now() });
    localStorage.setItem('neural_brain_memory', JSON.stringify(memory.slice(-50)));
  } catch (e) { }
};

export const searchKnowledge = (query: string): string => {
  const all = getAggregatedKnowledge();

  // Search Python Library first if it looks like a coding request
  const pythonContext = searchPythonLibrary(query);

  const specificMatch = all.find(k =>
    k.name.toLowerCase().includes(query.toLowerCase()) ||
    (k.type === 'skill' && k.content.toLowerCase().includes(query.toLowerCase()))
  );

  const inventory = all.find(k => k.id === 'system-inventory');
  const glass = all.find(k => k.id === 'pattern-glassmorphism');

  let result = '\n---\nSİSTEM ALTYAPI BİLGİSİ:\n';
  if (inventory) result += inventory.content + '\n';
  if (glass) result += `Tasarım Kalıbı: ${glass.content}\n`;

  if (pythonContext) {
    result += `\nYEREL PYTHON KÜTÜPHANESİ REFERANSI (Bu kodları kullanabilirsin):\n${pythonContext}\n`;
  }

  if (specificMatch && specificMatch.id !== 'system-inventory') {
    result += `\nÖZEL EŞLEŞME (${specificMatch.name}):\n${specificMatch.content}\n`;
  }

  result += '---\n';
  return result;
};
