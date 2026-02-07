import { useEffect, useState } from 'react';
import type { AppState } from '../types';
import { VIEWPORT_PRESETS } from '../types';
import { loadConfig, decodeStateFromURL } from '../utils/storage';
import { ArticlePage } from './templates/ArticlePage';
import { NewsFeed } from './templates/NewsFeed';
import { SectionPage } from './templates/SectionPage';

const TEMPLATES = {
  article: ArticlePage,
  feed: NewsFeed,
  section: SectionPage,
};

const stateDefaults: AppState = {
  template: 'article',
  viewport: VIEWPORT_PRESETS[2],
  zoom: 100,
  showOutlines: false,
  showLabels: false,
  scaleMode: 'scale-to-fit',
  darkMode: false,
  creatives: {},
  active970Variant: 'A',
  landingPageUrl: '',
  adMode: 'static',
  builderView: 'builder',
  activeBuilderSize: '300x250',
  interactiveAds: {},
  ctvConfig: { ctaText: 'Learn More', ctaUrl: '', brandName: 'VoteShift' },
  selectedComponentId: null,
};

interface PresentationViewProps {
  presentParam?: string | null; // legacy IndexedDB id or ignored
  hashData?: string;            // new: lz-string compressed state in URL hash
}

export function PresentationView({ presentParam, hashData }: PresentationViewProps) {
  const [state, setState] = useState<AppState | null>(null);
  const [error, setError] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Try URL hash first (new portable format)
    if (hashData) {
      const decoded = decodeStateFromURL(hashData);
      if (decoded) {
        setState({ ...stateDefaults, ...decoded });
        return;
      }
    }

    // Fall back to legacy IndexedDB lookup
    if (presentParam) {
      loadConfig(presentParam)
        .then((loaded) => {
          if (loaded) {
            setState({ ...stateDefaults, ...loaded });
          } else {
            setError(true);
          }
        })
        .catch(() => setError(true));
      return;
    }

    setError(true);
  }, [presentParam, hashData]);

  // Track viewport width for responsive rendering
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Preview Not Found</h1>
          <p className="text-gray-500 text-sm">
            This preview link may be invalid. Please request a new link.
          </p>
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading preview...</div>
      </div>
    );
  }

  const TemplateComponent = TEMPLATES[state.template];

  return (
    <div className={state.darkMode ? 'dark' : ''}>
      <TemplateComponent state={state} containerWidth={width} />
    </div>
  );
}
