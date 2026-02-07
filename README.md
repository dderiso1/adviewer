# Ad Placement Previewer

A lightweight web app for previewing static display ads in context, as they would appear in-stream on news sites, article pages, and feeds.

## Supported Ad Sizes

| Size | Label |
|------|-------|
| 160x200 | Small Rectangle |
| 300x250 | Medium Rectangle |
| 300x600 | Half Page |
| 320x50 | Mobile Banner |
| 728x90 | Leaderboard |
| 970x250 | Billboard (A/B variants) |

## Install & Run

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Build

```bash
npm run build
npm run preview   # preview the production build
```

## How to Use

1. **Select a template** — Article Page, News Feed, or Section Page
2. **Choose a viewport** — Mobile (375px), Tablet (768px), or Desktop (1200px)
3. **Upload creatives** — Drag & drop or click to upload images for each ad size
4. **Load samples** — Click "Load Sample Ads" to see pre-loaded creatives
5. **Adjust settings** — Toggle outlines, labels, dark mode, zoom, and scale mode
6. **Export** — Take a PNG screenshot or copy a shareable URL

## Adding New Ad Sizes

Edit `src/types/index.ts`:

1. Add the new size key to the `AdSizeKey` union type
2. Add dimensions to the `AD_SIZES` record
3. Add a creative key entry to `CREATIVE_KEYS`
4. Add the size key to the `Creatives` interface

## Adding New Templates

1. Create a new component in `src/components/templates/`
2. Accept `{ state: AppState; containerWidth: number }` props
3. Use the `<AdSlot>` component to place ads
4. Register the template in `src/types/index.ts` (`TemplateType`)
5. Add the template to the selector in `ControlPanel.tsx`
6. Add the template to the component map in `PreviewArea.tsx`

## Tech Stack

- React + TypeScript (Vite)
- Tailwind CSS v4
- html2canvas (screenshot export)
- No backend — runs entirely in the browser
