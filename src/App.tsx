import { useRef } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { PreviewArea } from './components/PreviewArea';
import { PresentationView } from './components/PresentationView';
import { useAppState } from './hooks/useAppState';
import { exportScreenshot } from './utils/export';
import { saveConfig, generateId } from './utils/storage';

function App() {
  // Check for presentation mode
  const params = new URLSearchParams(window.location.search);
  const presentId = params.get('present');

  if (presentId) {
    return <PresentationView configId={presentId} />;
  }

  return <Editor />;
}

function Editor() {
  const actions = useAppState();
  const previewRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (previewRef.current) {
      await exportScreenshot(previewRef.current);
    }
  };

  const handleClientLink = async () => {
    const id = generateId();
    await saveConfig(id, actions.state);
    const url = `${window.location.origin}${window.location.pathname}?present=${id}`;
    await navigator.clipboard.writeText(url);
    alert('Client preview link copied to clipboard!');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <ControlPanel
        actions={actions}
        onExport={handleExport}
        onClientLink={handleClientLink}
      />
      <PreviewArea ref={previewRef} state={actions.state} />
    </div>
  );
}

export default App;
