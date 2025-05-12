
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, BarChart3, RefreshCw, Trash2 } from 'lucide-react';
import { 
  getDeprecationStats, 
  resetDeprecationTracker 
} from '@/services/cms/utils/deprecation';
import { DeprecationStat } from '@/services/cms/utils/deprecation';
import { useToast } from '@/hooks/use-toast';

interface DeprecationUsageProps {
  showResetButton?: boolean;
  showChart?: boolean;
  limit?: number;
}

/**
 * Component for displaying and managing deprecation usage statistics
 */
const DeprecationUsage: React.FC<DeprecationUsageProps> = ({
  showResetButton = false,
  showChart = false,
  limit = 5
}) => {
  const [stats, setStats] = useState<DeprecationStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadStats = () => {
    setIsLoading(true);
    try {
      const deprecationStats = getDeprecationStats();
      
      // Sort stats by most recent and by count
      const sortedStats = [...deprecationStats].sort((a, b) => {
        // Sort first by count (descending)
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        // Then by timestamp (most recent first)
        return b.timestamp - a.timestamp;
      });
      
      setStats(sortedStats);
    } catch (error) {
      console.error('Error loading deprecation stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleReset = () => {
    resetDeprecationTracker();
    toast({
      title: 'Statistics Reset',
      description: 'Deprecation usage statistics have been reset.',
      variant: 'default',
    });
    loadStats();
  };

  const handleRefresh = () => {
    loadStats();
    toast({
      title: 'Statistics Refreshed',
      description: 'Deprecation usage statistics have been updated.',
      variant: 'default',
    });
  };

  // Format the timestamp to a readable date string
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <span>Deprecation Usage</span>
        </CardTitle>
        <CardDescription>
          Tracking of deprecated features and functions still being used
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">Loading statistics...</p>
          </div>
        ) : stats.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <p className="text-muted-foreground mb-2">No deprecated features have been used.</p>
            <p className="text-sm text-muted-foreground">This is good! It means you're using the latest recommended patterns.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {showChart && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Usage Distribution
                </h3>
                <div className="h-12 bg-gray-100 rounded-md overflow-hidden flex">
                  {stats.slice(0, 5).map((stat, index) => {
                    const maxCount = Math.max(...stats.map(s => s.count));
                    const percentage = (stat.count / maxCount) * 100;
                    const colors = [
                      'bg-blue-500',
                      'bg-green-500',
                      'bg-yellow-500',
                      'bg-orange-500',
                      'bg-red-500'
                    ];
                    return (
                      <div 
                        key={index}
                        className={`h-full ${colors[index % colors.length]}`}
                        style={{ width: `${percentage}%` }}
                        title={`${stat.component}: ${stat.count} uses`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Most used: {stats[0]?.component}</span>
                  <span>{stats[0]?.count} calls</span>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium mb-2">Top Deprecated Features</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {stats.slice(0, limit).map((stat, index) => (
                  <div key={index} className="p-2 border border-gray-200 rounded-md">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{stat.component}</h4>
                      <span className="text-xs bg-amber-100 text-amber-800 rounded-full px-2 py-0.5">
                        {stat.count} {stat.count === 1 ? 'use' : 'uses'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{stat.message}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      Last used: {formatDate(stat.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 justify-end mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              
              {showResetButton && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleReset}
                  className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Reset Stats
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeprecationUsage;
