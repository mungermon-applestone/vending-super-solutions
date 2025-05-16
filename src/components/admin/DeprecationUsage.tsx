
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, BarChart3 } from 'lucide-react';
import { 
  getDeprecationStats, 
  resetDeprecationTracker,
  type DeprecationStat
} from '@/services/cms/utils/deprecation';

interface DeprecationUsageProps {
  showChart?: boolean;
  showResetButton?: boolean;
  maxItems?: number;
  className?: string;
}

/**
 * Component to display statistics about deprecated feature usage
 */
const DeprecationUsage: React.FC<DeprecationUsageProps> = ({ 
  showChart = false,
  showResetButton = false,
  maxItems = 10,
  className = ''
}) => {
  const [stats, setStats] = useState<DeprecationStat[]>([]);
  const [isResetting, setIsResetting] = useState(false);
  
  // Load statistics on mount and when stats are reset
  useEffect(() => {
    const usageStats = getDeprecationStats();
    setStats(usageStats);
  }, [isResetting]);
  
  // Handle resetting the usage tracker
  const handleReset = () => {
    setIsResetting(true);
    resetDeprecationTracker();
    
    // Set a small delay to allow the reset to complete
    setTimeout(() => {
      setStats(getDeprecationStats());
      setIsResetting(false);
    }, 100);
  };
  
  // Limit the number of items shown
  const displayStats = stats.slice(0, maxItems);
  
  return (
    <Card className={`shadow-sm ${className}`}>
      <CardHeader className="pb-2 bg-gray-50 border-b">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>Deprecated Feature Usage</span>
          </div>
          {showResetButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isResetting || stats.length === 0}
              className="h-8"
            >
              <RefreshCcw className="h-3.5 w-3.5 mr-1" />
              Reset Tracker
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {stats.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No deprecated features have been used yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {showChart && stats.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4" />
                  Usage Breakdown
                </h4>
                <div className="space-y-2">
                  {displayStats.map(stat => (
                    <div key={stat.component} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-gray-700">{stat.component}</span>
                        <span className="text-gray-500">{stat.count} uses</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-400"
                          style={{ 
                            width: `${Math.min(100, (stat.count / Math.max(...stats.map(s => s.count))) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <ul className="divide-y">
              {displayStats.map(stat => (
                <li key={stat.component} className="py-2 flex justify-between items-center">
                  <span className="font-medium text-sm">{stat.component}</span>
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                    {stat.count} {stat.count === 1 ? 'use' : 'uses'}
                  </span>
                </li>
              ))}
            </ul>
            
            {stats.length > maxItems && (
              <div className="text-center text-sm text-gray-500 pt-2">
                Showing {maxItems} of {stats.length} deprecated features
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeprecationUsage;
