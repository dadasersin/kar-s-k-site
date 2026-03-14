import { getStorageItem } from './storage';

interface GitHubConfig {
  token: string;
  repo: string; // owner/repo
  path: string; // e.g. state.json
}

export const pushToGitHub = async (config: GitHubConfig): Promise<{ success: boolean; message: string }> => {
  if (!config.token || !config.repo) {
    return { success: false, message: 'GitHub yapılandırması eksik.' };
  }

  try {
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

    const content = JSON.stringify(state, null, 2);

    // 1. Get current file (for SHA)
    const url = `https://api.github.com/repos/${config.repo}/contents/${config.path || 'portal-state.json'}`;
    const getRes = await fetch(url, {
      headers: {
        'Authorization': `token ${config.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    let sha: string | undefined;
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }

    // 2. Update or Create file
    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Portal State Update: ${new Date().toLocaleString('tr-TR')}`,
        content: btoa(unescape(encodeURIComponent(content))), // Base64 encoding
        sha: sha
      })
    });

    if (putRes.ok) {
      return { success: true, message: 'GitHub senkronizasyonu başarılı!' };
    } else {
      const err = await putRes.json();
      return { success: false, message: `GitHub Hatası: ${err.message}` };
    }
  } catch (e: any) {
    return { success: false, message: `Hata: ${e.message}` };
  }
};

export const pullFromGitHub = async (config: GitHubConfig): Promise<{ success: boolean; data?: any; message: string }> => {
  if (!config.token || !config.repo) {
    return { success: false, message: 'GitHub yapılandırması eksik.' };
  }

  try {
    const url = `https://api.github.com/repos/${config.repo}/contents/${config.path || 'portal-state.json'}`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `token ${config.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (res.ok) {
      const data = await res.json();
      const content = decodeURIComponent(escape(atob(data.content)));
      return { success: true, data: JSON.parse(content), message: 'Veri başarıyla çekildi.' };
    } else {
      return { success: false, message: 'Veri dosyası bulunamadı.' };
    }
  } catch (e: any) {
    return { success: false, message: `Hata: ${e.message}` };
  }
};
