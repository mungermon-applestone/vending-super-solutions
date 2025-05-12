
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Clock, RefreshCw, Trash2 } from 'lucide-react';
import { getDeprecationStats, resetDeprecationTracker } from '@/services/cms/utils/deprecation';

const DeprecationStatsPage = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const loadStats = () => {
    setIsLoading(true);
    try {
      const deprecationStats = getDeprecationStats().map(stat => ({
        ...stat,
        // For backward compatibility
        feature: stat.component,
        lastUsed: stat.timestamp
      }));
      
      // Sort by most recent first
      const sortedStats = [...deprecationStats].sort((a, b) => {
        // First by count
        if (b.count !== a.count) return b.count - a.count;
        // Then by timestamp
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
    loadStats();
  };

  const handleRefresh = () => {
    loadStats();
  };

  // Format the timestamp to a readable date string
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Deprecation Statistics</h1>
            <p className="text-muted-foreground">
              Track usage of deprecated features to aid in migration planning
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button 
              variant="outline"
              onClick={handleReset}
              className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Reset Stats
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <p className="text-muted-foreground">Loading statistics...</p>
          </div>
        ) : stats.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-20 text-center">
              <p className="text-xl mb-2">No deprecated features have been used</p>
              <p className="text-muted-foreground">This is good! It means you're using the latest recommended patterns.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Usage Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="my-4">
                  <div className="h-16 bg-gray-100 rounded-md overflow-hidden flex">
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
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>Most used: {stats[0]?.component}</span>
                    <span>{stats[0]?.count} calls</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="border rounded-md p-4">
                    <div className="text-lg font-semibold">{stats.length}</div>
                    <div className="text-sm text-gray-500">Deprecated features used</div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="text-lg font-semibold">
                      {stats.reduce((sum, stat) => sum + stat.count, 0)}
                    </div>
                    <div className="text-sm text-gray-500">Total usage count</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Detailed Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mt-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-md">
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
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DeprecationStatsPage;
