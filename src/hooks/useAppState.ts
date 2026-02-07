import { useState, useCallback, useEffect } from 'react';
import type { AppState, TemplateType, ViewportPreset, ScaleMode, CreativeKey } from '../types';
import { VIEWPORT_PRESETS } from '../types';

const STORAGE_KEY = 'ad-previewer-state';

function loadFromStorage(): Partial<AppState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function loadFromURL(): Partial<AppState> | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('state');
    if (encoded) return JSON.parse(atob(encoded));
  } catch { /* ignore */ }
  return null;
}

const defaults: AppState = {
  template: 'article',
  viewport: VIEWPORT_PRESETS[2], // Desktop
  zoom: 100,
  showOutlines: true,
  showLabels: true,
  scaleMode: 'scale-to-fit',
  darkMode: false,
  creatives: {},
  active970Variant: 'A',
  landingPageUrl: '',
};

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    const fromURL = loadFromURL();
    const fromStorage = loadFromStorage();
    // URL overrides storage overrides defaults (but don't load creatives from URL)
    const merged = { ...defaults, ...fromStorage, ...fromURL };
    // Restore creatives only from storage
    if (fromStorage?.creatives) {
      merged.creatives = fromStorage.creatives;
    }
    return merged;
  });

  // Persist to localStorage (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Don't persist creatives (data URLs are large)
      const { creatives: _c, ...rest } = state;
      void _c;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    }, 500);
    return () => clearTimeout(timer);
  }, [state]);

  const setTemplate = useCallback((template: TemplateType) => {
    setState(s => ({ ...s, template }));
  }, []);

  const setViewport = useCallback((viewport: ViewportPreset) => {
    setState(s => ({ ...s, viewport }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState(s => ({ ...s, zoom }));
  }, []);

  const toggleOutlines = useCallback(() => {
    setState(s => ({ ...s, showOutlines: !s.showOutlines }));
  }, []);

  const toggleLabels = useCallback(() => {
    setState(s => ({ ...s, showLabels: !s.showLabels }));
  }, []);

  const setScaleMode = useCallback((scaleMode: ScaleMode) => {
    setState(s => ({ ...s, scaleMode }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setState(s => ({ ...s, darkMode: !s.darkMode }));
  }, []);

  const setCreative = useCallback((key: CreativeKey, dataUrl: string | undefined) => {
    setState(s => ({
      ...s,
      creatives: { ...s.creatives, [key]: dataUrl },
    }));
  }, []);

  const setActive970Variant = useCallback((variant: 'A' | 'B') => {
    setState(s => ({ ...s, active970Variant: variant }));
  }, []);

  const setLandingPageUrl = useCallback((landingPageUrl: string) => {
    setState(s => ({ ...s, landingPageUrl }));
  }, []);

  const getShareURL = useCallback(() => {
    const { creatives: _c, ...rest } = state;
    void _c;
    const encoded = btoa(JSON.stringify(rest));
    return `${window.location.origin}${window.location.pathname}?state=${encoded}`;
  }, [state]);

  return {
    state,
    setTemplate,
    setViewport,
    setZoom,
    toggleOutlines,
    toggleLabels,
    setScaleMode,
    toggleDarkMode,
    setCreative,
    setActive970Variant,
    setLandingPageUrl,
    getShareURL,
  };
}

export type AppActions = ReturnType<typeof useAppState>;
