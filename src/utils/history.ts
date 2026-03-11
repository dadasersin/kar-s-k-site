import { getStorageItem, setStorageItem } from './storage';

export interface ActionRecord {
  id: string;
  module: string;
  action: string;
  timestamp: string;
}

const HISTORY_KEY = 'portal_action_history';
const MAX_HISTORY = 15;

export const recordAction = (module: string, action: string) => {
  const history = getStorageItem<ActionRecord[]>(HISTORY_KEY, []);

  const newRecord: ActionRecord = {
    id: Math.random().toString(36).substr(2, 9),
    module,
    action,
    timestamp: new Date().toLocaleString('tr-TR')
  };

  const updatedHistory = [newRecord, ...history].slice(0, 100); // Keep more in storage, slice 15 for display
  setStorageItem(HISTORY_KEY, updatedHistory);
};

export const getHistoryByModule = (module: string): ActionRecord[] => {
  const history = getStorageItem<ActionRecord[]>(HISTORY_KEY, []);
  return history.filter(h => h.module === module).slice(0, MAX_HISTORY);
};

export const getGlobalHistory = (): ActionRecord[] => {
  const history = getStorageItem<ActionRecord[]>(HISTORY_KEY, []);
  return history.slice(0, MAX_HISTORY);
};
