import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { getActiveChains } from '../utils/neuralLogic';
import type { ReasoningChain, LogicNode } from '../utils/neuralLogic';

interface NeuralLogicViewProps {
    onViewChange?: (view: AppView) => void;
}

const NeuralLogicView: React.FC<NeuralLogicViewProps> = ({ onViewChange }) => {
    const [chains, setChains] = useState<ReasoningChain[]>([]);
    const [activeChainId, setActiveChainId] = useState<string | null>(null);

    useEffect(() => {
        // Polling active chains for real-time visualization
        const interval = setInterval(() => {
            const active = getActiveChains();
            setChains(active);
            if (active.length > 0 && !activeChainId) {
                setActiveChainId(active[0].id);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [activeChainId]);

    const activeChain = chains.find(c => c.id === activeChainId);

    const renderNodeIcon = (status: string) => {
        switch (status) {
            case 'completed': return <i className="fa-solid fa-check text-emerald-400"></i>;
            case 'processing': return <i className="fa-solid fa-spinner fa-spin text-primary"></i>;
            case 'learning': return <i className="fa-solid fa-brain text-purple-400 animate-pulse"></i>;
            case 'failed': return <i className="fa-solid fa-xmark text-red-500"></i>;
            default: return <i className="fa-solid fa-circle-dot text-slate-600"></i>;
        }
    };

    const renderNodeLine = (status: string, isLast: boolean) => {
        if (isLast) return null;
        let colorClass = 'bg-slate-800';
        if (status === 'completed') colorClass = 'bg-emerald-500/50';
        else if (status === 'processing' || status === 'learning') colorClass = 'bg-primary/50 animate-pulse';

        return (
            <div className={`absolute left-6 top-10 bottom-[-20px] w-0.5 ${colorClass}`}></div>
    );
  };

  return (
    <div className="p-4 lg:p-12 animate-in fade-in duration-700 min-h-screen pb-32">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/5 pb-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
              <i className="fa-solid fa-network-wired text-3xl"></i>
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-white italic tracking-tighter uppercase relative">
                Neural Logic
                <span className="absolute -top-3 -right-6 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                </span>
              </h1>
              <p className="text-slate-400 font-medium text-sm mt-2">
                Otonom Akıl Yürütme ve Karar Motoru İzleyici
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="px-4 py-2 bg-brandDark/50 rounded-xl border border-white/5 text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Bilişsel Çekirdek Aktif
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* History Panel */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest pl-2">Aktif Zincirler</h3>
            <div className="space-y-3">
              {chains.map(chain => (
                <div
                  key={chain.id}
                  onClick={() => setActiveChainId(chain.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${activeChainId === chain.id ? 'bg-purple-500/10 border-purple-500/30 shadow-lg' : 'bg-brandDark/50 border-white/5 hover:bg-white/5'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-bold text-white truncate pr-4">{chain.topic}</p>
                    {chain.isFailoverMode && (
                      <span className="shrink-0 px-2 py-0.5 bg-amber-500/20 text-amber-500 text-[9px] font-black rounded uppercase">Otonom</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 uppercase font-black tracking-wider">
                    <span>{new Date(chain.startTime).toLocaleTimeString('tr-TR')}</span>
                    <span>•</span>
                    <span className={chain.finalConclusion ? 'text-emerald-400' : 'text-primary animate-pulse'}>
                      {chain.finalConclusion ? 'Tamamlandı' : 'İşleniyor'}
                    </span>
                  </div>
                </div>
              ))}
              {chains.length === 0 && (
                <div className="p-8 text-center rounded-2xl border border-white/5 bg-brandDark/50">
                  <i className="fa-solid fa-moon text-3xl text-slate-700 mb-4"></i>
                  <p className="text-sm text-slate-500 font-medium">Bilişsel aktivite yok</p>
                </div>
              )}
            </div>
          </div>

          {/* Logic Flow Visualization */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest pl-2">Zihin Haritası</h3>

            <div className="bg-brandDark/50 border border-white/5 rounded-3xl p-6 lg:p-8 min-h-[500px] relative overflow-hidden">
              {/* Background Graph Lines */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }}></div>

              {activeChain ? (
                <div className="relative z-10 space-y-6">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-8">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Orijinal İstem</p>
                    <p className="text-sm text-slate-200 italic">"{activeChain.originalQuery}"</p>
                  </div>

                  <div className="space-y-4 pl-2">
                    {activeChain.nodes.map((node, idx) => (
                      <div key={node.id} className="relative flex items-start gap-6 group">
                        {renderNodeLine(node.status, idx === activeChain.nodes.length - 1)}

                        <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center relative z-10 transition-all duration-500 ${
                          node.status === 'completed' ? 'bg-emerald-500/20 border-emerald-500/30' :
                          node.status === 'processing' || node.status === 'learning' ? 'bg-primary/20 border-primary/30 shadow-[0_0_20px_rgba(13,89,242,0.3)]' :
                          'bg-slate-800/50 border-slate-700'
                        } border`}>
                          {renderNodeIcon(node.status)}
                        </div>

                        <div className="flex-1 pt-2 pb-6">
                          <h4 className={`text-lg font-bold mb-1 transition-colors ${node.status === 'processing' ? 'text-primary' : 'text-white'}`}>{node.stepName}</h4>
                          <p className="text-sm text-slate-400 mb-3">{node.description}</p>

                          {node.result && (
                            <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs text-slate-300 font-mono">
                              {node.result}
                            </div>
                          )}
                           {node.learnedData && (
                            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 mt-2">
                              <span className="font-bold text-purple-400 uppercase text-[9px] tracking-wider block mb-1">Hafızaya Alındı</span>
                              {node.learnedData}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {activeChain.finalConclusion && (
                    <div className="mt-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 animate-in fade-in slide-in-from-bottom-4">
                      <div className="flex items-center gap-3 mb-3">
                        <i className="fa-solid fa-flag-checkered text-emerald-400"></i>
                        <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Sonuç</h4>
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed">{activeChain.finalConclusion}</p>
                    </div>
                  )}

                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                  <div className="w-24 h-24 rounded-full border border-slate-700 flex items-center justify-center mb-4">
                    <i className="fa-solid fa-brain text-4xl opacity-50"></i>
                  </div>
                  <p className="font-medium text-sm">Harita verisi bekleniyor...</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default NeuralLogicView;
