import React, { useState } from 'react';
import DependencyGraph from './DependencyGraph';

function App() {
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        setJsonData(data);
        setError(null);
      } catch (err) {
        setError('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Show a warning if running in the browser (not Electron) about health check limitation
  const isElectron = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('electron');

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>SBOM Dependency Graph Viewer</h1>
      <input type="file" accept="application/json" onChange={handleFileChange} />
      <div style={{ fontSize: 14, margin: '8px 0 16px 0', color: '#555' }}>
        <b>Tip:</b> You can generate an SPDX SBOM file for your repository on GitHub by going to <b>Insights &rarr; Dependency graph</b> and clicking the <b>Export SBOM</b> button.
      </div>
      {!isElectron && (
        <div style={{ color: '#b8860b', background: '#fffbe6', border: '1px solid #ffe58f', padding: 12, margin: '16px 0', borderRadius: 4 }}>
          <b>Note:</b> Dependency health check only works in the Electron (desktop) app. In the browser, health status will not be available due to security restrictions.
        </div>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {jsonData && <DependencyGraph data={jsonData} />}
      {!jsonData && <p>Upload an SPDX JSON file to visualize dependencies.</p>}
    </div>
  );
}

export default App;
