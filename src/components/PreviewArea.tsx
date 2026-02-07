import { forwardRef } from 'react';
import type { AppState } from '../types';
import { ArticlePage } from './templates/ArticlePage';
import { NewsFeed } from './templates/NewsFeed';
import { SectionPage } from './templates/SectionPage';

interface PreviewAreaProps {
  state: AppState;
}

const TEMPLATES = {
  article: ArticlePage,
  feed: NewsFeed,
  section: SectionPage,
};

export const PreviewArea = forwardRef<HTMLDivElement, PreviewAreaProps>(
  function PreviewArea({ state }, ref) {
    const { viewport, zoom, darkMode, template } = state;

    const scale = zoom / 100;
    const TemplateComponent = TEMPLATES[template];

    return (
      <div className="flex-1 overflow-auto bg-gray-100 p-6 flex flex-col items-center preview-scroll">
        {/* Viewport info bar */}
        <div className="mb-3 flex items-center gap-3 text-xs text-gray-500">
          <span className="font-medium">{viewport.name}</span>
          <span>{viewport.width} x {viewport.height}</span>
          <span>@ {zoom}%</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 rounded">{template}</span>
        </div>

        {/* Browser chrome wrapper — this is what gets captured for export */}
        <div
          ref={ref}
          style={{ width: viewport.width * scale }}
        >
          {/* Title bar */}
          <div
            className="bg-gray-200 rounded-t-lg px-3 py-2 flex items-center gap-2"
          >
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-white rounded px-3 py-0.5 text-[10px] text-gray-400 text-center truncate">
              thelaborwire.com/{template === 'article' ? '2024/12/uaw-vw-chattanooga-contract' : template === 'feed' ? 'top-stories' : 'labor-unions'}
            </div>
          </div>

          {/* Scrollable page content */}
          <div
            data-capture-scroll
            className={`${darkMode ? 'dark' : ''} border-x border-b border-gray-300 rounded-b-lg`}
            style={{
              width: viewport.width * scale,
              height: viewport.height * scale,
              overflow: 'auto',
            }}
          >
            {/* Unscaled content (transformed to fit) */}
            <div
              data-capture-content
              style={{
                width: viewport.width,
                minHeight: viewport.height,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              <TemplateComponent state={state} containerWidth={viewport.width} />
            </div>
          </div>
        </div>
      </div>
    );
  }
);
