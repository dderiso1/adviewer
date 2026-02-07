import type { AdSizeKey, ScaleMode, CreativeKey, Creatives } from '../types';
import { AD_SIZES } from '../types';

interface AdSlotProps {
  size: AdSizeKey;
  variant?: 'A' | 'B';
  active970Variant?: 'A' | 'B';
  label?: string;
  showOutline: boolean;
  showLabel: boolean;
  scaleMode: ScaleMode;
  creatives: Creatives;
  containerWidth?: number;
}

function getCreativeKey(size: AdSizeKey, variant?: 'A' | 'B', active970Variant?: 'A' | 'B'): CreativeKey {
  if (size === '970x250') {
    const v = variant ?? active970Variant ?? 'A';
    return `970x250_${v}` as CreativeKey;
  }
  return size as CreativeKey;
}

export function AdSlot({
  size,
  variant,
  active970Variant,
  label = 'Advertisement',
  showOutline,
  showLabel,
  scaleMode,
  creatives,
  containerWidth,
}: AdSlotProps) {
  const adSize = AD_SIZES[size];
  const creativeKey = getCreativeKey(size, variant, active970Variant);
  const imageUrl = creatives[creativeKey];

  const needsScaling =
    scaleMode === 'scale-to-fit' &&
    containerWidth !== undefined &&
    containerWidth < adSize.width;

  const scale = needsScaling ? containerWidth / adSize.width : 1;

  const displayWidth = adSize.width;
  const displayHeight = adSize.height;

  return (
    <div className="my-4 flex flex-col items-center" style={{ maxWidth: '100%' }}>
      {showLabel && (
        <div className="ad-label mb-1 text-center">{label}</div>
      )}
      <div
        style={{
          width: scaleMode === 'scale-to-fit' ? '100%' : undefined,
          maxWidth: scaleMode === 'scale-to-fit' ? displayWidth : undefined,
          overflowX: scaleMode === 'overflow' ? 'auto' : 'hidden',
        }}
      >
        <div
          style={{
            width: displayWidth,
            height: displayHeight,
            transform: needsScaling ? `scale(${scale})` : undefined,
            transformOrigin: 'top left',
            marginBottom: needsScaling ? -(displayHeight * (1 - scale)) : undefined,
            marginRight: needsScaling ? -(displayWidth * (1 - scale)) : undefined,
            border: showOutline ? '2px dashed #56C3E8' : undefined,
            position: 'relative',
            boxSizing: 'border-box',
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`Ad ${size}`}
              style={{
                width: displayWidth,
                height: displayHeight,
                objectFit: 'fill',
                display: 'block',
              }}
            />
          ) : (
            <Placeholder
              width={displayWidth}
              height={displayHeight}
              sizeLabel={size}
              variant={size === '970x250' ? (variant ?? active970Variant) : undefined}
            />
          )}
          {showOutline && (
            <div
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                background: 'rgba(15,43,69,0.85)',
                color: 'white',
                fontSize: 9,
                padding: '1px 5px',
                borderRadius: 3,
                fontFamily: 'monospace',
              }}
            >
              {size}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Placeholder({
  width,
  height,
  sizeLabel,
  variant,
}: {
  width: number;
  height: number;
  sizeLabel: string;
  variant?: 'A' | 'B';
}) {
  return (
    <div
      style={{
        width,
        height,
        background: 'linear-gradient(135deg, #0F2B45 0%, #1a4a6e 50%, #56C3E8 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div style={{ fontSize: Math.max(12, Math.min(width / 8, 28)), fontWeight: 700, opacity: 0.9 }}>
        {sizeLabel}
      </div>
      {variant && (
        <div
          style={{
            marginTop: 6,
            fontSize: Math.max(10, Math.min(width / 12, 18)),
            background: 'rgba(255,255,255,0.25)',
            padding: '2px 10px',
            borderRadius: 4,
            fontWeight: 600,
          }}
        >
          Variant {variant}
        </div>
      )}
      <div style={{ fontSize: Math.max(8, Math.min(width / 16, 12)), marginTop: 4, opacity: 0.7 }}>
        Ad Placeholder
      </div>
    </div>
  );
}
