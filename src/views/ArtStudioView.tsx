import React, { useState, useRef } from 'react';

interface Artwork {
  id: string;
  name: string;
  type: 'painting' | '3d' | 'nft' | 'digital';
  imageUrl: string;
  metadata: {
    created: Date;
    tools: string[];
    style: string;
    price?: number;
    blockchain?: string;
  };
}

interface DrawingTool {
  type: 'brush' | 'eraser' | 'shape' | 'text';
  size: number;
  color: string;
  opacity: number;
}

const ArtStudioView: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedTool, setSelectedTool] = useState<DrawingTool>({
    type: 'brush',
    size: 5,
    color: '#0d59f2',
    opacity: 1
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [artStyle, setArtStyle] = useState('realistic');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tools = [
    { type: 'brush', icon: '🖌️', label: 'Fırça' },
    { type: 'eraser', icon: '🧹', label: 'Silgi' },
    { type: 'shape', icon: '⭕', label: 'Şekil' },
    { type: 'text', icon: '📝', label: 'Metin' }
  ];

  const artStyles = ['Realistic', 'Abstract', 'Oil Painting', 'Digital Art', 'Cyberpunk'];
  const colors = ['#0d59f2', '#FF0000', '#00FF00', '#FFFF00', '#FFFFFF', '#000000'];

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.globalAlpha = selectedTool.opacity;
    ctx.strokeStyle = selectedTool.color;
    ctx.lineWidth = selectedTool.size;
    ctx.lineCap = 'round';
    if (selectedTool.type === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const generateAIArt = () => {
    if (!aiPrompt.trim()) return;
    const newArtwork: Artwork = {
      id: Date.now().toString(),
      name: `AI: ${aiPrompt}`,
      type: 'digital',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
      metadata: { created: new Date(), tools: ['AI Sentez'], style: artStyle }
    };
    setArtworks([...artworks, newArtwork]);
    setAiPrompt('');
  };

  return (
    <div className="space-y-10 pb-20">
      <header className="space-y-2">
        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Sanat Stüdyosu</h2>
        <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Dijital Tuval ve AI Sanat Üretimi</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-surface/30">
            <h3 className="text-lg font-bold text-white mb-4">Araçlar</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {tools.map(tool => (
                <button
                  key={tool.type}
                  onClick={() => setSelectedTool({ ...selectedTool, type: tool.type as any })}
                  className={`p-3 rounded-xl text-xs flex flex-col items-center gap-2 border transition-all ${
                    selectedTool.type === tool.type ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <span className="text-lg">{tool.icon}</span>
                  {tool.label}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block">Boyut</label>
                <input type="range" min="1" max="50" value={selectedTool.size} onChange={(e) => setSelectedTool({...selectedTool, size: parseInt(e.target.value)})} className="w-full accent-primary" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block">Renk</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map(c => (
                    <button key={c} onClick={() => setSelectedTool({...selectedTool, color: c})} className={`w-6 h-6 rounded-full border-2 ${selectedTool.color === c ? 'border-white' : 'border-transparent'}`} style={{backgroundColor: c}} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-surface/30">
            <h3 className="text-lg font-bold text-white mb-4">AI Üretimi</h3>
            <div className="space-y-4">
              <input type="text" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Bir şeyler hayal et..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm" />
              <select value={artStyle} onChange={(e) => setArtStyle(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm">
                {artStyles.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={generateAIArt} className="w-full py-3 bg-primary text-white font-black uppercase tracking-widest rounded-xl">ÜRET</button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="glass-panel p-4 rounded-[2.5rem] border border-white/5 bg-white shadow-2xl overflow-hidden">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={() => setIsDrawing(false)}
              onMouseLeave={() => setIsDrawing(false)}
              className="w-full h-auto cursor-crosshair rounded-2xl"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {artworks.map(art => (
              <div key={art.id} className="glass-panel p-2 rounded-2xl border border-white/5 overflow-hidden group">
                <img src={art.imageUrl} className="w-full h-32 object-cover rounded-xl mb-2" alt={art.name} />
                <div className="px-2 pb-2">
                  <p className="text-[10px] font-black text-primary uppercase">{art.metadata.style}</p>
                  <p className="text-xs font-bold text-white truncate">{art.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtStudioView;
