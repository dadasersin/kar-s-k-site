import React, { useState } from 'react';
import type { PromptEntry } from '../types';

const PromptLibraryView: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'image' | 'text' | 'code' | 'music'>('all');
  const [prompts] = useState<PromptEntry[]>([
    { id: '1', title: 'Cyberpunk City', category: 'image', text: 'Highly detailed cyberpunk city street, neon signs, rainy night, cinematic lighting, 8k' },
    { id: '2', title: 'React Hook Debugger', category: 'code', text: 'Act as a senior React developer. Analyze this code for potential memory leaks in useEffect...' },
    { id: '3', title: 'Lofi Beat Maker', category: 'music', text: 'Create a relaxing lofi hip hop track with soft piano melodies and vinyl crackle sounds' },
    { id: '4', title: 'Creative Storyteller', category: 'text', text: 'Write a short sci-fi story about a robot discovering a forgotten garden on a desert planet' },
  ]);

  const filtered = filter === 'all' ? prompts : prompts.filter(p => p.category === filter);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Prompt kopyalandı!');
  };

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Prompt Kütüphanesi</h1>
            <p className="text-slate-400 text-sm mt-1">En iyi sonuç veren komutları keşfedin ve kullanın.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'image', 'text', 'code', 'music'].map(cat => (
              <button
                key={cat}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={() => setFilter(cat as any)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-primary text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
              >
                {cat === 'all' ? 'Hepsi' : cat.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <div key={p.id} className="glass-panel p-6 rounded-[2rem] flex flex-col gap-4 group hover:border-primary/50 transition-all">
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/20">{p.category}</span>
                <button onClick={() => copyToClipboard(p.text)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-primary transition-colors">
                  <i className="fa-solid fa-copy text-xs"></i>
                </button>
              </div>
              <h3 className="text-lg font-bold text-white italic">{p.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{p.text}</p>
              <button
                onClick={() => copyToClipboard(p.text)}
                className="mt-auto w-full py-3 bg-white/5 hover:bg-primary text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Promptu Kullan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptLibraryView;
