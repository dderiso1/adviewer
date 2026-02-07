import { AdSlot } from '../AdSlot';
import { SiteNav } from '../SiteNav';
import { FEED_ITEMS } from '../../utils/content';
import type { AppState } from '../../types';

interface NewsFeedProps {
  state: AppState;
  containerWidth: number;
}

function FeedCard({
  headline,
  excerpt,
  category,
  imageColor,
  time,
  darkMode,
}: {
  headline: string;
  excerpt: string;
  category: string;
  imageColor: string;
  time: string;
  darkMode: boolean;
}) {
  return (
    <div className="feed-card">
      <div
        style={{
          height: 200,
          background: `linear-gradient(135deg, ${imageColor} 0%, ${imageColor}cc 100%)`,
          display: 'flex',
          alignItems: 'flex-end',
          padding: 16,
        }}
      >
        <span
          className="text-white text-xs font-semibold px-2 py-1 rounded"
          style={{ background: 'rgba(0,0,0,0.4)' }}
        >
          {category}
        </span>
      </div>
      <div className="p-4">
        <h3 className={`font-bold text-lg mb-2 leading-tight ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {headline}
        </h3>
        <p className={`text-sm mb-3 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {excerpt}
        </p>
        <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{time}</div>
      </div>
    </div>
  );
}

export function NewsFeed({ state, containerWidth }: NewsFeedProps) {
  const { showOutlines, showLabels, scaleMode, creatives, active970Variant, darkMode, landingPageUrl } = state;

  const adProps = {
    showOutline: showOutlines,
    showLabel: showLabels,
    scaleMode,
    creatives,
    active970Variant,
    landingPageUrl: landingPageUrl || undefined,
  };

  // Insert in-feed ads after card 3 and card 7
  const inFeedAdPositions: Record<number, { size: '300x250' | '320x50' | '728x90'; label: string }> = {
    3: { size: containerWidth < 500 ? '320x50' : '300x250', label: 'Sponsored Content' },
    7: { size: containerWidth < 500 ? '320x50' : '300x250', label: 'Advertisement' },
  };

  return (
    <div className={darkMode ? 'bg-gray-800 min-h-full' : 'bg-gray-50 min-h-full'}>
      <SiteNav darkMode={darkMode} />

      {/* Top leaderboard */}
      <div className={`py-4 flex justify-center ${darkMode ? 'bg-gray-900' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <AdSlot
          size={containerWidth >= 728 ? '728x90' : '320x50'}
          containerWidth={containerWidth - 32}
          label="Advertisement"
          {...adProps}
        />
      </div>

      {/* Section header */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}
            style={{ fontFamily: 'Georgia, serif' }}>
          Top Stories
        </h1>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Latest news and breaking stories
        </p>
      </div>

      {/* Feed */}
      <div className="max-w-2xl mx-auto px-4 pb-12 flex flex-col gap-6">
        {FEED_ITEMS.map((item, i) => (
          <div key={i}>
            <FeedCard {...item} darkMode={darkMode} />
            {inFeedAdPositions[i + 1] && (
              <div className="flex justify-center my-6">
                <AdSlot
                  size={inFeedAdPositions[i + 1].size}
                  label={inFeedAdPositions[i + 1].label}
                  containerWidth={Math.min(containerWidth - 32, 672)}
                  {...adProps}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
