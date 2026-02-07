import { useState, useCallback, useEffect } from 'react';
import type {
  AppState, TemplateType, ViewportPreset, ScaleMode, CreativeKey,
  AdMode, AdSizeKey, InteractiveAdConfig, CTVConfig, AdComponent,
} from '../types';
import { VIEWPORT_PRESETS } from '../types';

const STORAGE_KEY = 'ad-previewer-state';
const STORAGE_VERSION_KEY = 'ad-previewer-version';
const CURRENT_VERSION = '2'; // Bump to clear stale state

function loadFromStorage(): Partial<AppState> | null {
  try {
    // Clear stale state from older versions
    const version = localStorage.getItem(STORAGE_VERSION_KEY);
    if (version !== CURRENT_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
      return null;
    }
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
  viewport: VIEWPORT_PRESETS[2],
  zoom: 100,
  showOutlines: true,
  showLabels: true,
  scaleMode: 'scale-to-fit',
  darkMode: false,
  creatives: {},
  active970Variant: 'A',
  landingPageUrl: '',
  // Video & Interactive
  adMode: 'static',
  builderView: 'builder',
  activeBuilderSize: '300x250',
  interactiveAds: {},
  ctvConfig: {
    ctaText: 'Learn More',
    ctaUrl: '',
    brandName: 'VoteShift',
  },
  selectedComponentId: null,
};

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    const fromURL = loadFromURL();
    const fromStorage = loadFromStorage();
    return { ...defaults, ...fromStorage, ...fromURL };
  });

  // Persist to localStorage (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
      } catch {
        // If quota exceeded (large data URLs), save without creatives
        const { creatives: _c, interactiveAds: _ia, ...rest } = state;
        void _c; void _ia;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
        localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
      }
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

  // ── Video & Interactive actions ────────────────────────

  const setAdMode = useCallback((adMode: AdMode) => {
    setState(s => ({ ...s, adMode }));
  }, []);

  const setBuilderView = useCallback((builderView: 'builder' | 'in-context' | 'ctv') => {
    setState(s => ({ ...s, builderView }));
  }, []);

  const setActiveBuilderSize = useCallback((activeBuilderSize: AdSizeKey) => {
    setState(s => ({ ...s, activeBuilderSize }));
  }, []);

  const setInteractiveAd = useCallback((size: AdSizeKey, config: InteractiveAdConfig) => {
    setState(s => ({
      ...s,
      interactiveAds: { ...s.interactiveAds, [size]: config },
    }));
  }, []);

  const setCTVConfig = useCallback((ctvConfig: CTVConfig) => {
    setState(s => ({ ...s, ctvConfig }));
  }, []);

  const setSelectedComponentId = useCallback((selectedComponentId: string | null) => {
    setState(s => ({ ...s, selectedComponentId }));
  }, []);

  const updateComponent = useCallback((size: AdSizeKey, updated: AdComponent) => {
    setState(s => {
      const ad = s.interactiveAds[size];
      if (!ad) return s;
      return {
        ...s,
        interactiveAds: {
          ...s.interactiveAds,
          [size]: {
            ...ad,
            components: ad.components.map(c => c.id === updated.id ? updated : c),
          },
        },
      };
    });
  }, []);

  const getShareURL = useCallback(() => {
    const { creatives: _c, interactiveAds: _ia, ctvConfig: _ctv, ...rest } = state;
    void _c; void _ia; void _ctv;
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
    setAdMode,
    setBuilderView,
    setActiveBuilderSize,
    setInteractiveAd,
    setCTVConfig,
    setSelectedComponentId,
    updateComponent,
    getShareURL,
  };
}

export type AppActions = ReturnType<typeof useAppState>;
