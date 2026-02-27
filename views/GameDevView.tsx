import React, { useState, useRef, useEffect } from 'react';

interface GameObject {
  id: string;
  type: 'player' | 'enemy' | 'item' | 'wall';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

const GameDevView: React.FC = () => {
  const [objects, setObjects] = useState<GameObject[]>([]);
  const [selectedTool, setSelectedTool] = useState<'player' | 'enemy' | 'wall' | 'item'>('player');
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || isPlaying) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newObj: GameObject = {
      id: Math.random().toString(),
      type: selectedTool,
      x,
      y,
      width: 40,
      height: 40,
      color: selectedTool === 'player' ? '#0d59f2' : selectedTool === 'enemy' ? '#ef4444' : selectedTool === 'wall' ? '#4b5563' : '#fbbf24'
    };
    setObjects([...objects, newObj]);
  };

  const gameLoop = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 800, 600);
    objects.forEach(obj => {
      ctx.fillStyle = obj.color;
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Arial';
      ctx.fillText(obj.type.toUpperCase(), obj.x + 5, obj.y + 20);
    });

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  };

  useEffect(() => {
    gameLoop();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [objects, isPlaying]);

  return (
    <div className="space-y-10 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Oyun Geliştirme</h2>
          <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">No-Code AI Oyun Tasarım Merkezi</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsPlaying(!isPlaying)} className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest transition-all ${isPlaying ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
            {isPlaying ? 'DURDUR' : 'BAŞLAT'}
          </button>
          <button onClick={() => setObjects([])} className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-black uppercase tracking-widest">TEMİZLE</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-surface/30">
            <h3 className="text-lg font-bold text-white mb-4">Objeler</h3>
            <div className="grid grid-cols-1 gap-2">
              <ToolItem active={selectedTool === 'player'} onClick={() => setSelectedTool('player')} label="Oyuncu" icon="🦸" color="bg-primary" />
              <ToolItem active={selectedTool === 'enemy'} onClick={() => setSelectedTool('enemy')} label="Düşman" icon="👾" color="bg-red-500" />
              <ToolItem active={selectedTool === 'wall'} onClick={() => setSelectedTool('wall')} label="Duvar" icon="🧱" color="bg-slate-600" />
              <ToolItem active={selectedTool === 'item'} onClick={() => setSelectedTool('item')} label="Eşya" icon="💎" color="bg-yellow-500" />
            </div>
          </div>
          <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-surface/30">
            <h3 className="text-lg font-bold text-white mb-2">Fizik Ayarları</h3>
            <p className="text-[10px] text-slate-500 uppercase font-black mb-4">Otonom Hesaplama Aktif</p>
            <div className="space-y-4">
              <RangeItem label="Yerçekimi" value={9.8} />
              <RangeItem label="Sürtünme" value={0.5} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="glass-panel p-4 rounded-[3rem] border border-white/5 bg-black/40 shadow-2xl overflow-hidden aspect-video">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              onClick={handleCanvasClick}
              className="w-full h-full bg-white/5 rounded-2xl cursor-crosshair"
            />
          </div>
          <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
             {/* List of objects */}
             {objects.map(obj => (
               <div key={obj.id} className="flex-shrink-0 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-bold text-slate-400">
                 {obj.type.toUpperCase()} ID: {obj.id.slice(0, 4)}
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolItem: React.FC<{active: boolean, onClick: () => void, label: string, icon: string, color: string}> = ({active, onClick, label, icon, color}) => (
  <button onClick={onClick} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${active ? 'bg-white/10 border-primary shadow-lg shadow-primary/10' : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100'}`}>
    <span className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center text-sm shadow-inner`}>{icon}</span>
    <span className="text-xs font-bold text-white">{label}</span>
  </button>
);

const RangeItem: React.FC<{label: string, value: number}> = ({label, value}) => (
  <div>
    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
      <div className="h-full bg-primary" style={{width: `${value * 10}%`}}></div>
    </div>
  </div>
);

export default GameDevView;
