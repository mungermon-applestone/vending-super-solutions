
import React, { useState, useEffect } from 'react';
import { getDeprecationStats, type DeprecationStat } from '@/services/cms/utils/deprecation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

/**
 * A debug component to monitor deprecated feature usage
 * This helps track which deprecated features are still being used
 * to prioritize migration efforts.
 */
const DeprecationMonitor: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [stats, setStats] = useState<DeprecationStat[]>([]);
  
  // Toggle visibility with a keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+M to toggle the monitor
      if (e.ctrlKey && e.shiftKey && e.key === 'M') {
        setVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Update stats every 2 seconds when visible
  useEffect(() => {
    if (!visible) return;
    
    const updateStats = () => {
      setStats(getDeprecationStats());
    };
    
    // Initial update
    updateStats();
    
    // Set interval for updates
    const interval = setInterval(updateStats, 2000);
    return () => clearInterval(interval);
  }, [visible]);
  
  if (!visible) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] overflow-auto shadow-lg">
      <Card>
        <CardHeader className="bg-amber-50 py-2 px-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-sm">Deprecation Monitor</CardTitle>
              <CardDescription className="text-xs">
                Usage statistics for deprecated features
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVisible(false)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          {stats.length === 0 ? (
            <p className="text-sm text-center py-4 text-muted-foreground">
              No deprecated features have been used in this session.
            </p>
          ) : (
            <div className="space-y-1">
              {stats.map((stat) => (
                <div
                  key={stat.feature}
                  className="text-xs p-2 bg-gray-50 rounded border border-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{stat.feature}</span>
                    <span className="text-amber-600 font-bold">{stat.count}</span>
                  </div>
                  <p className="text-muted-foreground mt-1">{stat.message}</p>
                  {stat.alternative && (
                    <p className="text-green-600 mt-1">
                      Alternative: {stat.alternative}
                    </p>
                  )}
                  <div className="text-gray-400 mt-1">
                    Last used: {new Date(stat.lastUsed).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div className="text-center pt-2">
                <span className="text-xs text-muted-foreground">
                  Press Ctrl+Shift+M to toggle this panel
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeprecationMonitor;
