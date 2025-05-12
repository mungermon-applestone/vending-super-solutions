
import React, { useState, useEffect } from 'react';
import { getDeprecationStats, resetDeprecationTracker } from '@/services/cms/utils/deprecation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCw, Trash, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';

const DeprecationStatsPage: React.FC = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    refreshStats();
  }, []);

  const refreshStats = () => {
    const usageStats = getDeprecationStats();
    setStats(usageStats.map(stat => ({
      name: stat.component || stat.feature || 'Unknown',
      value: stat.count,
      lastUsed: new Date(stat.timestamp || stat.lastUsed || Date.now()).toLocaleString()
    })));
    setLastRefreshed(new Date());
  };

  const handleReset = () => {
    resetDeprecationTracker();
    setStats([]);
    toast({
      title: "Statistics Reset",
      description: "Deprecation usage statistics have been reset.",
    });
  };

  const exportStats = () => {
    const csvContent = [
      'Feature,Count,Last Used',
      ...stats.map(stat => `${stat.name},${stat.value},"${stat.lastUsed}"`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `deprecation-stats-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Deprecation Usage Statistics</h1>
            <p className="text-muted-foreground">
              Track usage of deprecated features to guide migration efforts
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={refreshStats}>
              <RefreshCw size={14} className="mr-1" />
              Refresh
            </Button>
            
            <Button variant="outline" size="sm" onClick={exportStats}>
              <Download size={14} className="mr-1" />
              Export CSV
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleReset}>
              <Trash size={14} className="mr-1" />
              Reset
            </Button>
          </div>
        </div>
        
        <Card className="shadow-sm mb-6">
          <CardHeader>
            <CardTitle>Usage Overview</CardTitle>
            <CardDescription>
              Last refreshed: {lastRefreshed.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No deprecated feature usage detected
              </div>
            ) : (
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" name="Times Used" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Detailed Usage</CardTitle>
            <CardDescription>
              Breakdown of deprecated feature usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No deprecated feature usage detected
              </div>
            ) : (
              <div className="space-y-2">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center py-3 px-4 rounded-md bg-gray-50 border border-gray-100"
                  >
                    <div>
                      <h3 className="font-medium">{stat.name}</h3>
                      <p className="text-sm text-muted-foreground">Last used: {stat.lastUsed}</p>
                    </div>
                    <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                      Used {stat.value} {stat.value === 1 ? 'time' : 'times'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50 text-sm text-muted-foreground border-t">
            These statistics are tracked in-memory and will reset when the application is restarted.
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default DeprecationStatsPage;
