
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDeprecationUsageStats, resetUsageStats } from '@/services/cms/utils/deprecationLogger';
import { Trash, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DeprecationUsageProps {
  showResetButton?: boolean;
  showChart?: boolean;
}

/**
 * Component to display deprecation usage statistics
 */
const DeprecationUsage: React.FC<DeprecationUsageProps> = ({
  showResetButton = false,
  showChart = true
}) => {
  const [stats, setStats] = useState<any[]>([]);
  const [expanded, setExpanded] = useState(showChart);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial stats
    refreshStats();
  }, []);

  const refreshStats = () => {
    const usageStats = getDeprecationUsageStats();
    setStats(usageStats.map(stat => ({
      name: stat.feature,
      value: stat.count
    })));
  };

  const handleReset = () => {
    resetUsageStats();
    setStats([]);
    toast({
      title: "Statistics Reset",
      description: "Deprecation usage statistics have been reset.",
    });
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Deprecation Usage</CardTitle>
          <CardDescription>
            Tracking usage of deprecated features to guide migration efforts
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={toggleExpanded}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </CardHeader>
      
      {expanded && (
        <CardContent>
          <div className="flex justify-between mb-4">
            <Button variant="outline" size="sm" onClick={refreshStats}>
              <RefreshCw size={14} className="mr-1" />
              Refresh
            </Button>
            
            {showResetButton && (
              <Button variant="outline" size="sm" onClick={handleReset}>
                <Trash size={14} className="mr-1" />
                Reset
              </Button>
            )}
          </div>
          
          {stats.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No deprecated feature usage detected
            </div>
          ) : (
            <>
              {showChart && (
                <div className="w-full h-60 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              <div className="space-y-2">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center py-2 px-3 rounded-md bg-gray-50"
                  >
                    <span className="text-sm font-medium text-gray-700">{stat.name}</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      Used {stat.value} {stat.value === 1 ? 'time' : 'times'}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default DeprecationUsage;
