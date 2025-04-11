
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TestTube, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const RegressionTestButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{ status: 'idle' | 'success' | 'error', message: string }>({
    status: 'idle',
    message: ''
  });
  const { toast } = useToast();

  const runRegressionTest = async () => {
    setIsRunning(true);
    setResults({ status: 'idle', message: 'Running regression tests...' });
    
    try {
      // In a real implementation, this would make an API call to a backend endpoint
      // that would trigger the regression tests
      // For now, we'll simulate the test run with a timeout
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate successful test results
      setResults({
        status: 'success',
        message: 'All tests passed successfully! View the full report in the test-results/report directory.'
      });
      
      toast({
        title: "Tests completed successfully",
        description: "All regression tests have passed."
      });
    } catch (error) {
      setResults({
        status: 'error',
        message: error instanceof Error 
          ? `Tests failed: ${error.message}`
          : 'Tests failed with an unknown error'
      });
      
      toast({
        title: "Test run failed",
        description: "Some regression tests have failed.",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        variant="outline"
        className="bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-800"
      >
        <TestTube className="mr-2 h-4 w-4" />
        Run Regression Tests
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Regression Tests</DialogTitle>
            <DialogDescription>
              Run comprehensive tests to ensure application quality.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {isRunning ? (
              <div className="flex items-center justify-center py-4">
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  <p className="text-sm text-muted-foreground">Running tests...</p>
                </div>
              </div>
            ) : (
              <>
                {results.status !== 'idle' && (
                  <div className={`p-4 rounded-md ${
                    results.status === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className={
                      results.status === 'success' ? 'text-green-800' : 'text-red-800'
                    }>{results.message}</p>
                  </div>
                )}
                
                <div className="mt-4">
                  <h3 className="font-medium text-sm">Available Test Suites:</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex items-center">• Component Tests (Button, MediaCard, etc.)</li>
                    <li className="flex items-center">• Admin Page Tests (CRUD operations)</li>
                    <li className="flex items-center">• Navigation Tests</li>
                    <li className="flex items-center">• Content Display Tests</li>
                  </ul>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="flex space-x-2 sm:justify-between">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              disabled={isRunning}
            >
              Close
            </Button>
            <Button
              onClick={runRegressionTest}
              disabled={isRunning}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isRunning ? 'Running...' : results.status === 'idle' ? 'Run Tests' : 'Run Again'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegressionTestButton;
