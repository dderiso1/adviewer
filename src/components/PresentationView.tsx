import { useEffect, useState } from 'react';
import type { AppState } from '../types';
import { VIEWPORT_PRESETS } from '../types';
import { loadConfig } from '../utils/storage';
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

export function PresentationView({ configId }: { configId: string }) {
  const [state, setState] = useState<AppState | null>(null);
  const [error, setError] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    loadConfig(configId)
      .then((loaded) => {
        if (loaded) {
          // Merge with defaults to fill any missing fields from old configs
          setState({ ...stateDefaults, ...loaded });
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, [configId]);

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
            This preview link has expired or was created on a different device.
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
