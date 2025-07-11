import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  light: {
    // Base colors
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    backgroundSolid: '#f8fafc',
    foreground: '#1e293b',
    
    // Glass effect colors
    glassBackground: 'rgba(255, 255, 255, 0.25)',
    glassBorder: 'rgba(255, 255, 255, 0.3)',
    glassAccent: 'rgba(255, 255, 255, 0.1)',
    
    // Card and surface colors
    cardBackground: 'rgba(255, 255, 255, 0.4)',
    cardBorder: 'rgba(255, 255, 255, 0.2)',
    surfaceBackground: 'rgba(255, 255, 255, 0.6)',
    
    // Border colors
    border: 'rgba(148, 163, 184, 0.3)',
    borderLight: 'rgba(203, 213, 225, 0.4)',
    
    // Text colors
    text: '#1e293b',
    textMuted: '#64748b',
    textLight: '#94a3b8',
    textAccent: '#0f172a',
    
    // Brand colors with glass effect
    primary: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    primarySolid: '#3b82f6',
    primaryGlass: 'rgba(59, 130, 246, 0.8)',
    
    // Status colors
    warning: '#f59e0b',
    warningBackground: 'rgba(251, 191, 36, 0.1)',
    warningBorder: 'rgba(251, 191, 36, 0.3)',
    error: '#ef4444',
    success: '#10b981',
    
    // Node colors
    nodeHealthy: 'rgba(34, 197, 94, 0.8)',
    nodeVulnerable: 'rgba(239, 68, 68, 0.8)',
    nodeOutdated: 'rgba(245, 158, 11, 0.8)',
    nodeBorder: 'rgba(148, 163, 184, 0.6)',
    
    // Shadow effects
    shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    shadowGlass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  dark: {
    // Base colors
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    backgroundSolid: '#0f172a',
    foreground: '#f8fafc',
    
    // Glass effect colors
    glassBackground: 'rgba(15, 23, 42, 0.4)',
    glassBorder: 'rgba(148, 163, 184, 0.2)',
    glassAccent: 'rgba(148, 163, 184, 0.1)',
    
    // Card and surface colors
    cardBackground: 'rgba(30, 41, 59, 0.4)',
    cardBorder: 'rgba(148, 163, 184, 0.2)',
    surfaceBackground: 'rgba(30, 41, 59, 0.6)',
    
    // Border colors
    border: 'rgba(71, 85, 105, 0.4)',
    borderLight: 'rgba(100, 116, 139, 0.3)',
    
    // Text colors
    text: '#f8fafc',
    textMuted: '#cbd5e1',
    textLight: '#94a3b8',
    textAccent: '#ffffff',
    
    // Brand colors with glass effect
    primary: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    primarySolid: '#06b6d4',
    primaryGlass: 'rgba(6, 182, 212, 0.8)',
    
    // Status colors
    warning: '#fbbf24',
    warningBackground: 'rgba(251, 191, 36, 0.1)',
    warningBorder: 'rgba(251, 191, 36, 0.3)',
    error: '#f87171',
    success: '#34d399',
    
    // Node colors
    nodeHealthy: 'rgba(52, 211, 153, 0.8)',
    nodeVulnerable: 'rgba(248, 113, 113, 0.8)',
    nodeOutdated: 'rgba(251, 191, 36, 0.8)',
    nodeBorder: 'rgba(148, 163, 184, 0.6)',
    
    // Shadow effects
    shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    shadowGlass: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
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
    document.body.style.background = themes[theme].background;
    document.body.style.color = themes[theme].text;
    document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.minHeight = '100vh';
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