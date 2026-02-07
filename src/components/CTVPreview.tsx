import React, { useRef } from 'react';
import type { CTVConfig } from '../types';

interface CTVPreviewProps {
  config: CTVConfig;
  onUpdateConfig: (config: CTVConfig) => void;
}

const CTVPreview: React.FC<CTVPreviewProps> = ({ config, onUpdateConfig }) => {
  const videoInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    _accept: string,
    field: 'videoUrl' | 'overlayLogoUrl',
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        onUpdateConfig({ ...config, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
      // Reset value so the same file can be re-selected
      e.target.value = '';
    };
  };

  return (
    <div style={styles.wrapper}>
      {/* ── TV Frame ─────────────────────────────────────── */}
      <div style={styles.tvOuter}>
        <div style={styles.tvBezel}>
          {/* ── Screen ─────────────────────────────────── */}
          <div style={styles.screen}>
            {config.videoUrl ? (
              <video
                src={config.videoUrl}
                controls
                autoPlay
                muted
                loop
                style={styles.video}
              />
            ) : (
              <div style={styles.placeholder}>
                <div style={styles.playButton}>
                  <div style={styles.playTriangle} />
                </div>
                <p style={styles.placeholderText}>
                  Upload a video to preview CTV ad
                </p>
              </div>
            )}

            {/* ── Ad Overlay ───────────────────────────── */}
            <div style={styles.overlay}>
              {/* Top-right: Ad badge */}
              <div style={styles.adBadge}>Ad</div>

              {/* Bottom-left: Brand + optional logo */}
              <div style={styles.bottomLeft}>
                <span style={styles.brandName}>{config.brandName}</span>
                {config.overlayLogoUrl && (
                  <img
                    src={config.overlayLogoUrl}
                    alt="Brand logo"
                    style={styles.overlayLogo}
                  />
                )}
              </div>

              {/* Bottom-right: CTA button */}
              <div style={styles.bottomRight}>
                <a
                  href={config.ctaUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.ctaButton}
                >
                  {config.ctaText}
                </a>
              </div>
            </div>
          </div>

          {/* TV brand label */}
          <div style={styles.tvBrandLabel}>Smart TV</div>
        </div>

        {/* Stand */}
        <div style={styles.standContainer}>
          <div style={styles.stand} />
        </div>
      </div>

      {/* ── Upload Controls ──────────────────────────────── */}
      <div style={styles.controls}>
        {/* Hidden file inputs */}
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload('video/*', 'videoUrl')}
        />
        <input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload('image/*', 'overlayLogoUrl')}
        />

        <button
          style={styles.uploadButton}
          onClick={() => videoInputRef.current?.click()}
        >
          Upload Video
        </button>

        <button
          style={styles.uploadButton}
          onClick={() => logoInputRef.current?.click()}
        >
          Upload Logo
        </button>

        <input
          type="text"
          placeholder="Brand Name"
          value={config.brandName}
          onChange={(e) =>
            onUpdateConfig({ ...config, brandName: e.target.value })
          }
          style={styles.textInput}
        />

        <input
          type="text"
          placeholder="CTA Text"
          value={config.ctaText}
          onChange={(e) =>
            onUpdateConfig({ ...config, ctaText: e.target.value })
          }
          style={styles.textInput}
        />

        <input
          type="text"
          placeholder="CTA URL"
          value={config.ctaUrl}
          onChange={(e) =>
            onUpdateConfig({ ...config, ctaUrl: e.target.value })
          }
          style={styles.textInput}
        />
      </div>
    </div>
  );
};

/* ── Styles ──────────────────────────────────────────────── */

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
    padding: 24,
  },

  /* ── TV outer shell (silver edge) ──────────────────────── */
  tvOuter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  /* ── TV bezel ──────────────────────────────────────────── */
  tvBezel: {
    position: 'relative',
    width: 960,
    background: '#1a1a1a',
    border: '2px solid #555',
    borderRadius: 12,
    padding: 20,
    boxSizing: 'border-box',
  },

  /* ── Screen container ──────────────────────────────────── */
  screen: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    overflow: 'hidden',
    borderRadius: 4,
    background: 'linear-gradient(135deg, #0F2B45 0%, #1a4a6e 100%)',
  },

  /* ── Video element ─────────────────────────────────────── */
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },

  /* ── Placeholder (no video) ────────────────────────────── */
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    gap: 16,
  },

  playButton: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    border: '2px solid #fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },

  playTriangle: {
    width: 0,
    height: 0,
    borderTop: '12px solid transparent',
    borderBottom: '12px solid transparent',
    borderLeft: '20px solid #fff',
    marginLeft: 4,
  },

  placeholderText: {
    color: '#ccc',
    fontSize: 14,
    margin: 0,
    fontFamily: 'sans-serif',
  },

  /* ── Ad overlay ────────────────────────────────────────── */
  overlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },

  adBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    background: 'rgba(0, 0, 0, 0.55)',
    color: '#fff',
    fontSize: 11,
    fontFamily: 'sans-serif',
    padding: '2px 8px',
    borderRadius: 4,
    letterSpacing: 0.5,
  },

  bottomLeft: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },

  brandName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 700,
    fontFamily: 'sans-serif',
    textShadow: '0 1px 4px rgba(0,0,0,0.6)',
  },

  overlayLogo: {
    height: 30,
    width: 'auto',
    objectFit: 'contain',
  },

  bottomRight: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },

  ctaButton: {
    display: 'inline-block',
    background: '#56C3E8',
    color: '#fff',
    fontFamily: 'sans-serif',
    fontSize: 14,
    fontWeight: 600,
    padding: '8px 20px',
    borderRadius: 6,
    textDecoration: 'none',
    pointerEvents: 'auto',
    cursor: 'pointer',
    border: 'none',
  },

  /* ── TV brand label ────────────────────────────────────── */
  tvBrandLabel: {
    position: 'absolute',
    bottom: 5,
    right: 24,
    color: '#666',
    fontSize: 10,
    fontFamily: 'sans-serif',
    letterSpacing: 1,
    userSelect: 'none',
  },

  /* ── Stand ─────────────────────────────────────────────── */
  standContainer: {
    display: 'flex',
    justifyContent: 'center',
  },

  stand: {
    width: 180,
    height: 18,
    background: '#1a1a1a',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
    border: '1px solid #555',
    borderTop: 'none',
  },

  /* ── Controls ──────────────────────────────────────────── */
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
  },

  uploadButton: {
    background: '#56C3E8',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: 'sans-serif',
    cursor: 'pointer',
  },

  textInput: {
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 13,
    fontFamily: 'sans-serif',
    outline: 'none',
    minWidth: 120,
    color: '#0F2B45',
  },
};

export default CTVPreview;
