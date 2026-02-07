import { useEffect, useState } from 'react';
import type { AppState } from '../types';
import { loadConfig } from '../utils/storage';
import { ArticlePage } from './templates/ArticlePage';
import { NewsFeed } from './templates/NewsFeed';
import { SectionPage } from './templates/SectionPage';

const TEMPLATES = {
  article: ArticlePage,
  feed: NewsFeed,
  section: SectionPage,
};

export function PresentationView({ configId }: { configId: string }) {
  const [state, setState] = useState<AppState | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadConfig(configId)
      .then((loaded) => {
        if (loaded) {
          setState(loaded);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, [configId]);

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
      <TemplateComponent state={state} containerWidth={window.innerWidth} />
    </div>
  );
}
