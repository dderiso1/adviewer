import { useRef } from 'react';
import type { AppActions } from '../hooks/useAppState';
import { VIEWPORT_PRESETS, ZOOM_LEVELS, CREATIVE_KEYS, AD_SIZES, INTERACTIVE_SIZES } from '../types';
import type { CreativeKey } from '../types';

const BASE = import.meta.env.BASE_URL;

interface ControlPanelProps {
  actions: AppActions;
  onExport: () => void;
  onClientLink: () => void;
}

export function ControlPanel({ actions, onExport, onClientLink }: ControlPanelProps) {
  const { state } = actions;
  const isStatic = state.adMode === 'static';

  return (
    <div className="w-72 shrink-0 bg-white border-r border-gray-200 overflow-y-auto h-screen flex flex-col">
      {/* VoteShift branded header */}
      <div className="p-4 border-b border-gray-200" style={{ background: '#0F2B45' }}>
        <div className="flex items-center gap-2.5 mb-1">
          <img
            src={`${BASE}voteshift-logo.png`}
            alt="VoteShift"
            className="h-8 w-auto"
          />
        </div>
        <p className="text-xs mt-1.5" style={{ color: '#56C3E8' }}>Ad Placement Previewer</p>
      </div>

      {/* Mode switcher */}
      <div className="p-4 border-b border-gray-200">
        <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#0F2B45' }}>Ad Mode</div>
        <div className="flex gap-1.5">
          {([
            { value: 'static', label: 'Static' },
            { value: 'video-interactive', label: 'Video & Interactive' },
          ] as const).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => actions.setAdMode(value)}
              className={`flex-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                state.adMode === value
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={state.adMode === value ? { background: '#0F2B45' } : undefined}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
        {isStatic ? (
          /* ── Static mode controls ────────────────────────── */
          <>
            {/* Template selector */}
            <Section title="Template">
              <div className="flex flex-col gap-1.5">
                {([
                  { value: 'article', label: 'Article Page' },
                  { value: 'feed', label: 'News Feed' },
                  { value: 'section', label: 'Section Page' },
                ] as const).map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => actions.setTemplate(value)}
                    className={`text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                      state.template === value
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={state.template === value ? { background: '#0F2B45' } : undefined}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Section>

            {/* Viewport presets */}
            <Section title="Viewport">
              <div className="flex gap-1.5">
                {VIEWPORT_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => actions.setViewport(preset)}
                    className={`flex-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                      state.viewport.name === preset.name
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={state.viewport.name === preset.name ? { background: '#0F2B45' } : undefined}
                  >
                    {preset.name}
                    <div className="text-[10px]" style={{ color: state.viewport.name === preset.name ? '#56C3E8' : '#9ca3af' }}>
                      {preset.width}x{preset.height}
                    </div>
                  </button>
                ))}
              </div>
            </Section>

            {/* Zoom */}
            <Section title="Zoom">
              <div className="flex gap-1.5">
                {ZOOM_LEVELS.map((z) => (
                  <button
                    key={z}
                    onClick={() => actions.setZoom(z)}
                    className={`flex-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                      state.zoom === z
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={state.zoom === z ? { background: '#0F2B45' } : undefined}
                  >
                    {z}%
                  </button>
                ))}
              </div>
            </Section>

            {/* Toggles */}
            <Section title="Display">
              <div className="flex flex-col gap-2">
                <Toggle label="Slot outlines" checked={state.showOutlines} onChange={actions.toggleOutlines} />
                <Toggle label="Ad labels" checked={state.showLabels} onChange={actions.toggleLabels} />
                <Toggle label="Dark mode" checked={state.darkMode} onChange={actions.toggleDarkMode} />
              </div>
            </Section>

            {/* Scale mode */}
            <Section title="Overflow Behavior">
              <div className="flex gap-1.5">
                {([
                  { value: 'scale-to-fit', label: 'Scale to Fit' },
                  { value: 'overflow', label: 'Overflow' },
                ] as const).map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => actions.setScaleMode(value)}
                    className={`flex-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                      state.scaleMode === value
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={state.scaleMode === value ? { background: '#0F2B45' } : undefined}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Section>

            {/* 970x250 A/B toggle */}
            <Section title="970x250 Variant">
              <div className="flex gap-1.5">
                {(['A', 'B'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => actions.setActive970Variant(v)}
                    className={`flex-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                      state.active970Variant === v
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={state.active970Variant === v ? { background: '#0F2B45' } : undefined}
                  >
                    Variant {v}
                  </button>
                ))}
              </div>
            </Section>

            {/* Landing page URL */}
            <Section title="Landing Page">
              <input
                type="url"
                placeholder="https://example.com/landing"
                value={state.landingPageUrl}
                onChange={(e) => actions.setLandingPageUrl(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-200 text-xs text-gray-700 focus:outline-none focus:ring-1"
                style={{ focusRingColor: '#56C3E8' } as React.CSSProperties}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#56C3E8')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
              />
              {state.landingPageUrl && (
                <p className="text-[10px] mt-1" style={{ color: '#56C3E8' }}>
                  All ads will link to this URL
                </p>
              )}
            </Section>

            {/* Creative management */}
            <Section title="Creatives">
              <div className="flex flex-col gap-2">
                {CREATIVE_KEYS.map(({ key, label, size }) => (
                  <CreativeUploader
                    key={key}
                    creativeKey={key}
                    label={label}
                    size={size}
                    currentUrl={state.creatives[key]}
                    onUpload={(dataUrl) => actions.setCreative(key, dataUrl)}
                    onClear={() => actions.setCreative(key, undefined)}
                  />
                ))}
              </div>
            </Section>

            {/* Load sample ads */}
            <Section title="Quick Start">
              <button
                onClick={() => {
                  actions.setCreative('160x200', `${BASE}sample-ads/mercedes_160x200.png`);
                  actions.setCreative('300x250', `${BASE}sample-ads/mercedes_300x250.png`);
                  actions.setCreative('300x600', `${BASE}sample-ads/mercedes_300x600.png`);
                  actions.setCreative('320x50', `${BASE}sample-ads/mercedes_320x50.png`);
                  actions.setCreative('728x90', `${BASE}sample-ads/mercedes_728x90.png`);
                  actions.setCreative('970x250_A', `${BASE}sample-ads/mercedes_970x250%20A.png`);
                  actions.setCreative('970x250_B', `${BASE}sample-ads/mercedes_970x250%20B.png`);
                }}
                className="w-full px-3 py-2 rounded text-xs font-medium text-white transition-colors"
                style={{ background: '#56C3E8' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#3AABCF')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#56C3E8')}
              >
                Load Sample Ads
              </button>
              <button
                onClick={() => {
                  CREATIVE_KEYS.forEach(({ key }) => actions.setCreative(key, undefined));
                }}
                className="w-full px-3 py-2 rounded text-xs font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors mt-1.5"
              >
                Clear All Creatives
              </button>
            </Section>
          </>
        ) : (
          /* ── Video & Interactive mode controls ───────────── */
          <>
            {/* View selector: Builder / In-Context / CTV */}
            <Section title="View">
              <div className="flex flex-col gap-1.5">
                {([
                  { value: 'builder', label: 'Ad Builder' },
                  { value: 'in-context', label: 'In-Context Preview' },
                  { value: 'ctv', label: 'CTV Preview' },
                ] as const).map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => actions.setBuilderView(value)}
                    className={`text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                      state.builderView === value
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={state.builderView === value ? { background: '#0F2B45' } : undefined}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Section>

            {/* Builder-specific controls */}
            {state.builderView === 'builder' && (
              <>
                {/* Size selector */}
                <Section title="Ad Size">
                  <div className="flex flex-col gap-1.5">
                    {INTERACTIVE_SIZES.map((size) => {
                      const ad = AD_SIZES[size];
                      const hasConfig = !!state.interactiveAds[size];
                      return (
                        <button
                          key={size}
                          onClick={() => actions.setActiveBuilderSize(size)}
                          className={`text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                            state.activeBuilderSize === size
                              ? 'text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          style={state.activeBuilderSize === size ? { background: '#0F2B45' } : undefined}
                        >
                          <div className="flex items-center justify-between">
                            <span>{size}</span>
                            {hasConfig && (
                              <span
                                className="w-2 h-2 rounded-full inline-block"
                                style={{ background: '#56C3E8' }}
                                title="Has components"
                              />
                            )}
                          </div>
                          <div
                            className="text-[10px]"
                            style={{ color: state.activeBuilderSize === size ? '#56C3E8' : '#9ca3af' }}
                          >
                            {ad.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </Section>

                {/* Background color */}
                <Section title="Canvas Background">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={
                        state.interactiveAds[state.activeBuilderSize]?.backgroundColor ?? '#0F2B45'
                      }
                      onChange={(e) => {
                        const current = state.interactiveAds[state.activeBuilderSize] ?? {
                          size: state.activeBuilderSize,
                          components: [],
                          backgroundColor: '#0F2B45',
                        };
                        actions.setInteractiveAd(state.activeBuilderSize, {
                          ...current,
                          backgroundColor: e.target.value,
                        });
                      }}
                      className="w-7 h-7 rounded border border-gray-200 cursor-pointer p-0"
                    />
                    <span className="text-xs text-gray-500 font-mono">
                      {state.interactiveAds[state.activeBuilderSize]?.backgroundColor ?? '#0F2B45'}
                    </span>
                  </div>
                </Section>
              </>
            )}

            {/* In-context specific controls */}
            {state.builderView === 'in-context' && (
              <>
                <Section title="Template">
                  <div className="flex flex-col gap-1.5">
                    {([
                      { value: 'article', label: 'Article Page' },
                      { value: 'feed', label: 'News Feed' },
                      { value: 'section', label: 'Section Page' },
                    ] as const).map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => actions.setTemplate(value)}
                        className={`text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                          state.template === value
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        style={state.template === value ? { background: '#0F2B45' } : undefined}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </Section>

                <Section title="Viewport">
                  <div className="flex gap-1.5">
                    {VIEWPORT_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => actions.setViewport(preset)}
                        className={`flex-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                          state.viewport.name === preset.name
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        style={state.viewport.name === preset.name ? { background: '#0F2B45' } : undefined}
                      >
                        {preset.name}
                        <div className="text-[10px]" style={{ color: state.viewport.name === preset.name ? '#56C3E8' : '#9ca3af' }}>
                          {preset.width}x{preset.height}
                        </div>
                      </button>
                    ))}
                  </div>
                </Section>

                <Section title="Display">
                  <div className="flex flex-col gap-2">
                    <Toggle label="Slot outlines" checked={state.showOutlines} onChange={actions.toggleOutlines} />
                    <Toggle label="Ad labels" checked={state.showLabels} onChange={actions.toggleLabels} />
                    <Toggle label="Dark mode" checked={state.darkMode} onChange={actions.toggleDarkMode} />
                  </div>
                </Section>
              </>
            )}

            {/* Landing page URL (shared for builder & in-context) */}
            {state.builderView !== 'ctv' && (
              <Section title="Landing Page">
                <input
                  type="url"
                  placeholder="https://example.com/landing"
                  value={state.landingPageUrl}
                  onChange={(e) => actions.setLandingPageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-gray-200 text-xs text-gray-700 focus:outline-none focus:ring-1"
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#56C3E8')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
                {state.landingPageUrl && (
                  <p className="text-[10px] mt-1" style={{ color: '#56C3E8' }}>
                    All ads will link to this URL
                  </p>
                )}
              </Section>
            )}
          </>
        )}
      </div>

      {/* Bottom actions */}
      <div className="p-4 border-t border-gray-200 flex flex-col gap-2">
        <button
          onClick={onClientLink}
          className="w-full px-3 py-2 rounded text-sm font-medium text-white transition-colors"
          style={{ background: '#56C3E8' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#3AABCF')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#56C3E8')}
        >
          Copy Client Preview Link
        </button>
        <button
          onClick={onExport}
          className="w-full px-3 py-2 rounded text-sm font-medium text-white transition-colors"
          style={{ background: '#0F2B45' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#163a5c')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#0F2B45')}
        >
          Export Screenshot
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#0F2B45' }}>{title}</div>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-gray-700">{label}</span>
      <div
        className="relative w-9 h-5 rounded-full transition-colors"
        style={{ background: checked ? '#56C3E8' : '#d1d5db' }}
        onClick={onChange}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </div>
    </label>
  );
}

function CreativeUploader({
  creativeKey,
  label,
  size,
  currentUrl,
  onUpload,
  onClear,
}: {
  creativeKey: CreativeKey;
  label: string;
  size: string;
  currentUrl?: string;
  onUpload: (dataUrl: string) => void;
  onClear: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const adSize = AD_SIZES[size as keyof typeof AD_SIZES];

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpload(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  void creativeKey;

  return (
    <div
      className={`border rounded p-2 ${currentUrl ? 'bg-sky-50' : 'border-gray-200'}`}
      style={currentUrl ? { borderColor: '#56C3E8' } : undefined}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-700">{label}</span>
        <span className="text-[10px] text-gray-400">{adSize?.width}x{adSize?.height}</span>
      </div>
      {currentUrl ? (
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-8 rounded overflow-hidden border border-gray-200"
            style={{
              backgroundImage: `url(${currentUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <span className="text-[10px] flex-1" style={{ color: '#0F2B45' }}>Loaded</span>
          <button
            onClick={onClear}
            className="text-[10px] text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full text-[10px] text-gray-500 py-1 transition-colors"
          style={{ cursor: 'pointer' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#56C3E8')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
        >
          Drop image or click to upload
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
