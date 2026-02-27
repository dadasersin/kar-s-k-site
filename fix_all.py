import os
import re

def fix_types():
    path = 'src/types.ts'
    if not os.path.exists(path): return
    content = open(path).read()
    old = """  NEURAL_LOGIC = 'neural_logic',

  id: string;
  name: string;
  type: string;
  position: [number, number];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parameters ?: any;
}"""
    new = """  NEURAL_LOGIC = 'neural_logic'
}

export interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parameters ?: any;
}"""
    if old in content:
        with open(path, 'w') as f:
            f.write(content.replace(old, new))
        print('Fixed types.ts')

def fix_sidebar():
    path = 'src/components/Sidebar.tsx'
    if not os.path.exists(path): return
    content = open(path).read()
    old = """    { id: AppView.USER_MANUAL, label: 'Kullanma Kılavuzu', icon: 'fa-book' },"""
    new = """    { id: AppView.USER_MANUAL, label: 'Kullanma Kılavuzu', icon: 'fa-book' },
  ];"""
    if old in content and '];' not in content[content.find(old):content.find(old)+100]:
        with open(path, 'w') as f:
            f.write(content.replace(old, new))
        print('Fixed Sidebar.tsx')

def fix_live_dev():
    path = 'src/views/LiveAiDeveloperView.tsx'
    if not os.path.exists(path): return
    with open(path, 'rb') as f:
        content = f.read()
    old = b' ( ```html ) '
    new = b' ( \\`\\`\\`html ) '
    if old in content:
        with open(path, 'wb') as f:
            f.write(content.replace(old, new))
        print('Fixed LiveAiDeveloperView.tsx')

def fix_neural_logic_imports():
    path = 'src/views/NeuralLogicView.tsx'
    if not os.path.exists(path): return
    content = open(path).read()
    old = "import { getActiveChains, ReasoningChain, LogicNode } from '../utils/neuralLogic';"
    new = "import { getActiveChains } from '../utils/neuralLogic';\nimport type { ReasoningChain, LogicNode } from '../utils/neuralLogic';"
    if old in content:
        with open(path, 'w') as f:
            f.write(content.replace(old, new))
        print('Fixed NeuralLogicView.tsx imports')

fix_types()
fix_sidebar()
fix_live_dev()
fix_neural_logic_imports()
