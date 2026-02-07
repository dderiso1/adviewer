import { useState } from 'react';
import type { InteractiveAdConfig, AdComponent, AdSizeKey } from '../types';
import { AD_SIZES } from '../types';

interface InteractiveAdRendererProps {
  config: InteractiveAdConfig;
  size: AdSizeKey;
  landingPageUrl?: string;
}

/** Read-only renderer for interactive ads — used in template previews */
export function InteractiveAdRenderer({ config, size, landingPageUrl }: InteractiveAdRendererProps) {
  const adSize = AD_SIZES[size];

  return (
    <div
      style={{
        width: adSize.width,
        height: adSize.height,
        position: 'relative',
        overflow: 'hidden',
        background: config.backgroundColor || '#0F2B45',
      }}
    >
      {config.components.map((comp) => (
        <ComponentRenderer key={comp.id} component={comp} landingPageUrl={landingPageUrl} />
      ))}
      {config.components.length === 0 && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.5)',
            fontSize: 14,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          <div style={{ fontSize: 24, marginBottom: 8 }}>Interactive Ad</div>
          <div>{size}</div>
        </div>
      )}
    </div>
  );
}

function ComponentRenderer({ component: c, landingPageUrl }: { component: AdComponent; landingPageUrl?: string }) {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: c.x,
    top: c.y,
    width: c.width,
    height: c.height,
    overflow: 'hidden',
  };

  const wrapLink = (el: React.ReactElement) => {
    if (landingPageUrl) {
      return <a href={landingPageUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none' }}>{el}</a>;
    }
    return el;
  };

  switch (c.type) {
    case 'video':
      return (
        <div style={baseStyle}>
          {c.videoUrl ? (
            <video
              src={c.videoUrl}
              poster={c.posterUrl}
              autoPlay={c.autoplay}
              muted={c.muted}
              loop={c.loop}
              controls
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: '#1a1a2e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 12,
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>&#9654;</div>
                Video
              </div>
            </div>
          )}
        </div>
      );

    case 'gallery':
      return <GalleryRenderer component={c} style={baseStyle} />;

    case 'cta':
      return wrapLink(
        <div style={baseStyle}>
          <button
            style={{
              width: '100%',
              height: '100%',
              background: c.bgColor,
              color: c.textColor,
              border: 'none',
              borderRadius: c.borderRadius,
              fontSize: c.fontSize,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          >
            {c.text}
          </button>
        </div>
      );

    case 'text':
      return (
        <div
          style={{
            ...baseStyle,
            color: c.color,
            background: c.bgColor,
            fontSize: c.fontSize,
            fontWeight: c.fontWeight,
            textAlign: c.textAlign,
            display: 'flex',
            alignItems: 'center',
            justifyContent: c.textAlign === 'center' ? 'center' : c.textAlign === 'right' ? 'flex-end' : 'flex-start',
            padding: 4,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            lineHeight: 1.3,
            wordBreak: 'break-word',
          }}
        >
          {c.content}
        </div>
      );

    case 'image':
      return (
        <div style={{ ...baseStyle, borderRadius: c.borderRadius }}>
          {c.imageUrl ? (
            <img
              src={c.imageUrl}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: c.objectFit,
                borderRadius: c.borderRadius,
                display: 'block',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: '#2d3748',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.4)',
                fontSize: 11,
                borderRadius: c.borderRadius,
              }}
            >
              Image
            </div>
          )}
        </div>
      );
  }
}

function GalleryRenderer({ component: c, style }: { component: AdComponent & { type: 'gallery' }; style: React.CSSProperties }) {
  const [idx, setIdx] = useState(0);
  const images = c.images;

  return (
    <div style={style}>
      {images.length > 0 ? (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <img
            src={images[idx % images.length]}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={() => setIdx(i => (i - 1 + images.length) % images.length)}
                style={{
                  position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none',
                  borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', fontSize: 12,
                }}
              >
                &#8249;
              </button>
              <button
                onClick={() => setIdx(i => (i + 1) % images.length)}
                style={{
                  position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none',
                  borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', fontSize: 12,
                }}
              >
                &#8250;
              </button>
              <div style={{
                position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: 9, padding: '1px 6px', borderRadius: 8,
              }}>
                {(idx % images.length) + 1}/{images.length}
              </div>
            </>
          )}
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#2d3748',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.4)',
            fontSize: 11,
          }}
        >
          Gallery
        </div>
      )}
    </div>
  );
}
