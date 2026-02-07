import { AdSlot } from '../AdSlot';
import { SiteNav } from '../SiteNav';
import { ARTICLE_PARAGRAPHS, ARTICLE_HEADLINE, ARTICLE_BYLINE } from '../../utils/content';
import type { AppState } from '../../types';

interface ArticlePageProps {
  state: AppState;
  containerWidth: number;
}

export function ArticlePage({ state, containerWidth }: ArticlePageProps) {
  const { showOutlines, showLabels, scaleMode, creatives, active970Variant, darkMode, landingPageUrl } = state;
  const isDesktop = containerWidth >= 900;
  const contentWidth = isDesktop ? containerWidth - 340 : containerWidth;

  const adProps = {
    showOutline: showOutlines,
    showLabel: showLabels,
    scaleMode,
    creatives,
    active970Variant,
    landingPageUrl: landingPageUrl || undefined,
  };

  // Insert in-article ads after paragraph 2, 5, and 8
  const inArticleSlots: Record<number, { size: '300x250' | '320x50' | '728x90'; label: string }> = {
    2: { size: containerWidth < 500 ? '320x50' : '728x90', label: 'Advertisement' },
    5: { size: '300x250', label: 'Sponsored' },
    8: { size: containerWidth < 500 ? '320x50' : '728x90', label: 'Advertisement' },
  };

  return (
    <div className={darkMode ? 'bg-gray-800 min-h-full' : 'bg-white min-h-full'}>
      <SiteNav darkMode={darkMode} />

      {/* Top leaderboard / billboard */}
      <div className={`py-4 flex justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <AdSlot
          size={containerWidth >= 970 ? '970x250' : containerWidth >= 728 ? '728x90' : '320x50'}
          variant={active970Variant}
          containerWidth={containerWidth - 32}
          label="Advertisement"
          {...adProps}
        />
      </div>

      <div className={`flex max-w-7xl mx-auto ${isDesktop ? 'gap-8' : ''} px-4 py-6`}>
        {/* Main content */}
        <main className="flex-1 min-w-0">
          <article className="article-content">
            {/* Hero image */}
            <div
              className="w-full rounded-lg mb-6"
              style={{
                height: 400,
                background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: 24,
              }}
            >
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
                Photo: Reuters / Pool
              </div>
            </div>

            <h1>{ARTICLE_HEADLINE}</h1>
            <div className="byline">{ARTICLE_BYLINE}</div>

            {ARTICLE_PARAGRAPHS.map((para, i) => (
              <div key={i}>
                <p>{para}</p>
                {inArticleSlots[i] && (
                  <div className="flex justify-center my-6">
                    <AdSlot
                      size={inArticleSlots[i].size}
                      label={inArticleSlots[i].label}
                      containerWidth={contentWidth - 32}
                      {...adProps}
                    />
                  </div>
                )}
              </div>
            ))}
          </article>
        </main>

        {/* Right rail (desktop only) */}
        {isDesktop && (
          <aside className="w-[300px] shrink-0">
            <div className="sticky top-4 flex flex-col gap-6">
              <div>
                <div className={`font-semibold text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Trending Stories
                </div>
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className={`py-3 border-b text-sm ${
                      darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <span className="font-bold text-highlight mr-2">{n}.</span>
                    {n === 1 && 'Fed Signals Rate Hold Through Q2 as Inflation Cools'}
                    {n === 2 && 'Tech IPO Market Heats Up With Three Major Filings'}
                    {n === 3 && 'Climate Summit Produces Unexpected Breakthrough Deal'}
                  </div>
                ))}
              </div>

              <AdSlot size="300x250" containerWidth={300} label="Sponsored" {...adProps} />

              <div>
                <div className={`font-semibold text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Most Read
                </div>
                {[4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className={`py-3 border-b text-sm ${
                      darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <span className="font-bold text-highlight mr-2">{n}.</span>
                    {n === 4 && 'New Study Links Ultra-Processed Foods to Cognitive Decline'}
                    {n === 5 && 'Housing Affordability Crisis Deepens in Sun Belt Cities'}
                    {n === 6 && 'SpaceX Starship Completes Historic Orbital Flight'}
                  </div>
                ))}
              </div>

              <AdSlot size="300x600" containerWidth={300} label="Advertisement" {...adProps} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
