/**
 * Safe localStorage helpers with JSON serialization.
 * Works in WebView and standard browsers. No-ops if unavailable.
 */

export function storageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function loadJSON<T>(key: string, fallback: T): T {
  if (!storageAvailable()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (err) {
    console.warn(`localStorage load failed for key: ${key}`, err);
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  if (!storageAvailable()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`localStorage save failed for key: ${key}`, err);
  }
}

