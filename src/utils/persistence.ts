import { getStorageItem } from './storage';

export const getFullAppState = () => {
    const chat = getStorageItem('chat_history', []);
    const modules = getStorageItem('active_dynamic_modules', []);
    const settings = getStorageItem('sync_settings', {});

    return {
        chat,
        modules,
        settings,
        timestamp: Date.now(),
        version: '1.2.0'
    };
};

export const syncPortalState = async () => {
    // This is no longer used directly to push to github here to avoid circular dependencies
    // but can be used for local persistence logic if needed.
    return getFullAppState();
};
