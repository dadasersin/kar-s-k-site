import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAvailableKeys, markKeyAsExhausted } from '../utils/apiPool';
import type { WorkflowNode, WorkflowLink } from '../types';

const WorkflowView: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [links, setLinks] = useState<WorkflowLink[]>([]);
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'logs'>('visual');
  const [logs, setLogs] = useState<string[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');

  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [simulationProgress, setSimulationProgress] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [telemetryData, setTelemetryData] = useState<any>(null);
  const [executionResult, setExecutionResult] = useState<string | null>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 50)]);
  };

  const processJson = (content: string) => {
    if (!content.trim()) {
      addLog("HATA: İşlenecek JSON verisi bulunamadı.");
      return;
    }
    try {
      const data = JSON.parse(content);
      addLog("Workflow JSON ayrıştırılıyor...");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsedNodes: WorkflowNode[] = (data.nodes || []).map((n: any) => ({
        id: n.id,
        name: n.name,
        type: n.type,
        position: n.position || [Math.random() * 500, Math.random() * 500],
        parameters: n.parameters
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsedLinks: WorkflowLink[] = (data.links || []).map((l: any) => ({
        fromNode: l.fromNode,
        toNode: l.toNode
      }));

      setNodes(parsedNodes);
      setLinks(parsedLinks);
      setJsonInput(JSON.stringify(data, null, 2));
      addLog(`${parsedNodes.length} düğüm ve ${parsedLinks.length} bağlantı başarıyla yüklendi.`);
      setActiveTab('visual');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      addLog(`HATA: Geçersiz JSON yapısı - ${e.message}`);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim() || isProcessing) return;
    setIsProcessing(true);
    addLog("İş akışı tasarlanıyor...");

    try {
      const availableKeys = getAvailableKeys('gemini');

      if (availableKeys.length > 0) {
        let success = false;
        for (const keyEntry of availableKeys) {
          try {
            const genAI = new GoogleGenerativeAI(keyEntry.key);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
            const prompt = `Aşağıdaki tanıma göre bir n8n benzeri iş akışı JSON'u oluştur. JSON şu yapıda olmalı:
              { "nodes": [ { "id": "1", "name": "Node Adı", "type": "node.type", "position": [x, y], "parameters": {} } ],
                "links": [ { "fromNode": "1", "toNode": "2" } ] }

              Kullanıcı Tanımı: ${aiPrompt}`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              processJson(jsonMatch[0]);
              addLog("✅ AI ile iş akışı başarıyla oluşturuldu.");
            } else {
              throw new Error("AI geçerli bir JSON döndürmedi.");
            }
            success = true;
            break;
          } catch (error: any) {
            console.error(`Workflow AI error [${keyEntry.label}]:`, error);
            if (error.message?.includes('429') || error.message?.toLowerCase().includes('quota')) {
              markKeyAsExhausted(keyEntry.id);
              continue;
            } else {
              throw error;
            }
          }
        }
        if (!success && availableKeys.length > 0) {
          addLog("❌ HATA: Tüm API anahtarlarının kotası dolmuş.");
        }
      } else {
        // Simulation Mode
        await new Promise(resolve => setTimeout(resolve, 2000));
        let mockWorkflow;
        if (aiPrompt.toLowerCase().includes('google') || aiPrompt.toLowerCase().includes('gmail') || aiPrompt.toLowerCase().includes('sheets')) {
          mockWorkflow = {
            nodes: [
              { id: "1", name: "Gmail: Yeni Mesaj", type: "google.gmail_trigger", position: [100, 100] },
              { id: "2", name: "AI: Analiz Et", type: "ai.analysis", position: [300, 150] },
              { id: "3", name: "Sheets: Satır Ekle", type: "google.sheets_action", position: [500, 100] }
            ],
            links: [
              { fromNode: "1", toNode: "2" },
              { fromNode: "2", toNode: "3" }
            ]
          };
          addLog("ℹ️ Google Ekosistemi şablonu yüklendi.");
        } else {
          mockWorkflow = {
            nodes: [
              { id: "1", name: "Başlat", type: "trigger", position: [100, 100] },
              { id: "2", name: "İşlem", type: "action", position: [300, 150] },
              { id: "3", name: "Sonuç", type: "output", position: [500, 100] }
            ],
            links: [
              { fromNode: "1", toNode: "2" },
              { fromNode: "2", toNode: "3" }
            ]
          };
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setNodes(mockWorkflow.nodes as any);
        setLinks(mockWorkflow.links);
        setJsonInput(JSON.stringify(mockWorkflow, null, 2));
        addLog("✅ Simülasyon modunda iş akışı oluşturuldu.");
      }
      setActiveTab('visual');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      addLog(`❌ HATA: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const runSimulation = async () => {
    if (nodes.length === 0) return;
    setIsProcessing(true);
    setSimulationProgress(0);
    addLog("Neural Execution Engine başlatıldı...");

    let step = 0;
    for (const node of nodes) {
      step++;
      setActiveNodeId(node.id);
      setSimulationProgress((step / nodes.length) * 100);
      setTelemetryData(node.parameters || { info: "Node parametreleri aktif." });

      addLog(`İşleniyor: ${node.name}`);
      await new Promise(r => setTimeout(r, 1000));
      addLog(`Tamamlandı: ${node.name}`);
    }

    setActiveNodeId(null);
    setTelemetryData(null);
    setExecutionResult("Workflow başarıyla yürütüldü.");
    addLog("Simülasyon tamamlandı.");
    setIsProcessing(false);
    setTimeout(() => setExecutionResult(null), 3000);
  };

  return (
    <div
      className="flex flex-col h-full relative p-4 lg:p-8 bg-brandDark overflow-hidden pb-32"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => processJson(ev.target?.result as string);
          reader.readAsText(file);
        }
      }}
    >
      {isDragging && (
        <div className="absolute inset-0 z-[100] bg-primary/60 backdrop-blur-md border-4 border-dashed border-primary rounded-[40px] flex flex-col items-center justify-center pointer-events-none">
          <i className="fas fa-file-code text-5xl text-white mb-4 animate-bounce"></i>
          <h2 className="text-xl font-black text-white uppercase tracking-widest">JSON Verisini Bırak</h2>
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAiGenerate()}
            placeholder="AI'ya iş akışı tasarlat..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs font-bold uppercase tracking-widest outline-none focus:border-primary transition-all placeholder:text-gray-700 text-white"
          />
        </div>
        <div className="flex gap-2">
            <button
            onClick={handleAiGenerate}
            disabled={!aiPrompt.trim() || isProcessing}
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg shadow-purple-500/20 text-xs"
            >
            {isProcessing ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-magic"></i>}
            Tasarla
            </button>
            <button
            onClick={runSimulation}
            disabled={nodes.length === 0 || isProcessing}
            className="px-6 py-3 rounded-2xl bg-primary hover:brightness-110 text-white font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg shadow-primary/20 text-xs"
            >
            {isProcessing ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-play"></i>}
            Yürüt
            </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0 overflow-hidden">
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 bg-black/40 border border-white/10 rounded-[32px] p-6 flex flex-col overflow-hidden">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center justify-between">JSON Verisi</h3>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="flex-1 bg-transparent border-none p-0 text-[10px] font-mono text-primary resize-none outline-none scrollbar-hide mb-4"
              placeholder="JSON buraya..."
            />
            <button
              onClick={() => processJson(jsonInput)}
              className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white"
            >
              Uygula
            </button>
          </div>

          {telemetryData && (
            <div className="h-40 bg-primary/5 border border-primary/30 rounded-[24px] p-4 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-[9px] font-black text-primary uppercase tracking-widest mb-2">Telemetri</h3>
              <div className="font-mono text-[10px] text-primary overflow-y-auto h-full scrollbar-hide">
                <pre>{JSON.stringify(telemetryData, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 glass-panel rounded-[40px] relative overflow-hidden flex flex-col min-h-[400px]">
          <div className="h-14 border-b border-white/5 flex items-center px-8 gap-6 bg-black/20 shrink-0">
            <button onClick={() => setActiveTab('visual')} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'visual' ? 'text-primary' : 'text-gray-500'}`}>Tuval</button>
            <button onClick={() => setActiveTab('logs')} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'logs' ? 'text-primary' : 'text-gray-500'}`}>Loglar</button>
            {isProcessing && <div className="ml-auto w-32 h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-primary transition-all" style={{ width: `${simulationProgress}%` }}></div></div>}
          </div>

          <div className="flex-1 relative overflow-auto scrollbar-hide p-10 bg-brandDark/20">
            {activeTab === 'visual' ? (
              <div className="relative min-w-[800px] min-h-[600px]">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {links.map((link, i) => {
                    const from = nodes.find(n => n.id === link.fromNode);
                    const to = nodes.find(n => n.id === link.toNode);
                    if (!from || !to) return null;
                    return (
                      <path
                        key={i}
                        d={`M ${from.position[0] + 100} ${from.position[1] + 30} C ${from.position[0] + 150} ${from.position[1] + 30}, ${to.position[0] - 50} ${to.position[1] + 30}, ${to.position[0]} ${to.position[1] + 30}`}
                        stroke="rgba(13, 89, 242, 0.3)"
                        fill="none"
                        strokeWidth="2"
                      />
                    );
                  })}
                </svg>
                {nodes.map(node => (
                  <div
                    key={node.id}
                    className={`absolute w-48 p-4 rounded-xl border transition-all ${activeNodeId === node.id ? 'bg-primary/20 border-primary scale-105 shadow-lg shadow-primary/20' : 'bg-white/5 border-white/10'}`}
                    style={{ left: node.position[0], top: node.position[1] }}
                  >
                    <p className="text-[10px] font-black text-white uppercase truncate">{node.name}</p>
                    <p className="text-[8px] text-gray-500 uppercase mt-1">{node.type}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 font-mono text-[10px]">
                {logs.map((log, i) => (
                  <div key={i} className="p-2 bg-white/5 border border-white/5 rounded text-gray-400">{log}</div>
                ))}
              </div>
            )}
          </div>

          {executionResult && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl animate-in fade-in slide-in-from-bottom-4 shadow-xl shadow-primary/40">
              {executionResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowView;
