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
  GOOGLE_APPS = 'google_apps',
  DOCKER_AI = 'docker_ai',
  SETTINGS = 'settings',
  JULES_STUDIO = 'jules_studio',
  ART_STUDIO = 'art_studio',
  GAME_DEV = 'game_dev',
  SECURITY = 'security',
  INTEGRATIONS = 'integrations',
  SOCIAL_MEDIA = 'social_media',
  BORSA = 'borsa',
  YOUTUBE = 'youtube',
  LIVE_TV = 'live_tv',
  SYSTEM_EXPERT = 'system_expert',
  RUWIS_AI = 'ruwis_ai'
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

export interface AnalysisResult {
  explanation: string;
  solution: string;
  files: GeneratedFile[];
}

export interface GeneratedFile {
  name: string;
  language: string;
  content: string;
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
