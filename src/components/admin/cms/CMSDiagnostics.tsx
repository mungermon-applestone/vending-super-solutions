
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { runCMSDiagnostics, CMSDiagnosticsResult } from '@/services/cms/utils/diagnostics';
import { AlertTriangle, CheckCircle, Info, XCircle, RefreshCw } from 'lucide-react';

/**
 * Component for diagnosing CMS connection issues
 */
const CMSDiagnostics: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<CMSDiagnosticsResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  const runDiagnostics = async () => {
    setIsRunning(true);
    try {
      const result = await runCMSDiagnostics();
      setDiagnostics(result);
    } catch (error) {
      console.error("Error running CMS diagnostics:", error);
    } finally {
      setIsRunning(false);
    }
  };
  
  useEffect(() => {
    // Run diagnostics on component mount
    runDiagnostics();
  }, []);
  
  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-sky-500" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-2 py-1 rounded text-sm">
            <CheckCircle className="h-4 w-4" />
            Healthy
          </div>
        );
      case 'issues':
        return (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-2 py-1 rounded text-sm">
            <AlertTriangle className="h-4 w-4" />
            Has Issues
          </div>
        );
      case 'critical':
        return (
          <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-2 py-1 rounded text-sm">
            <XCircle className="h-4 w-4" />
            Critical Problems
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>CMS Diagnostics</span>
          {diagnostics && getStatusBadge(diagnostics.status)}
        </CardTitle>
        <CardDescription>
          Check the health of your CMS connection
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isRunning ? (
          <div className="flex justify-center p-6">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : diagnostics ? (
          <div className="space-y-4">
            {diagnostics.issues.length === 0 ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertTitle>All Good!</AlertTitle>
                <AlertDescription>
                  No issues were detected with your CMS configuration.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {diagnostics.issues.map((issue, index) => (
                  <Alert 
                    key={index} 
                    variant={issue.type === 'error' ? 'destructive' : 'default'}
                    className={issue.type === 'warning' ? 'border-amber-200 bg-amber-50' : ''}
                  >
                    {getIssueIcon(issue.type)}
                    <AlertTitle>{issue.message}</AlertTitle>
                    <AlertDescription className="space-y-1">
                      {issue.details && <p>{issue.details}</p>}
                      {issue.fix && (
                        <p className="font-medium">Fix: {issue.fix}</p>
                      )}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-6 text-muted-foreground">
            No diagnostic results available
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={runDiagnostics}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Running diagnostics...
            </>
          ) : (
            'Run Diagnostics'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CMSDiagnostics;
