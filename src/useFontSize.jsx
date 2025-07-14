import React, { createContext, useContext, useState, useEffect } from 'react';

const FontSizeContext = createContext();

// Font size levels with rem values
export const fontSizes = {
  small: 0.875,   // 14px
  medium: 1,      // 16px (default)
  large: 1.125,   // 18px
  xlarge: 1.25,   // 20px
  xxlarge: 1.5    // 24px
};

// Font size level names in order
export const fontSizeOrder = ['small', 'medium', 'large', 'xlarge', 'xxlarge'];

export const FontSizeProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(() => {
    const savedFontSize = localStorage.getItem('SBOM-Dependency-Viewer-font-size');
    return savedFontSize || 'medium';
  });

  useEffect(() => {
    localStorage.setItem('SBOM-Dependency-Viewer-font-size', fontSize);
    
    // Apply font size to the root element
    const rootElement = document.documentElement;
    rootElement.style.fontSize = `${fontSizes[fontSize]}rem`;
  }, [fontSize]);

  const increaseFontSize = () => {
    const currentIndex = fontSizeOrder.indexOf(fontSize);
    if (currentIndex < fontSizeOrder.length - 1) {
      setFontSize(fontSizeOrder[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const currentIndex = fontSizeOrder.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(fontSizeOrder[currentIndex - 1]);
    }
  };

  const canIncrease = fontSize !== fontSizeOrder[fontSizeOrder.length - 1];
  const canDecrease = fontSize !== fontSizeOrder[0];

  return (
    <FontSizeContext.Provider value={{ 
      fontSize, 
      setFontSize, 
      increaseFontSize, 
      decreaseFontSize, 
      canIncrease, 
      canDecrease,
      fontSizeValue: fontSizes[fontSize]
    }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};