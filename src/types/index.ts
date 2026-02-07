export type AdSizeKey =
  | '160x200'
  | '300x250'
  | '300x600'
  | '320x50'
  | '728x90'
  | '970x250';

export interface AdSize {
  key: AdSizeKey;
  width: number;
  height: number;
  label: string;
}

export const AD_SIZES: Record<AdSizeKey, AdSize> = {
  '160x200': { key: '160x200', width: 160, height: 200, label: 'Small Rectangle' },
  '300x250': { key: '300x250', width: 300, height: 250, label: 'Medium Rectangle' },
  '300x600': { key: '300x600', width: 300, height: 600, label: 'Half Page' },
  '320x50':  { key: '320x50',  width: 320, height: 50,  label: 'Mobile Banner' },
  '728x90':  { key: '728x90',  width: 728, height: 90,  label: 'Leaderboard' },
  '970x250': { key: '970x250', width: 970, height: 250, label: 'Billboard' },
};

export type PlacementType =
  | 'in-article'
  | 'in-feed'
  | 'right-rail'
  | 'sticky'
  | 'top-of-page';

export interface AdSlotConfig {
  id: string;
  size: AdSizeKey;
  placement: PlacementType;
  position: number;
  label: string;
  variant?: 'A' | 'B';
}

export type TemplateType = 'article' | 'feed' | 'section';

export interface ViewportPreset {
  name: string;
  width: number;
  height: number;
}

export const VIEWPORT_PRESETS: ViewportPreset[] = [
  { name: 'Mobile', width: 375, height: 800 },
  { name: 'Tablet', width: 768, height: 900 },
  { name: 'Desktop', width: 1200, height: 900 },
];

export const ZOOM_LEVELS = [50, 75, 100, 125] as const;

export type ScaleMode = 'overflow' | 'scale-to-fit';

export interface Creatives {
  '160x200'?: string;
  '300x250'?: string;
  '300x600'?: string;
  '320x50'?: string;
  '728x90'?: string;
  '970x250_A'?: string;
  '970x250_B'?: string;
}

export type CreativeKey = keyof Creatives;

export const CREATIVE_KEYS: { key: CreativeKey; label: string; size: AdSizeKey }[] = [
  { key: '160x200', label: '160x200', size: '160x200' },
  { key: '300x250', label: '300x250', size: '300x250' },
  { key: '300x600', label: '300x600', size: '300x600' },
  { key: '320x50', label: '320x50', size: '320x50' },
  { key: '728x90', label: '728x90', size: '728x90' },
  { key: '970x250_A', label: '970x250 (A)', size: '970x250' },
  { key: '970x250_B', label: '970x250 (B)', size: '970x250' },
];

// ── Ad mode ──────────────────────────────────────────────

export type AdMode = 'static' | 'video-interactive';

// ── Interactive ad builder types ─────────────────────────

export type ComponentType = 'video' | 'gallery' | 'cta' | 'text' | 'image';

interface BaseComponent {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface VideoComponent extends BaseComponent {
  type: 'video';
  videoUrl?: string;
  posterUrl?: string;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
}

export interface GalleryComponent extends BaseComponent {
  type: 'gallery';
  images: string[];
}

export interface CTAComponent extends BaseComponent {
  type: 'cta';
  text: string;
  url: string;
  bgColor: string;
  textColor: string;
  borderRadius: number;
  fontSize: number;
}

export interface TextComponent extends BaseComponent {
  type: 'text';
  content: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  bgColor: string;
  textAlign: 'left' | 'center' | 'right';
}

export interface ImageComponent extends BaseComponent {
  type: 'image';
  imageUrl?: string;
  objectFit: 'cover' | 'contain' | 'fill';
  borderRadius: number;
}

export type AdComponent =
  | VideoComponent
  | GalleryComponent
  | CTAComponent
  | TextComponent
  | ImageComponent;

export interface InteractiveAdConfig {
  size: AdSizeKey;
  components: AdComponent[];
  backgroundColor: string;
}

export const INTERACTIVE_SIZES: AdSizeKey[] = ['300x250', '300x600', '728x90', '970x250'];

// ── CTV types ────────────────────────────────────────────

export interface CTVConfig {
  videoUrl?: string;
  overlayLogoUrl?: string;
  ctaText: string;
  ctaUrl: string;
  brandName: string;
}

// ── App state ────────────────────────────────────────────

export interface AppState {
  template: TemplateType;
  viewport: ViewportPreset;
  zoom: number;
  showOutlines: boolean;
  showLabels: boolean;
  scaleMode: ScaleMode;
  darkMode: boolean;
  creatives: Creatives;
  active970Variant: 'A' | 'B';
  landingPageUrl: string;
  // Video & Interactive
  adMode: AdMode;
  builderView: 'builder' | 'in-context' | 'ctv';
  activeBuilderSize: AdSizeKey;
  interactiveAds: Partial<Record<AdSizeKey, InteractiveAdConfig>>;
  ctvConfig: CTVConfig;
  selectedComponentId: string | null;
}
