export enum AppView {
  HOME = 'home',
  TOOLS = 'tools',
  CREATIVE = 'creative',
  DASHBOARD = 'dashboard',
  CHAT = 'chat',
  VISUALS = 'visuals',
  AUDIO = 'audio',
  LIVE = 'live',
  MUSIC = 'music',
  GALLERY = 'gallery',
  BUILDER = 'builder',
  WORKFLOW = 'workflow',
  CRYPTO = 'crypto',
  REQUESTS = 'requests',
  SYSTEM = 'system',
  AUTOMATION = 'automation',
  PROMPTS = 'prompts',
  ANALYTICS = 'analytics',
  SETTINGS = 'settings'
}

export interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parameters?: any;
}

export interface WorkflowLink {
  fromNode: string;
  toNode: string;
}

export interface SystemRequest {
  id: string;
  topic: string;
  date: string;
  status: 'warning' | 'success' | 'danger';
  statusText: string;
  priority: 'high' | 'medium' | 'low';
}

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export type ImageSize = '1K' | '2K' | '4K';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type ApiProvider = 'gemini' | 'openai' | 'deepseek' | 'grok' | 'custom';

export interface ApiKeyEntry {
  id: string;
  key: string;
  label: string;
  provider: ApiProvider;
  modelName: string;
  baseUrl?: string;
  isQuotaExhausted: boolean;
  lastUsed?: number;
}

export interface SyncSettings {
  enabled: boolean;
  token: string;
  repo: string;
  path: string;
  lastSync?: number;
  customApiKeys: ApiKeyEntry[];
}

export interface VisualAsset {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  timestamp: number;
}

export interface AudioRemix {
  id: string;
  originalName: string;
  remixUrl: string;
  prompt: string;
  timestamp: number;
}

export interface AppState {
  chatHistory: ChatMessage[];
  visualAssets: VisualAsset[];
  audioLogs: AudioRemix[];
}

export interface PromptEntry {
  id: string;
  title: string;
  text: string;
  category: 'image' | 'text' | 'code' | 'music';
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  instructions: string;
  icon: string;
}
