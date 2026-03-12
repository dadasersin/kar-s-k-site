import React, { useState } from 'react';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { getAvailableKeys, recordUsage, markKeyAsExhausted } from '../utils/apiPool';
import { recordAction } from '../utils/history';

const WorkflowView: React.FC = () => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [nodes, setNodes] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsProcessing(true);
    recordAction('İş Akışı', `Yeni akış tasarlanıyor: ${aiPrompt}`);

    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        nodes: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              id: { type: SchemaType.STRING },
              name: { type: SchemaType.STRING },
              type: { type: SchemaType.STRING },
              position: { type: SchemaType.ARRAY, items: { type: SchemaType.NUMBER } }
            }
          }
        },
        links: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              fromNode: { type: SchemaType.STRING },
              toNode: { type: SchemaType.STRING }
            }
          }
        }
      }
    };

    const availableKeys = getAvailableKeys('gemini');
    let success = false;
    for (const keyEntry of availableKeys) {
      const modelsToTry = [keyEntry.modelName || "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
      for (const modelId of modelsToTry) {
        try {
          const genAI = new GoogleGenerativeAI(keyEntry.key);
          const model = genAI.getGenerativeModel({
            model: modelId,
            generationConfig: { responseMimeType: "application/json", responseSchema: schema as any }
          });
          const result = await model.generateContent(`Create a workflow JSON for: ${aiPrompt}`);
          const data = JSON.parse(result.response.text());
          setNodes(data.nodes);
          setLinks(data.links);
          recordUsage(keyEntry.id);
          success = true;
          break;
        } catch (e: any) {
          if (e.message?.includes('429')) break;
        }
      }
      if (success) break;
      markKeyAsExhausted(keyEntry.id);
    }
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-full relative p-4 lg:p-10 bg-brandDark overflow-hidden pb-32">
      <header className="mb-8">
         <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">İş Akışı Tasarımcısı</h2>
         <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1">Otonom Süreç Otomasyonu</p>
      </header>

      <div className="mb-8 flex gap-3 bg-white/5 p-4 rounded-3xl border border-white/10">
        <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="AI'ya iş akışı tasarlat (Örn: YouTube otomasyonu)..."
            className="flex-1 bg-black/40 border border-white/5 rounded-2xl px-6 text-xs text-white outline-none focus:border-primary"
        />
        <button onClick={handleAiGenerate} disabled={isProcessing} className="px-10 py-4 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl">
            {isProcessing ? 'İŞLENİYOR...' : 'TASARLA'}
        </button>
      </div>

      <div className="flex-1 glass-panel rounded-[3rem] border border-white/10 relative overflow-auto bg-black/20 p-10">
        {nodes.length > 0 ? (
            <div className="relative min-w-[800px] min-h-[600px]">
                {nodes.map(n => (
                    <div key={n.id} className="absolute w-48 p-4 bg-white/5 border border-primary/30 rounded-2xl" style={{ left: n.position[0], top: n.position[1] }}>
                        <p className="text-[10px] font-black text-white uppercase truncate">{n.name}</p>
                        <p className="text-[8px] text-slate-500 uppercase mt-1">{n.type}</p>
                    </div>
                ))}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                    {links.map((l: any, i: number) => {
                        const from = nodes.find(n => n.id === l.fromNode);
                        const to = nodes.find(n => n.id === l.toNode);
                        if (!from || !to) return null;
                        return <line key={i} x1={from.position[0]+100} y1={from.position[1]+30} x2={to.position[0]} y2={to.position[1]+30} stroke="var(--primary)" strokeWidth="2" />;
                    })}
                </svg>
            </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-10">
                <i className="fa-solid fa-diagram-project text-6xl mb-4"></i>
                <p className="text-[10px] font-black uppercase tracking-widest text-white">Akış Verisi Yok</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowView;
