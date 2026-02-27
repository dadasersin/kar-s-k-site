export type LogicNodeStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'learning';

export interface LogicNode {
    id: string;
    stepName: string;
    description: string;
    status: LogicNodeStatus;
    result?: string;
    learnedData?: string;
}

export interface ReasoningChain {
    id: string;
    topic: string;
    originalQuery: string;
    nodes: LogicNode[];
    finalConclusion?: string;
    startTime: number;
    endTime?: number;
    isFailoverMode: boolean; // True when API is dead and it uses internal/search logic
}

// In-memory store for active chains (could be moved to Redux/Context for larger apps)
let activeChains: ReasoningChain[] = [];

export const createReasoningChain = (query: string, isFailover: boolean = false): ReasoningChain => {
    const chain: ReasoningChain = {
        id: \`chain_\${Date.now()}\`,
    topic: extractTopic(query),
    originalQuery: query,
    nodes: generateInitialNodes(query, isFailover),
    startTime: Date.now(),
    isFailoverMode: isFailover
  };
  
  activeChains = [chain, ...activeChains].slice(0, 10); // Keep last 10
  saveChainsToStorage();
  return chain;
};

export const getActiveChains = (): ReasoningChain[] => {
  if (activeChains.length === 0) {
    loadChainsFromStorage();
  }
  return activeChains;
};

export const updateNodeStatus = (chainId: string, nodeId: string, updates: Partial<LogicNode>) => {
  activeChains = activeChains.map(chain => {
    if (chain.id === chainId) {
      return {
        ...chain,
        nodes: chain.nodes.map(node => 
          node.id === nodeId ? { ...node, ...updates } : node
        )
      };
    }
    return chain;
  });
  saveChainsToStorage();
};

export const completeChain = (chainId: string, conclusion: string) => {
  activeChains = activeChains.map(chain => {
    if (chain.id === chainId) {
      return {
        ...chain,
        finalConclusion: conclusion,
        endTime: Date.now()
      };
    }
    return chain;
  });
  saveChainsToStorage();
};

const extractTopic = (query: string): string => {
  // Simple extraction, could be enhanced with smaller NLP models or basic LLM call
  const words = query.split(' ');
  if (words.length > 5) {
    return words.slice(0, 5).join(' ') + '...';
  }
  return query;
};

const generateInitialNodes = (query: string, isFailover: boolean): LogicNode[] => {
  const nodes: LogicNode[] = [];
  const lowerQuery = query.toLowerCase();

  // 1. Always start with Intent Analysis
  nodes.push({
    id: \`node_\${Date.now()}_1\`,
    stepName: 'Niyet Analizi',
    description: 'Kullanıcının tam olarak ne istediğini çözümleme',
    status: 'pending'
  });

  // 2. Context/Data Retrieval
  if (isFailover) {
    nodes.push({
      id: \`node_\${Date.now()}_2\`,
      stepName: 'Otonom Veri Taraması',
      description: 'API limitleri aşıldı. Harici kaynaklardan/dahili hafızadan bilgi toplama.',
      status: 'pending'
    });
    nodes.push({
      id: \`node_\${Date.now()}_3\`,
      stepName: 'Nöral Öğrenme (Fallback)',
      description: 'Toplanan kısıtlı veriyi sentezleyip mantıksal bir çıkarım oluşturma.',
      status: 'pending'
    });
  } else {
    // Normal Mode
    if (lowerQuery.includes('araştır') || lowerQuery.includes('öğren')) {
      nodes.push({
        id: \`node_\${Date.now()}_2\`,
        stepName: 'Derin Web Taraması',
        description: 'Belirtilen konu hakkında güncel ve akademik verileri toplama.',
        status: 'pending'
      });
      nodes.push({
        id: \`node_\${Date.now()}_3\`,
        stepName: 'Bilgi Sentezi & Hafıza Kaydı',
        description: 'Öğrenilenleri sistemin kalıcı hafızasına kaydetme.',
        status: 'pending'
      });
    } else if (lowerQuery.includes('yap') || lowerQuery.includes('kodla') || lowerQuery.includes('ekle')) {
       nodes.push({
        id: \`node_\${Date.now()}_2\`,
        stepName: 'Mimari Planlama',
        description: 'İstenen özellik için en uygun bileşen ve sistem mimarisini tasarlama.',
        status: 'pending'
      });
       nodes.push({
        id: \`node_\${Date.now()}_3\`,
        stepName: 'Otonom Kod Üretimi',
        description: 'Live AI Developer motorunu tetikleme ve kodları sisteme enjekte etme.',
        status: 'pending'
      });
    } else {
       nodes.push({
        id: \`node_\${Date.now()}_2\`,
        stepName: 'Bilişsel Yanıt Üretimi',
        description: 'Kullanıcıya en tutarlı ve zengin içerikli cevabı hazırlama.',
        status: 'pending'
      });
    }
  }

  // Final Step Configuration
  nodes.push({
    id: \`node_\${Date.now()}_last\`,
    stepName: 'Çıktı Optimizasyonu',
    description: 'Sonuçları kullanıcıya sunulabilir, temiz bir formata dönüştürme.',
    status: 'pending'
  });

  return nodes;
};

const saveChainsToStorage = () => {
  try {
    localStorage.setItem('neural_logic_chains', JSON.stringify(activeChains));
  } catch (e) {
    console.warn('Could not save logic chains to storage', e);
  }
};

const loadChainsFromStorage = () => {
  try {
    const saved = localStorage.getItem('neural_logic_chains');
    if (saved) {
      activeChains = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Could not load logic chains from storage', e);
  }
};
