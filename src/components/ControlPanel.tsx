import { useRef } from 'react';
import type { AppActions } from '../hooks/useAppState';
import { VIEWPORT_PRESETS, ZOOM_LEVELS, CREATIVE_KEYS, AD_SIZES } from '../types';
import type { CreativeKey } from '../types';

const BASE = import.meta.env.BASE_URL;

interface ControlPanelProps {
  actions: AppActions;
  onExport: () => void;
  onClientLink: () => void;
}

export function ControlPanel({ actions, onExport, onClientLink }: ControlPanelProps) {
  const { state } = actions;

  return (
    <div className="w-72 shrink-0 bg-white border-r border-gray-200 overflow-y-auto h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-base font-bold text-gray-900">Ad Placement Previewer</h1>
        <p className="text-xs text-gray-500 mt-0.5">Preview ads in realistic page layouts</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
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
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
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
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {preset.name}
                <div className={`text-[10px] ${state.viewport.name === preset.name ? 'text-blue-200' : 'text-gray-400'}`}>
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
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
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
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
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
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Variant {v}
              </button>
            ))}
          </div>
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
              actions.setCreative('970x250_A', `${BASE}sample-ads/mercedes_970x250 A.png`);
              actions.setCreative('970x250_B', `${BASE}sample-ads/mercedes_970x250 B.png`);
            }}
            className="w-full px-3 py-2 rounded text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
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
      </div>

      {/* Bottom actions */}
      <div className="p-4 border-t border-gray-200 flex flex-col gap-2">
        <button
          onClick={onClientLink}
          className="w-full px-3 py-2 rounded text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          Copy Client Preview Link
        </button>
        <button
          onClick={onExport}
          className="w-full px-3 py-2 rounded text-sm font-medium bg-gray-700 text-white hover:bg-gray-800 transition-colors"
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
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</div>
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
        className={`relative w-9 h-5 rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-300'
        }`}
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
      className={`border rounded p-2 ${currentUrl ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}
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
          <span className="text-[10px] text-green-700 flex-1">Loaded</span>
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
          className="w-full text-[10px] text-gray-500 py-1 hover:text-blue-600 transition-colors"
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
