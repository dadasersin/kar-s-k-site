import { getStorageItem, setStorageItem } from './storage';
import { pushToGitHub } from './githubSync';

// Centralized state persistence
export const syncPortalState = async () => {
    const chat = getStorageItem('chat_history', []);
    const modules = getStorageItem('active_dynamic_modules', []);
    const settings = getStorageItem('sync_settings', {});

    const state = {
        chat,
        modules,
        settings,
        timestamp: Date.now(),
        version: '1.2.0'
    };

    if (settings.enabled && settings.token && settings.repo) {
        await pushToGitHub({
            token: settings.token,
            repo: settings.repo,
            path: 'portal-state.json'
        });
    }

    return state;
};
