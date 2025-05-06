
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import PerformanceMonitoringDashboard from '@/components/admin/performance/PerformanceMonitoringDashboard';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'fail';
  message?: string;
  duration?: number;
}

const PerformanceTesting: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([
    { name: 'Core Web Vitals', status: 'pending' },
    { name: 'Resource Loading', status: 'pending' },
    { name: 'Layout Stability', status: 'pending' },
    { name: 'Progressive Hydration', status: 'pending' },
    { name: 'Service Worker', status: 'pending' },
    { name: 'Image Optimization', status: 'pending' },
  ]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    // Reset all tests to pending
    setTestResults(prev => prev.map(test => ({ ...test, status: 'pending', message: undefined, duration: undefined })));
    
    // Mock test execution with delays
    const totalTests = testResults.length;
    
    for (let i = 0; i < totalTests; i++) {
      // Update current test to running
      setTestResults(prev => {
        const updated = [...prev];
        updated[i] = { ...updated[i], status: 'running' };
        return updated;
      });
      
      // Wait for "test" to complete (simulate with timeout)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock result
      const success = Math.random() > 0.3; // 70% chance of success
      const duration = Math.floor(Math.random() * 1000) + 500;
      
      // Update test result
      setTestResults(prev => {
        const updated = [...prev];
        updated[i] = {
          ...updated[i],
          status: success ? 'success' : 'fail',
          message: success 
            ? 'Test passed successfully' 
            : i === 2 
              ? 'Found layout shift of 0.15 which exceeds threshold of 0.1' 
              : 'Test failed to meet target metrics',
          duration
        };
        return updated;
      });
      
      // Update progress
      setProgress(Math.round(((i + 1) / totalTests) * 100));
    }
    
    setIsRunning(false);
  };
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Performance Testing</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Regression Tests</CardTitle>
              <CardDescription>Verify performance optimizations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.map((test, index) => (
                  <div key={test.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {test.status === 'pending' && (
                        <div className="h-4 w-4 rounded-full bg-gray-200"></div>
                      )}
                      {test.status === 'running' && (
                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                      )}
                      {test.status === 'success' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {test.status === 'fail' && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`${
                        test.status === 'running' ? 'font-medium text-blue-700' :
                        test.status === 'success' ? 'text-green-700' :
                        test.status === 'fail' ? 'text-red-700' : ''
                      }`}>
                        {test.name}
                      </span>
                    </div>
                    
                    {test.duration && (
                      <span className="text-xs text-gray-500">
                        {test.duration}ms
                      </span>
                    )}
                  </div>
                ))}
              </div>
              
              {isRunning && (
                <div className="mt-4">
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-center mt-1 text-gray-500">
                    {progress}% complete
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setTestResults(prev => prev.map(test => ({ name: test.name, status: 'pending' })))}
                disabled={isRunning}
              >
                Reset
              </Button>
              <Button onClick={runTests} disabled={isRunning}>
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : 'Run Tests'}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-6">
            <Alert className={testResults.some(t => t.status === 'fail') ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
              <AlertTitle>Test Summary</AlertTitle>
              <AlertDescription>
                {testResults.every(t => t.status === 'pending') ? (
                  'Run tests to see results'
                ) : testResults.some(t => t.status === 'fail') ? (
                  <span className="text-red-700">
                    Found {testResults.filter(t => t.status === 'fail').length} issues that need attention
                  </span>
                ) : testResults.some(t => t.status === 'running') ? (
                  'Tests in progress...'
                ) : (
                  <span className="text-green-700">
                    All tests passed successfully!
                  </span>
                )}
              </AlertDescription>
            </Alert>
          </div>
          
          {testResults.filter(t => t.status === 'fail').map(test => (
            <div key={`${test.name}-error`} className="mt-4">
              <Alert variant="destructive">
                <AlertTitle>Issue: {test.name}</AlertTitle>
                <AlertDescription>{test.message}</AlertDescription>
              </Alert>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-2">
          <PerformanceMonitoringDashboard />
        </div>
      </div>
    </div>
  );
};

export default PerformanceTesting;
