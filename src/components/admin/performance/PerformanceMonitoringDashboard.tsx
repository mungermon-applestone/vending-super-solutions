
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Loader2 } from 'lucide-react';
import { classifyPerformanceScore } from '@/utils/webVitalsMonitoring';

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
}

const PerformanceMonitoringDashboard: React.FC = () => {
  const [webVitals, setWebVitals] = useState<WebVitalMetric[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching performance data
    setTimeout(() => {
      // Mock data for demonstration
      setWebVitals([
        { name: 'LCP', value: 2100, rating: 'good', timestamp: Date.now() },
        { name: 'FID', value: 80, rating: 'good', timestamp: Date.now() },
        { name: 'CLS', value: 0.05, rating: 'good', timestamp: Date.now() },
        { name: 'FCP', value: 1500, rating: 'good', timestamp: Date.now() },
        { name: 'TTFB', value: 420, rating: 'good', timestamp: Date.now() },
      ]);
      
      setPerformanceMetrics([
        { name: 'JS Bundle Size', value: 240, unit: 'KB' },
        { name: 'CSS Size', value: 45, unit: 'KB' },
        { name: 'Image Size (avg)', value: 120, unit: 'KB' },
        { name: 'Time to Interactive', value: 3.2, unit: 's' },
        { name: 'Server Response', value: 420, unit: 'ms' },
      ]);
      
      setIsLoading(false);
    }, 1500);
  }, []);

  // Collect real metrics if available in the browser
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigationTiming) {
          const metrics = [
            { 
              name: 'TTFB', 
              value: navigationTiming.responseStart - navigationTiming.requestStart,
              unit: 'ms' 
            },
            {
              name: 'DOM Load',
              value: navigationTiming.domContentLoadedEventEnd - navigationTiming.fetchStart,
              unit: 'ms'
            },
            {
              name: 'Page Load',
              value: navigationTiming.loadEventEnd - navigationTiming.fetchStart,
              unit: 'ms'
            }
          ];
          
          setPerformanceMetrics(prev => [...prev, ...metrics]);
        }
        
        // Get resource timing
        const resources = performance.getEntriesByType('resource');
        const jsResources = resources.filter(r => r.name.includes('.js'));
        const cssResources = resources.filter(r => r.name.includes('.css'));
        
        if (jsResources.length > 0 || cssResources.length > 0) {
          const jsSize = jsResources.reduce((sum, r) => sum + (r as any).transferSize || 0, 0);
          const cssSize = cssResources.reduce((sum, r) => sum + (r as any).transferSize || 0, 0);
          
          setPerformanceMetrics(prev => [
            ...prev,
            { name: 'JS Actual Size', value: Math.round(jsSize / 1024), unit: 'KB' },
            { name: 'CSS Actual Size', value: Math.round(cssSize / 1024), unit: 'KB' },
          ]);
        }
      } catch (err) {
        console.error('Error collecting performance metrics:', err);
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  const getColorForRating = (rating: string) => {
    switch (rating) {
      case 'good': return '#10b981';
      case 'needs-improvement': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6366f1';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Performance Monitoring</CardTitle>
        <CardDescription>Monitor Core Web Vitals and key performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="web-vitals">
          <TabsList>
            <TabsTrigger value="web-vitals">Web Vitals</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="web-vitals" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {webVitals.map((metric) => (
                <Card key={metric.name} className="overflow-hidden">
                  <div 
                    className={`h-2 w-full ${
                      metric.rating === 'good' ? 'bg-green-500' : 
                      metric.rating === 'needs-improvement' ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`} 
                  />
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-500">{metric.name}</p>
                        <h3 className="text-2xl font-bold">
                          {metric.name === 'CLS' ? metric.value : `${metric.value}ms`}
                        </h3>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        metric.rating === 'good' ? 'bg-green-100 text-green-800' : 
                        metric.rating === 'needs-improvement' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {metric.rating.replace('-', ' ')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={webVitals.filter(m => m.name !== 'CLS')}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}ms`} />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Value (ms)" 
                  fill="#6366f1"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="resources" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {performanceMetrics.map((metric) => (
                <Card key={metric.name}>
                  <CardContent className="pt-6">
                    <p className="text-sm font-medium text-gray-500">{metric.name}</p>
                    <h3 className="text-2xl font-bold">{metric.value}{metric.unit}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name, props) => `${value}${props.payload.unit}`} />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Value" 
                  fill="#8884d8"
                  barSize={40}
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="history" className="py-4">
            <div className="text-center text-gray-500 py-8">
              Historical data tracking will be available after collecting more data points
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t">
        <p className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </p>
      </CardFooter>
    </Card>
  );
};

export default PerformanceMonitoringDashboard;
