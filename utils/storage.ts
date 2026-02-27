export const safeJSONParse = <T>(json: string | null, fallback: T): T => {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    console.error("Failed to parse JSON from localStorage", e);
    return fallback;
  }
};

export const getStorageItem = <T>(key: string, fallback: T): T => {
  const item = localStorage.getItem(key);
  return safeJSONParse(item, fallback);
};

export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to save to localStorage", e);
  }
};
