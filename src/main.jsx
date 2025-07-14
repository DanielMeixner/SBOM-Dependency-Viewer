import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './useTheme.jsx';
import { FontSizeProvider } from './useFontSize.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <FontSizeProvider>
        <App />
      </FontSizeProvider>
    </ThemeProvider>
  </React.StrictMode>
);
