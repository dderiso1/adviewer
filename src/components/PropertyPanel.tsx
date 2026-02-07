import { useRef } from 'react';
import type {
  AdComponent,
  VideoComponent,
  GalleryComponent,
  CTAComponent,
  TextComponent,
  ImageComponent,
} from '../types';

interface PropertyPanelProps {
  component: AdComponent | null;
  onUpdate: (updated: AdComponent) => void;
}

export function PropertyPanel({ component, onUpdate }: PropertyPanelProps) {
  if (!component) {
    return (
      <div className="flex items-center justify-center h-full px-6">
        <p className="text-sm text-gray-400 text-center">
          Select a component to edit its properties
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto">
      {/* Component type badge */}
      <div className="flex items-center gap-2">
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white"
          style={{ background: '#0F2B45' }}
        >
          {component.type}
        </span>
        <span className="text-[10px] text-gray-400 font-mono">{component.id}</span>
      </div>

      {/* Position & Size — common to all types */}
      <Section title="Position & Size">
        <div className="grid grid-cols-2 gap-2">
          <NumberField
            label="X"
            value={component.x}
            onChange={(v) => onUpdate({ ...component, x: v })}
          />
          <NumberField
            label="Y"
            value={component.y}
            onChange={(v) => onUpdate({ ...component, y: v })}
          />
          <NumberField
            label="Width"
            value={component.width}
            onChange={(v) => onUpdate({ ...component, width: v })}
          />
          <NumberField
            label="Height"
            value={component.height}
            onChange={(v) => onUpdate({ ...component, height: v })}
          />
        </div>
      </Section>

      {/* Type-specific fields */}
      {component.type === 'video' && (
        <VideoFields component={component} onUpdate={onUpdate} />
      )}
      {component.type === 'gallery' && (
        <GalleryFields component={component} onUpdate={onUpdate} />
      )}
      {component.type === 'cta' && (
        <CTAFields component={component} onUpdate={onUpdate} />
      )}
      {component.type === 'text' && (
        <TextFields component={component} onUpdate={onUpdate} />
      )}
      {component.type === 'image' && (
        <ImageFields component={component} onUpdate={onUpdate} />
      )}
    </div>
  );
}

/* ── Section wrapper ───────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        className="text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color: '#0F2B45' }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

/* ── Reusable field components ─────────────────────────── */

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-600 mb-0.5">{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full text-xs py-1 px-2 rounded border border-gray-200 focus:outline-none focus:ring-1 text-gray-700"
        onFocus={(e) => (e.currentTarget.style.borderColor = '#56C3E8')}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
      />
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-600 mb-0.5">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-xs py-1 px-2 rounded border border-gray-200 focus:outline-none focus:ring-1 text-gray-700"
        onFocus={(e) => (e.currentTarget.style.borderColor = '#56C3E8')}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-600 mb-0.5">{label}</label>
      <textarea
        value={value}
        rows={rows ?? 3}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-xs py-1 px-2 rounded border border-gray-200 focus:outline-none focus:ring-1 text-gray-700 resize-y"
        onFocus={(e) => (e.currentTarget.style.borderColor = '#56C3E8')}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
      />
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-600 mb-0.5">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded border border-gray-200 cursor-pointer p-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 text-xs py-1 px-2 rounded border border-gray-200 focus:outline-none focus:ring-1 text-gray-700 font-mono"
          onFocus={(e) => (e.currentTarget.style.borderColor = '#56C3E8')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
        />
      </div>
    </div>
  );
}

