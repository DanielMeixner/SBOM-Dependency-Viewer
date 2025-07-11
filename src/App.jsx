import React, { useState } from 'react';
import DependencyGraph from './DependencyGraph';
import { useTheme } from './useTheme.jsx';

function App() {
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);
  const { theme, toggleTheme, colors } = useTheme();

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
    <div style={{ 
      padding: 24, 
      fontFamily: 'sans-serif',
      backgroundColor: colors.background,
      color: colors.text,
      minHeight: '100vh'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 16
      }}>
        <h1 style={{ margin: 0, color: colors.text }}>SBOM Dependency Graph Viewer</h1>
        <button 
          onClick={toggleTheme}
          style={{
            padding: '8px 16px',
            backgroundColor: colors.primary,
            color: '#ffffff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </div>
      
      <input type="file" accept="application/json" onChange={handleFileChange} />
      
      <div style={{ 
        fontSize: 14, 
        margin: '8px 0 16px 0', 
        color: colors.textMuted 
      }}>
        <b>Tip:</b> You can generate an SPDX SBOM file for your repository on GitHub by going to <b>Insights &rarr; Dependency graph</b> and clicking the <b>Export SBOM</b> button.
      </div>
      
      {!isElectron && (
        <div style={{ 
          color: colors.warning, 
          background: colors.warningBackground, 
          border: `1px solid ${colors.warningBorder}`, 
          padding: 12, 
          margin: '16px 0', 
          borderRadius: 4 
        }}>
          <b>Note:</b> Dependency health check only works in the Electron (desktop) app. In the browser, health status will not be available due to security restrictions.
        </div>
      )}
      
      {error && <div style={{ color: colors.error }}>{error}</div>}
      {jsonData && <DependencyGraph data={jsonData} />}
      {!jsonData && <p style={{ color: colors.textMuted }}>Upload an SPDX JSON file to visualize dependencies.</p>}
    </div>
  );
}

export default App;
