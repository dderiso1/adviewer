import { useRef } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { PreviewArea } from './components/PreviewArea';
import { PresentationView } from './components/PresentationView';
import { AdBuilder } from './components/AdBuilder';
import { PropertyPanel } from './components/PropertyPanel';
import CTVPreview from './components/CTVPreview';
import { useAppState } from './hooks/useAppState';
import { exportScreenshot } from './utils/export';
import { encodeStateForURL } from './utils/storage';
import type { InteractiveAdConfig } from './types';

function App() {
  // Check for presentation mode — URL-encoded state in hash or query
  const params = new URLSearchParams(window.location.search);
  const presentParam = params.get('present');
  const hashData = window.location.hash.slice(1); // remove leading #

  if (presentParam || hashData) {
    return <PresentationView presentParam={presentParam} hashData={hashData} />;
  }

  return <Editor />;
}

function Editor() {
  const actions = useAppState();
  const previewRef = useRef<HTMLDivElement>(null);
  const { state } = actions;

  const handleExport = async () => {
    if (previewRef.current) {
      await exportScreenshot(previewRef.current);
    }
  };

  const handleClientLink = async () => {
    // Encode state into URL hash — works cross-device, no backend needed
    const compressed = encodeStateForURL(actions.state);
    const url = `${window.location.origin}${window.location.pathname}#${compressed}`;
    await navigator.clipboard.writeText(url);
    alert('Client preview link copied to clipboard!');
  };

  const isBuilderMode =
    state.adMode === 'video-interactive' && state.builderView === 'builder';
  const isCTVMode =
    state.adMode === 'video-interactive' && state.builderView === 'ctv';

  // Get or create the interactive ad config for the active builder size
  const activeConfig: InteractiveAdConfig = state.interactiveAds[state.activeBuilderSize] ?? {
    size: state.activeBuilderSize,
    components: [],
    backgroundColor: '#0F2B45',
  };

  const selectedComponent = activeConfig.components.find(
    (c) => c.id === state.selectedComponentId
  ) ?? null;

  return (
    <div className="flex h-screen overflow-hidden">
      <ControlPanel
        actions={actions}
        onExport={handleExport}
        onClientLink={handleClientLink}
      />

      {isBuilderMode ? (
        <>
          <div className="flex-1 overflow-auto bg-gray-100 flex items-start justify-center p-6">
            <AdBuilder
              config={activeConfig}
              size={state.activeBuilderSize}
              selectedId={state.selectedComponentId}
              onSelectComponent={actions.setSelectedComponentId}
              onUpdateConfig={(config) =>
                actions.setInteractiveAd(state.activeBuilderSize, config)
              }
            />
          </div>
          <div className="w-64 shrink-0 bg-white border-l border-gray-200 overflow-y-auto h-screen">
            <div className="p-3 border-b border-gray-200">
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#0F2B45' }}>
                Properties
              </div>
            </div>
            <PropertyPanel
              component={selectedComponent}
              onUpdate={(updated) =>
                actions.updateComponent(state.activeBuilderSize, updated)
              }
            />
          </div>
        </>
      ) : isCTVMode ? (
        <div className="flex-1 overflow-auto bg-gray-100 flex items-start justify-center p-6">
          <CTVPreview
            config={state.ctvConfig}
            onUpdateConfig={actions.setCTVConfig}
          />
        </div>
      ) : (
        <PreviewArea ref={previewRef} state={state} />
      )}
    </div>
  );
}

export default App;
