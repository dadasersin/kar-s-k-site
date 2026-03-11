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
  RUWIS_AI = 'ruwis_ai',
  ANTIGRAVITY = 'antigravity',
  FIGMA_STUDIO = 'figma_studio',
  AGENT_SKILLS = 'agent_skills',
  PROMPT_MASTER = 'prompt_master',
  QUOTIO = 'quotio',
  AG_TOOLKIT = 'ag_toolkit',
  DEV_TOOLS = 'dev_tools',
  CODER_CONFIG = 'coder_config',
  AGENTIC_CONFIG = 'agentic_config',
  TRANSPARENT_PNG = 'transparent_png',
  SKILLSHARE = 'skillshare',
  SELINE = 'seline',
  AG2API = 'ag2api',
  CURSOR_BRIDGE = 'cursor_bridge',
  KHOATA_TOOL = 'khoata_tool',
  CODEX_SWITCHER = 'codex_switcher',
  AG_COPILOT = 'ag_copilot',
  AG_USAGE_CHECKER = 'ag_usage_checker',
  PROMPT_EXPERT = 'prompt_expert',
  CURSOR_PROXY = 'cursor_proxy',
  AG_SYNC = 'ag_sync',
  AG_LAUNCHER = 'ag_launcher',
  USER_MANUAL = 'user_manual',
  SITE_EDIT = 'site_edit',
  JULES_AWESOME = 'jules_awesome',
  OMNIVIEW = 'omniview',
  NEURAL_LOGIC = 'neural_logic',
  ANDROID_NDK = 'android_ndk',
  WEATHER = 'weather',
  GOOGLE_AI_STUDIO = 'google_ai_studio',
  SKYDRIVE = 'skydrive',
  NEWS = 'news',
  PYTHON_LIB = "python_lib"
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
  usageCount?: number;
  quotaLimit?: number;
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
