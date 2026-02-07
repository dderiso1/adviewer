import { AdSlot } from '../AdSlot';
import { SiteNav } from '../SiteNav';
import { SECTION_ITEMS } from '../../utils/content';
import type { AppState } from '../../types';

interface SectionPageProps {
  state: AppState;
  containerWidth: number;
}

function SectionCard({
  headline,
  category,
  time,
  imageColor,
  darkMode,
}: {
  headline: string;
  category: string;
  time: string;
  imageColor: string;
  darkMode: boolean;
}) {
  return (
    <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'}`}>
      <div
        style={{
          height: 160,
          background: `linear-gradient(135deg, ${imageColor} 0%, ${imageColor}99 100%)`,
          display: 'flex',
          alignItems: 'flex-end',
          padding: 12,
        }}
      >
        <span
          className="text-white text-xs font-semibold px-2 py-1 rounded"
          style={{ background: 'rgba(0,0,0,0.4)' }}
        >
          {category}
        </span>
      </div>
      <div className="p-3">
        <h3 className={`font-semibold text-sm leading-snug mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {headline}
        </h3>
        <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{time}</div>
      </div>
    </div>
  );
}

export function SectionPage({ state, containerWidth }: SectionPageProps) {
  const { showOutlines, showLabels, scaleMode, creatives, active970Variant, darkMode, landingPageUrl, adMode, interactiveAds } = state;
  const isDesktop = containerWidth >= 700;

  const adProps = {
    showOutline: showOutlines,
    showLabel: showLabels,
    scaleMode,
    creatives,
    active970Variant,
    landingPageUrl: landingPageUrl || undefined,
    adMode,
    interactiveAds,
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
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
              style={{ fontFamily: 'Georgia, serif' }}>
            Labor & Unions
          </h1>
          <span className={`text-xs px-2 py-0.5 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
            Section
          </span>
        </div>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Organizing campaigns, contract negotiations, and the future of work
        </p>
      </div>

      {/* Grid content */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className={`grid gap-5 ${isDesktop ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {SECTION_ITEMS.slice(0, 4).map((item, i) => (
            <SectionCard key={i} {...item} darkMode={darkMode} />
          ))}
        </div>

        {/* Mid-section ad */}
        <div className="flex justify-center my-8">
          <AdSlot
            size={containerWidth < 500 ? '320x50' : '300x250'}
            containerWidth={Math.min(containerWidth - 32, 1024)}
            label="Sponsored"
            {...adProps}
          />
        </div>

        <div className={`grid gap-5 ${isDesktop ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {SECTION_ITEMS.slice(4).map((item, i) => (
            <SectionCard key={i + 4} {...item} darkMode={darkMode} />
          ))}
        </div>

        {/* Bottom billboard */}
        <div className="flex justify-center my-8">
          <AdSlot
            size={containerWidth >= 970 ? '970x250' : containerWidth >= 728 ? '728x90' : '320x50'}
            variant={active970Variant}
            containerWidth={containerWidth - 32}
            label="Advertisement"
            {...adProps}
          />
        </div>
      </div>
    </div>
  );
}
