
import React, { useState, useEffect } from 'react';
import { usageMonitor } from './monitoring';

/**
 * A component that displays usage statistics for deprecated functions
 * This is intended for development and testing only
 */
export const LegacyMonitor: React.FC = () => {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Update stats every 2 seconds
    const interval = setInterval(() => {
      setStats(usageMonitor.getUsageStats());
    }, 2000);

    // Add keyboard shortcut to toggle visibility (Ctrl+Shift+M)
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'M') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '10px',
        maxWidth: '400px',
        maxHeight: '300px',
        overflowY: 'auto',
        zIndex: 9999,
        fontSize: '12px',
        fontFamily: 'monospace'
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
        <span>Deprecated Function Usage</span>
        <button 
          onClick={() => setIsVisible(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}
        >
          ✕
        </button>
      </div>
      {Object.keys(stats).length === 0 ? (
        <div style={{ fontStyle: 'italic', color: '#666' }}>
          No deprecated functions called yet
        </div>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '4px' }}>Function</th>
              <th style={{ textAlign: 'right', padding: '4px' }}>Calls</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats).map(([func, count]) => (
              <tr key={func} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: '4px' }}>{func}</td>
                <td style={{ textAlign: 'right', padding: '4px' }}>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div style={{ marginTop: '8px', fontSize: '10px', color: '#666' }}>
        Press Ctrl+Shift+M to toggle
      </div>
    </div>
  );
};

export default LegacyMonitor;
