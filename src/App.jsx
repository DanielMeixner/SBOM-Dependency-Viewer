import React, { useState } from 'react';
import DependencyGraph from './DependencyGraph';
import { useTheme } from './useTheme.jsx';
import { useFontSize } from './useFontSize.jsx';

function App() {
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);
  const { theme, toggleTheme, colors } = useTheme();
  const { increaseFontSize, decreaseFontSize, canIncrease, canDecrease, fontSize } = useFontSize();

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
      minHeight: '100vh',
      background: colors.background,
      color: colors.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      {/* Header with glassmorphism effect */}
      <header style={{ 
        background: colors.glassBackground,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${colors.glassBorder}`,
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: colors.shadowGlass,
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: colors.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            boxShadow: colors.shadowMd
          }}>
            📊
          </div>
          <h1 style={{ 
            margin: 0, 
            color: colors.textAccent,
            fontSize: '2rem',
            fontWeight: '700',
            letterSpacing: '-0.025em'
          }}>
            SBOM Dependency Graph Viewer
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Font Size Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={decreaseFontSize}
              disabled={!canDecrease}
              style={{
                background: canDecrease ? colors.primary : colors.glassBackground,
                color: canDecrease ? '#ffffff' : colors.textMuted,
                border: 'none',
                borderRadius: '12px',
                padding: '10px 12px',
                cursor: canDecrease ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: canDecrease ? colors.shadowMd : 'none',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                opacity: canDecrease ? 1 : 0.5,
                minWidth: '40px',
                height: '40px'
              }}
              onMouseEnter={(e) => {
                if (canDecrease) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = colors.shadowLg;
                }
              }}
              onMouseLeave={(e) => {
                if (canDecrease) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = colors.shadowMd;
                }
              }}
              title="Decrease font size"
              aria-label="Decrease font size"
            >
              A-
            </button>
            <button 
              onClick={increaseFontSize}
              disabled={!canIncrease}
              style={{
                background: canIncrease ? colors.primary : colors.glassBackground,
                color: canIncrease ? '#ffffff' : colors.textMuted,
                border: 'none',
                borderRadius: '12px',
                padding: '10px 12px',
                cursor: canIncrease ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: canIncrease ? colors.shadowMd : 'none',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                opacity: canIncrease ? 1 : 0.5,
                minWidth: '40px',
                height: '40px'
              }}
              onMouseEnter={(e) => {
                if (canIncrease) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = colors.shadowLg;
                }
              }}
              onMouseLeave={(e) => {
                if (canIncrease) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = colors.shadowMd;
                }
              }}
              title="Increase font size"
              aria-label="Increase font size"
            >
              A+
            </button>
          </div>
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            style={{
              background: colors.primary,
              color: '#ffffff',
              border: 'none',
              borderRadius: '16px',
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: colors.shadowMd,
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = colors.shadowLg;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = colors.shadowMd;
            }}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <span style={{ fontSize: '18px' }}>
              {theme === 'light' ? '🌙' : '☀️'}
            </span>
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
        </div>
      </header>

      {/* Upload Section */}
      <section style={{
        background: colors.cardBackground,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: colors.shadowGlass,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: colors.primaryGlass,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            📁
          </div>
          <h2 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: '600',
            color: colors.textAccent
          }}>
            Upload SPDX File
          </h2>
        </div>
        
        <div style={{
          position: 'relative',
          display: 'inline-block'
        }}>
          <input 
            type="file" 
            accept="application/json" 
            onChange={handleFileChange}
            style={{
              position: 'absolute',
              opacity: 0,
              width: '100%',
              height: '100%',
              cursor: 'pointer'
            }}
          />
          <div style={{
            background: colors.surfaceBackground,
            border: `2px dashed ${colors.border}`,
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            minHeight: '120px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = colors.primarySolid;
            e.target.style.background = colors.glassAccent;
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = colors.border;
            e.target.style.background = colors.surfaceBackground;
          }}
          >
            <div style={{ fontSize: '48px', opacity: 0.6 }}>📄</div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: '600',
              color: colors.textAccent 
            }}>
              Choose SPDX JSON File
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: colors.textMuted 
            }}>
              Or drag and drop your file here
            </div>
          </div>
        </div>
        
        <div style={{
          background: colors.glassAccent,
          border: `1px solid ${colors.borderLight}`,
          borderRadius: '12px',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem'
        }}>
          <div style={{
            fontSize: '20px',
            marginTop: '2px'
          }}>
            💡
          </div>
          <div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '600',
              color: colors.textAccent,
              marginBottom: '0.5rem'
            }}>
              Tip:
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: colors.textMuted,
              lineHeight: '1.5'
            }}>
              You can generate an SPDX SBOM file for your repository on GitHub by going to{' '}
              <strong style={{ color: colors.textAccent }}>Insights → Dependency graph</strong>{' '}
              and clicking the{' '}
              <strong style={{ color: colors.textAccent }}>Export SBOM</strong>{' '}
              button.
            </div>
          </div>
        </div>
      </section>
      
      {!isElectron && (
        <div style={{ 
          background: colors.warningBackground,
          border: `1px solid ${colors.warningBorder}`,
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '20px', marginTop: '2px' }}>⚠️</div>
          <div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '600',
              color: colors.warning,
              marginBottom: '0.5rem'
            }}>
              Note:
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: colors.textMuted,
              lineHeight: '1.5'
            }}>
              Dependency health check only works in the Electron (desktop) app. In the browser, health status will not be available due to security restrictions.
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          color: colors.error
        }}>
          <div style={{ fontSize: '20px' }}>❌</div>
          <div style={{ fontSize: '16px', fontWeight: '600' }}>{error}</div>
        </div>
      )}
      
      {jsonData && <DependencyGraph data={jsonData} />}
      
      {!jsonData && (
        <div style={{
          background: colors.cardBackground,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: '20px',
          padding: '3rem',
          textAlign: 'center',
          boxShadow: colors.shadowGlass
        }}>
          <div style={{ fontSize: '64px', opacity: 0.4, marginBottom: '1rem' }}>📊</div>
          <div style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600',
            color: colors.textAccent,
            marginBottom: '0.5rem'
          }}>
            Ready to visualize dependencies
          </div>
          <div style={{ 
            fontSize: '16px', 
            color: colors.textMuted,
            lineHeight: '1.5'
          }}>
            Upload an SPDX JSON file to get started with interactive dependency graph visualization.
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
