import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  light: {
    background: '#ffffff',
    foreground: '#000000',
    cardBackground: '#ffffff',
    border: '#ccc',
    borderLight: '#e0e0e0',
    text: '#000000',
    textMuted: '#555555',
    textLight: '#666666',
    primary: '#007bff',
    warning: '#b8860b',
    warningBackground: '#fffbe6',
    warningBorder: '#ffe58f',
    error: '#dc3545',
    success: '#28a745',
    nodeHealthy: '#90ee90',
    nodeVulnerable: '#ffb3b3',
    nodeOutdated: '#ffe066',
    nodeBorder: '#888888',
  },
  dark: {
    background: '#1a1a1a',
    foreground: '#ffffff',
    cardBackground: '#2d2d2d',
    border: '#444444',
    borderLight: '#555555',
    text: '#ffffff',
    textMuted: '#cccccc',
    textLight: '#aaaaaa',
    primary: '#0ea5e9',
    warning: '#fbbf24',
    warningBackground: '#2d2a1a',
    warningBorder: '#3d3525',
    error: '#ef4444',
    success: '#10b981',
    nodeHealthy: '#4ade80',
    nodeVulnerable: '#f87171',
    nodeOutdated: '#fbbf24',
    nodeBorder: '#6b7280',
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('sbomdepsviewer-theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    localStorage.setItem('sbomdepsviewer-theme', theme);
    // Update body background for consistency
    document.body.style.backgroundColor = themes[theme].background;
    document.body.style.color = themes[theme].text;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};