function SelectField<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-600 mb-0.5">{label}</label>
      <select
        value={value}
        onChange={(e) => {
          const raw = e.target.value;
          // If the original value type is number, convert back
          const parsed = typeof value === 'number' ? (Number(raw) as T) : (raw as T);
          onChange(parsed);
        }}
        className="w-full text-xs py-1 px-2 rounded border border-gray-200 focus:outline-none focus:ring-1 text-gray-700 bg-white"
        onFocus={(e) => (e.currentTarget.style.borderColor = '#56C3E8')}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
      >
        {options.map((o) => (
          <option key={String(o.value)} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-3.5 h-3.5 rounded border-gray-300 accent-sky-500"
      />
      <span className="text-xs text-gray-600">{label}</span>
    </label>
  );
}

function FileUploadButton({
  label,
  accept,
  onFile,
}: {
  label: string;
  accept: string;
  onFile: (dataUrl: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onFile(reader.result);
      }
    };
    reader.readAsDataURL(file);
    // Reset so the same file can be re-selected
    e.target.value = '';
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full text-xs py-1.5 px-3 rounded font-medium text-white transition-colors"
        style={{ background: '#56C3E8' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#3AABCF')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#56C3E8')}
      >
        {label}
      </button>
    </>
  );
}

/* ── Type-specific field groups ────────────────────────── */

function VideoFields({
  component,
  onUpdate,
}: {
  component: VideoComponent;
  onUpdate: (updated: AdComponent) => void;
}) {
  return (
    <>
      <Section title="Video Source">
        <div className="flex flex-col gap-2">
          <FileUploadButton
            label="Upload Video File"
            accept="video/*"
            onFile={(dataUrl) => onUpdate({ ...component, videoUrl: dataUrl })}
          />
          {component.videoUrl && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 truncate flex-1">Video loaded</span>
              <button
                onClick={() => onUpdate({ ...component, videoUrl: undefined })}
                className="text-[10px] text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          )}

          <FileUploadButton
            label="Upload Poster Image"
            accept="image/*"
            onFile={(dataUrl) => onUpdate({ ...component, posterUrl: dataUrl })}
          />
          {component.posterUrl && (
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-8 rounded overflow-hidden border border-gray-200"
                style={{
                  backgroundImage: `url(${component.posterUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <span className="text-[10px] text-gray-500 flex-1">Poster loaded</span>
              <button
                onClick={() => onUpdate({ ...component, posterUrl: undefined })}
                className="text-[10px] text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </Section>

      <Section title="Playback">
        <div className="flex flex-col gap-2">
          <CheckboxField
            label="Autoplay"
            checked={component.autoplay}
            onChange={(v) => onUpdate({ ...component, autoplay: v })}
          />
          <CheckboxField
            label="Muted"
            checked={component.muted}
            onChange={(v) => onUpdate({ ...component, muted: v })}
          />
          <CheckboxField
            label="Loop"
            checked={component.loop}
            onChange={(v) => onUpdate({ ...component, loop: v })}
          />
        </div>
      </Section>
    </>
  );
}

function GalleryFields({
  component,
  onUpdate,
}: {
  component: GalleryComponent;
  onUpdate: (updated: AdComponent) => void;
}) {
  const handleRemoveImage = (index: number) => {
    const images = [...component.images];
    images.splice(index, 1);
    onUpdate({ ...component, images });
  };

  return (
    <Section title="Gallery Images">
      <div className="flex flex-col gap-2">
        <FileUploadButton
          label="Add Image"
          accept="image/*"
          onFile={(dataUrl) =>
            onUpdate({ ...component, images: [...component.images, dataUrl] })
          }
        />

        {component.images.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {component.images.map((img, i) => (
              <div key={i} className="relative group">
                <div
                  className="w-10 h-[30px] rounded overflow-hidden border border-gray-200"
                  style={{
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <button
                  onClick={() => handleRemoveImage(i)}
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}

        {component.images.length === 0 && (
          <p className="text-[10px] text-gray-400">No images added yet</p>
        )}
      </div>
    </Section>
  );
}

function CTAFields({
  component,
  onUpdate,
}: {
  component: CTAComponent;
  onUpdate: (updated: AdComponent) => void;
}) {
  return (
    <>
      <Section title="Button Content">
        <div className="flex flex-col gap-2">
          <TextField
            label="Text"
            value={component.text}
            onChange={(v) => onUpdate({ ...component, text: v })}
            placeholder="Click here"
          />
          <TextField
            label="URL"
            value={component.url}
            onChange={(v) => onUpdate({ ...component, url: v })}
            placeholder="https://example.com"
          />
        </div>
      </Section>

      <Section title="Appearance">
        <div className="flex flex-col gap-2">
          <ColorField
            label="Background Color"
            value={component.bgColor}
            onChange={(v) => onUpdate({ ...component, bgColor: v })}
          />
          <ColorField
            label="Text Color"
            value={component.textColor}
            onChange={(v) => onUpdate({ ...component, textColor: v })}
          />
          <NumberField
            label="Border Radius"
            value={component.borderRadius}
            onChange={(v) => onUpdate({ ...component, borderRadius: v })}
            min={0}
          />
          <NumberField
            label="Font Size"
            value={component.fontSize}
            onChange={(v) => onUpdate({ ...component, fontSize: v })}
            min={1}
          />
        </div>
      </Section>
    </>
  );
}

function TextFields({
  component,
  onUpdate,
}: {
  component: TextComponent;
  onUpdate: (updated: AdComponent) => void;
}) {
  const isBgTransparent = component.bgColor === 'transparent';

  return (
    <>
      <Section title="Content">
        <TextAreaField
          label="Text Content"
          value={component.content}
          onChange={(v) => onUpdate({ ...component, content: v })}
          rows={4}
        />
      </Section>

      <Section title="Typography">
        <div className="flex flex-col gap-2">
          <NumberField
            label="Font Size"
            value={component.fontSize}
            onChange={(v) => onUpdate({ ...component, fontSize: v })}
            min={1}
          />
          <SelectField
            label="Font Weight"
            value={component.fontWeight}
            options={[
              { value: 400, label: '400 (Normal)' },
              { value: 500, label: '500 (Medium)' },
              { value: 600, label: '600 (Semi Bold)' },
              { value: 700, label: '700 (Bold)' },
              { value: 800, label: '800 (Extra Bold)' },
            ]}
            onChange={(v) => onUpdate({ ...component, fontWeight: v })}
          />
          <SelectField
            label="Text Align"
            value={component.textAlign}
            options={[
              { value: 'left', label: 'Left' },
              { value: 'center', label: 'Center' },
              { value: 'right', label: 'Right' },
            ]}
            onChange={(v) => onUpdate({ ...component, textAlign: v })}
          />
          <ColorField
            label="Text Color"
            value={component.color}
            onChange={(v) => onUpdate({ ...component, color: v })}
          />
        </div>
      </Section>

      <Section title="Background">
        <div className="flex flex-col gap-2">
          <CheckboxField
            label="Transparent"
            checked={isBgTransparent}
            onChange={(checked) => {
              if (checked) {
                onUpdate({ ...component, bgColor: 'transparent' });
              } else {
                onUpdate({ ...component, bgColor: '#ffffff' });
              }
            }}
          />
          {!isBgTransparent && (
            <ColorField
              label="Background Color"
              value={component.bgColor}
              onChange={(v) => onUpdate({ ...component, bgColor: v })}
            />
          )}
        </div>
      </Section>
    </>
  );
}

function ImageFields({
  component,
  onUpdate,
}: {
  component: ImageComponent;
  onUpdate: (updated: AdComponent) => void;
}) {
  return (
    <>
      <Section title="Image Source">
        <div className="flex flex-col gap-2">
          <FileUploadButton
            label="Upload Image"
            accept="image/*"
            onFile={(dataUrl) => onUpdate({ ...component, imageUrl: dataUrl })}
          />
          {component.imageUrl && (
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-8 rounded overflow-hidden border border-gray-200"
                style={{
                  backgroundImage: `url(${component.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <span className="text-[10px] text-gray-500 flex-1">Image loaded</span>
              <button
                onClick={() => onUpdate({ ...component, imageUrl: undefined })}
                className="text-[10px] text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </Section>

      <Section title="Display">
        <div className="flex flex-col gap-2">
          <SelectField
            label="Object Fit"
            value={component.objectFit}
            options={[
              { value: 'cover', label: 'Cover' },
              { value: 'contain', label: 'Contain' },
              { value: 'fill', label: 'Fill' },
            ]}
            onChange={(v) => onUpdate({ ...component, objectFit: v })}
          />
          <NumberField
            label="Border Radius"
            value={component.borderRadius}
            onChange={(v) => onUpdate({ ...component, borderRadius: v })}
            min={0}
          />
        </div>
      </Section>
    </>
  );
}
