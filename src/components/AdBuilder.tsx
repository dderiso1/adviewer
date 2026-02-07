import { useState, useRef, useCallback, useEffect } from 'react';
import type {
  AdComponent,
  AdSizeKey,
  InteractiveAdConfig,
  ComponentType,
  VideoComponent,
  GalleryComponent,
  CTAComponent,
  TextComponent,
  ImageComponent,
} from '../types';
import { AD_SIZES } from '../types';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface AdBuilderProps {
  config: InteractiveAdConfig;
  size: AdSizeKey;
  selectedId: string | null;
  onSelectComponent: (id: string | null) => void;
  onUpdateConfig: (config: InteractiveAdConfig) => void;
}

/* ------------------------------------------------------------------ */
/*  Defaults for new components                                        */
/* ------------------------------------------------------------------ */

function createDefaultComponent(
  type: ComponentType,
  canvasW: number,
  canvasH: number,
): AdComponent {
  const id = crypto.randomUUID();

  const base = { id };

  switch (type) {
    case 'video': {
      const w = 200;
      const h = 120;
      return {
        ...base,
        type: 'video',
        x: Math.round((canvasW - w) / 2),
        y: Math.round((canvasH - h) / 2),
        width: w,
        height: h,
        autoplay: false,
        muted: true,
        loop: false,
      } as VideoComponent;
    }
    case 'gallery': {
      const w = 120;
      const h = 80;
      return {
        ...base,
        type: 'gallery',
        x: Math.round((canvasW - w) / 2),
        y: Math.round((canvasH - h) / 2),
        width: w,
        height: h,
        images: [],
      } as GalleryComponent;
    }
    case 'cta': {
      const w = 200;
      const h = 40;
      return {
        ...base,
        type: 'cta',
        x: Math.round((canvasW - w) / 2),
        y: Math.round((canvasH - h) / 2),
        width: w,
        height: h,
        text: 'Learn More',
        url: '',
        bgColor: '#56C3E8',
        textColor: '#ffffff',
        borderRadius: 4,
        fontSize: 14,
      } as CTAComponent;
    }
    case 'text': {
      const w = 120;
      const h = 80;
      return {
        ...base,
        type: 'text',
        x: Math.round((canvasW - w) / 2),
        y: Math.round((canvasH - h) / 2),
        width: w,
        height: h,
        content: 'Text',
        fontSize: 16,
        fontWeight: 600,
        color: '#ffffff',
        bgColor: 'transparent',
        textAlign: 'center',
      } as TextComponent;
    }
    case 'image': {
      const w = 120;
      const h = 80;
      return {
        ...base,
        type: 'image',
        x: Math.round((canvasW - w) / 2),
        y: Math.round((canvasH - h) / 2),
        width: w,
        height: h,
        objectFit: 'cover',
        borderRadius: 0,
      } as ImageComponent;
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Drag state types                                                   */
/* ------------------------------------------------------------------ */

interface DragMoveState {
  kind: 'move';
  componentId: string;
  startMouseX: number;
  startMouseY: number;
  startCompX: number;
  startCompY: number;
}

type ResizeCorner = 'nw' | 'ne' | 'sw' | 'se';

interface DragResizeState {
  kind: 'resize';
  componentId: string;
  corner: ResizeCorner;
  startMouseX: number;
  startMouseY: number;
  startX: number;
  startY: number;
  startW: number;
  startH: number;
}

type DragState = DragMoveState | DragResizeState;

/* ------------------------------------------------------------------ */
/*  Gallery sub-component (internal)                                   */
/* ------------------------------------------------------------------ */

function GalleryRenderer({ comp }: { comp: GalleryComponent }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasPrev = comp.images.length > 1;
  const hasNext = comp.images.length > 1;

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i - 1 + comp.images.length) % comp.images.length);
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i + 1) % comp.images.length);
  };

  if (comp.images.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#2d2d44',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#a0a0b8',
          fontSize: 12,
          userSelect: 'none',
        }}
      >
        {/* Grid icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ marginBottom: 4 }}
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
        Gallery
      </div>
    );
  }

  const safeIndex = currentIndex % comp.images.length;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <img
        src={comp.images[safeIndex]}
        alt={`Gallery slide ${safeIndex + 1}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        draggable={false}
      />
      {hasPrev && (
        <button
          onClick={goPrev}
          style={{
            position: 'absolute',
            left: 2,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 20,
            height: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            lineHeight: 1,
            padding: 0,
          }}
        >
          &#8249;
        </button>
      )}
      {hasNext && (
        <button
          onClick={goNext}
          style={{
            position: 'absolute',
            right: 2,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 20,
            height: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            lineHeight: 1,
            padding: 0,
          }}
        >
          &#8250;
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function AdBuilder({
  config,
  size,
  selectedId,
  onSelectComponent,
  onUpdateConfig,
}: AdBuilderProps) {
  const adSize = AD_SIZES[size];
  const canvasRef = useRef<HTMLDivElement>(null);

  /* ---- Drag / resize ref state ---- */

  const dragRef = useRef<DragState | null>(null);
  const liveComponentsRef = useRef<AdComponent[]>(config.components);

  // Keep the live ref in sync when config changes externally
  useEffect(() => {
    if (!dragRef.current) {
      liveComponentsRef.current = config.components;
    }
  }, [config.components]);

  /* ---- Helpers ---- */

  const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(max, val));

  const updateComponentInList = useCallback(
    (components: AdComponent[], id: string, patch: Partial<AdComponent>): AdComponent[] =>
      components.map((c) => (c.id === id ? ({ ...c, ...patch } as AdComponent) : c)),
    [],
  );

  /* ---- Global mouse handlers (attached on drag start) ---- */

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const state = dragRef.current;
      if (!state) return;

      if (state.kind === 'move') {
        const dx = e.clientX - state.startMouseX;
        const dy = e.clientY - state.startMouseY;
        const comp = liveComponentsRef.current.find((c) => c.id === state.componentId);
        if (!comp) return;

        const newX = clamp(state.startCompX + dx, 0, adSize.width - comp.width);
        const newY = clamp(state.startCompY + dy, 0, adSize.height - comp.height);

        liveComponentsRef.current = updateComponentInList(
          liveComponentsRef.current,
          state.componentId,
          { x: newX, y: newY },
        );

        // Update the DOM element directly for smooth dragging
        const el = document.getElementById(`adcomp-${state.componentId}`);
        if (el) {
          el.style.left = `${newX}px`;
          el.style.top = `${newY}px`;
        }
      }

      if (state.kind === 'resize') {
        const dx = e.clientX - state.startMouseX;
        const dy = e.clientY - state.startMouseY;

        let newX = state.startX;
        let newY = state.startY;
        let newW = state.startW;
        let newH = state.startH;

        switch (state.corner) {
          case 'se':
            newW = Math.max(20, state.startW + dx);
            newH = Math.max(20, state.startH + dy);
            break;
          case 'sw':
            newW = Math.max(20, state.startW - dx);
            newH = Math.max(20, state.startH + dy);
            newX = state.startX + state.startW - newW;
            break;
          case 'ne':
            newW = Math.max(20, state.startW + dx);
            newH = Math.max(20, state.startH - dy);
            newY = state.startY + state.startH - newH;
            break;
          case 'nw':
            newW = Math.max(20, state.startW - dx);
            newH = Math.max(20, state.startH - dy);
            newX = state.startX + state.startW - newW;
            newY = state.startY + state.startH - newH;
            break;
        }

        // Clamp within canvas
        newX = clamp(newX, 0, adSize.width - 20);
        newY = clamp(newY, 0, adSize.height - 20);
        newW = Math.min(newW, adSize.width - newX);
        newH = Math.min(newH, adSize.height - newY);

        liveComponentsRef.current = updateComponentInList(
          liveComponentsRef.current,
          state.componentId,
          { x: newX, y: newY, width: newW, height: newH },
        );

        const el = document.getElementById(`adcomp-${state.componentId}`);
        if (el) {
          el.style.left = `${newX}px`;
          el.style.top = `${newY}px`;
          el.style.width = `${newW}px`;
          el.style.height = `${newH}px`;
        }
      }
    },
    [adSize.width, adSize.height, updateComponentInList],
  );

  const handleMouseUp = useCallback(() => {
    if (dragRef.current) {
      // Commit final position / size to parent state
      onUpdateConfig({
        ...config,
        components: liveComponentsRef.current,
      });
      dragRef.current = null;
    }
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [config, onUpdateConfig, handleMouseMove]);

  /* ---- Start move ---- */

  const startMove = useCallback(
    (e: React.MouseEvent, comp: AdComponent) => {
      e.stopPropagation();
      onSelectComponent(comp.id);

      dragRef.current = {
        kind: 'move',
        componentId: comp.id,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startCompX: comp.x,
        startCompY: comp.y,
      };
      liveComponentsRef.current = config.components;

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [config.components, onSelectComponent, handleMouseMove, handleMouseUp],
  );

  /* ---- Start resize ---- */

  const startResize = useCallback(
    (e: React.MouseEvent, comp: AdComponent, corner: ResizeCorner) => {
      e.stopPropagation();
      e.preventDefault();

      dragRef.current = {
        kind: 'resize',
        componentId: comp.id,
        corner,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startX: comp.x,
        startY: comp.y,
        startW: comp.width,
        startH: comp.height,
      };
      liveComponentsRef.current = config.components;

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [config.components, handleMouseMove, handleMouseUp],
  );

  /* ---- Add component ---- */

  const addComponent = useCallback(
    (type: ComponentType) => {
      const comp = createDefaultComponent(type, adSize.width, adSize.height);
      onUpdateConfig({
        ...config,
        components: [...config.components, comp],
      });
      onSelectComponent(comp.id);
    },
    [config, adSize.width, adSize.height, onUpdateConfig, onSelectComponent],
  );

  /* ---- Delete selected ---- */

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    onUpdateConfig({
      ...config,
      components: config.components.filter((c) => c.id !== selectedId),
    });
    onSelectComponent(null);
  }, [config, selectedId, onUpdateConfig, onSelectComponent]);

  /* ---- Canvas click (deselect) ---- */

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current) {
        onSelectComponent(null);
      }
    },
    [onSelectComponent],
  );

  /* ---- Render component content ---- */

  const renderComponentContent = (comp: AdComponent) => {
    switch (comp.type) {
      case 'video': {
        const vc = comp as VideoComponent;
        if (vc.videoUrl) {
          return (
            <video
              src={vc.videoUrl}
              poster={vc.posterUrl}
              autoPlay={vc.autoplay}
              muted={vc.muted}
              loop={vc.loop}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          );
        }
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#1a1a2e',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#a0a0b8',
              fontSize: 12,
              userSelect: 'none',
            }}
          >
            {/* Play button triangle */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ marginBottom: 4 }}
            >
              <polygon points="6,3 20,12 6,21" />
            </svg>
            Video
          </div>
        );
      }

      case 'gallery':
        return <GalleryRenderer comp={comp as GalleryComponent} />;

      case 'cta': {
        const cc = comp as CTAComponent;
        return (
          <button
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: cc.bgColor,
              color: cc.textColor,
              border: 'none',
              borderRadius: cc.borderRadius,
              fontSize: cc.fontSize,
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              padding: 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {cc.text}
          </button>
        );
      }

      case 'text': {
        const tc = comp as TextComponent;
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              fontSize: tc.fontSize,
              fontWeight: tc.fontWeight,
              color: tc.color,
              backgroundColor: tc.bgColor,
              textAlign: tc.textAlign,
              display: 'flex',
              alignItems: 'center',
              justifyContent:
                tc.textAlign === 'center'
                  ? 'center'
                  : tc.textAlign === 'right'
                    ? 'flex-end'
                    : 'flex-start',
              overflow: 'hidden',
              userSelect: 'none',
              padding: 4,
              boxSizing: 'border-box',
            }}
          >
            {tc.content}
          </div>
        );
      }

      case 'image': {
        const ic = comp as ImageComponent;
        if (ic.imageUrl) {
          return (
            <img
              src={ic.imageUrl}
              alt="Ad image"
              style={{
                width: '100%',
                height: '100%',
                objectFit: ic.objectFit,
                borderRadius: ic.borderRadius,
                display: 'block',
              }}
              draggable={false}
            />
          );
        }
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#2d2d44',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#a0a0b8',
              fontSize: 12,
              borderRadius: ic.borderRadius,
              userSelect: 'none',
            }}
          >
            {/* Image placeholder icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ marginBottom: 4 }}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Image
          </div>
        );
      }
    }
  };

  /* ---- Resize handles ---- */

  const renderResizeHandles = (comp: AdComponent) => {
    const HANDLE_SIZE = 8;
    const HALF = HANDLE_SIZE / 2;

    const corners: { corner: ResizeCorner; style: React.CSSProperties }[] = [
      {
        corner: 'nw',
        style: { top: -HALF, left: -HALF, cursor: 'nwse-resize' },
      },
      {
        corner: 'ne',
        style: { top: -HALF, right: -HALF, cursor: 'nesw-resize' },
      },
      {
        corner: 'sw',
        style: { bottom: -HALF, left: -HALF, cursor: 'nesw-resize' },
      },
      {
        corner: 'se',
        style: { bottom: -HALF, right: -HALF, cursor: 'nwse-resize' },
      },
    ];

    return corners.map(({ corner, style }) => (
      <div
        key={corner}
        onMouseDown={(e) => startResize(e, comp, corner)}
        style={{
          position: 'absolute',
          width: HANDLE_SIZE,
          height: HANDLE_SIZE,
          backgroundColor: '#56C3E8',
          border: '1px solid #fff',
          boxSizing: 'border-box',
          zIndex: 10,
          ...style,
        }}
      />
    ));
  };

  /* ---- Palette button config ---- */

  const paletteItems: { type: ComponentType; label: string }[] = [
    { type: 'video', label: 'Video' },
    { type: 'gallery', label: 'Gallery' },
    { type: 'cta', label: 'CTA' },
    { type: 'text', label: 'Text' },
    { type: 'image', label: 'Image' },
  ];

  /* ---- Render ---- */

  return (
    <div>
      {/* Component palette bar */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {paletteItems.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => addComponent(type)}
            className="px-3 py-1.5 text-xs font-medium text-white rounded transition-colors hover:opacity-90"
            style={{ backgroundColor: '#0F2B45' }}
          >
            {label}
          </button>
        ))}

        {selectedId && (
          <button
            onClick={deleteSelected}
            className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors ml-auto"
          >
            Delete
          </button>
        )}
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{
          position: 'relative',
          width: adSize.width,
          height: adSize.height,
          backgroundColor: config.backgroundColor,
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxSizing: 'content-box',
        }}
      >
        {config.components.map((comp) => {
          const isSelected = comp.id === selectedId;

          return (
            <div
              key={comp.id}
              id={`adcomp-${comp.id}`}
              onMouseDown={(e) => startMove(e, comp)}
              style={{
                position: 'absolute',
                left: comp.x,
                top: comp.y,
                width: comp.width,
                height: comp.height,
                outline: isSelected ? '2px solid #56C3E8' : 'none',
                outlineOffset: isSelected ? -1 : 0,
                cursor: 'move',
                overflow: 'hidden',
                boxSizing: 'border-box',
              }}
            >
              {renderComponentContent(comp)}
              {isSelected && renderResizeHandles(comp)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
