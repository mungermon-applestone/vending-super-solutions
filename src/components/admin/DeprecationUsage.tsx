
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { 
  AlertTriangle, 
  RefreshCw, 
  Check 
} from 'lucide-react';
import { 
  getDeprecationUsageStats, 
  resetUsageStats 
} from '@/services/cms/utils/deprecationLogger';

interface DeprecationUsageProps {
  showResetButton?: boolean;
  showChart?: boolean;
}

const DeprecationUsage: React.FC<DeprecationUsageProps> = ({
  showResetButton = true,
  showChart = true
}) => {
  const [stats, setStats] = useState(getDeprecationUsageStats());
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [resetSuccess, setResetSuccess] = useState(false);

  // Format stats for chart display
  const chartData = stats
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(stat => ({
      name: stat.feature.length > 15 
        ? stat.feature.substring(0, 15) + '...' 
        : stat.feature,
      count: stat.count
    }));

  const refreshStats = () => {
    setStats(getDeprecationUsageStats());
    setLastUpdated(new Date());
  };

  const handleReset = () => {
    resetUsageStats();
    setStats([]);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  useEffect(() => {
    // Update stats every 30 seconds to catch any new usage
    const interval = setInterval(refreshStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Deprecated Feature Usage
        </CardTitle>
        <CardDescription>
          Tracking usage of deprecated features in the current session
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshStats}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
            
            {showResetButton && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleReset}
                className={`flex items-center gap-1 ${resetSuccess ? 'bg-green-50 text-green-600 border-green-200' : ''}`}
              >
                {resetSuccess ? (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    Reset Complete
                  </>
                ) : (
                  'Reset Stats'
                )}
              </Button>
            )}
          </div>
        </div>
        
        {showChart && stats.length > 0 && (
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip />
                <Bar 
                  dataKey="count" 
                  fill="#f59e0b" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {stats.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No deprecated features have been used in this session.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>Usage Count</TableHead>
                <TableHead>Last Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((stat, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{stat.feature}</TableCell>
                  <TableCell>{stat.count}</TableCell>
                  <TableCell>{new Date(stat.lastUsed).toLocaleTimeString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default DeprecationUsage;
