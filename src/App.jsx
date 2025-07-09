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

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Dependency Graph Viewer</h1>
      <input type="file" accept="application/json" onChange={handleFileChange} />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {jsonData && <DependencyGraph data={jsonData} />}
      {!jsonData && <p>Upload an SPDX JSON file to visualize dependencies.</p>}
    </div>
  );
}

export default App;
