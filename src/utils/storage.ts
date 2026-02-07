import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import type { AppState } from '../types';

// ── IndexedDB (legacy, still used as fallback) ──────────

const DB_NAME = 'ad-previewer';
const STORE_NAME = 'configs';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveConfig(id: string, state: AppState): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ id, state, savedAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadConfig(id: string): Promise<AppState | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => {
      resolve(request.result?.state ?? null);
    };
    request.onerror = () => reject(request.error);
  });
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

// ── URL-encoded state (portable, works cross-device) ────

/**
 * Compress state into a URL-safe string.
 * Strips fields that aren't needed for the client preview.
 */
export function encodeStateForURL(state: AppState): string {
  // Only include what's needed for the preview
  const preview = {
    template: state.template,
    darkMode: state.darkMode,
    showOutlines: state.showOutlines,
    showLabels: state.showLabels,
    scaleMode: state.scaleMode,
    creatives: state.creatives,
    active970Variant: state.active970Variant,
    landingPageUrl: state.landingPageUrl,
    adMode: state.adMode,
    interactiveAds: state.interactiveAds,
    ctvConfig: state.ctvConfig,
  };
  return compressToEncodedURIComponent(JSON.stringify(preview));
}

/**
 * Decode a compressed state string from the URL.
 */
export function decodeStateFromURL(encoded: string): Partial<AppState> | null {
  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    return JSON.parse(json);
  } catch {
    return null;
  }
}
