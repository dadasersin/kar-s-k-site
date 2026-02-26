import { safeJSONParse, getStorageItem, setStorageItem } from './storage';

export interface PersistentState {
  chatHistory: any[];
  dynamicModules: any[];
  settings: any;
  customPrompts: any[];
}

const DEFAULT_STATE: PersistentState = {
  chatHistory: [],
  dynamicModules: [],
  settings: {},
  customPrompts: []
};

export const saveState = (key: string, value: any) => {
  setStorageItem(key, value);
};

export const loadState = <T>(key: string, fallback: T): T => {
  return getStorageItem(key, fallback);
};

// Advanced: Save all critical state for GitHub/Supabase sync
export const getFullAppState = () => {
  return {
    chat_history: loadState('chat_history', []),
    live_ai_components: loadState('live_ai_components', []),
    sync_settings: loadState('sync_settings', {}),
    prompt_library: loadState('prompt_library', []),
    api_usage: loadState('api_usage', {})
  };
};

export const restoreFullAppState = (state: any) => {
  if (!state) return;
  if (state.chat_history) saveState('chat_history', state.chat_history);
  if (state.live_ai_components) saveState('live_ai_components', state.live_ai_components);
  if (state.sync_settings) saveState('sync_settings', state.sync_settings);
  if (state.prompt_library) saveState('prompt_library', state.prompt_library);
  if (state.api_usage) saveState('api_usage', state.api_usage);
};
