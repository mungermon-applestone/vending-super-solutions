
import React from 'react';
import { toast } from 'sonner';
import { isContentfulConfigured, CONTENTFUL_CONFIG } from '@/config/cms';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Bug, RefreshCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { testContentfulConnection } from '@/services/contentful/utils';

const ContentfulDebug = () => {
  const [testResult, setTestResult] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const isConfigured = isContentfulConfigured();

  const runConnectionTest = async () => {
    setIsLoading(true);
    try {
      const result = await testContentfulConnection();
      setTestResult(result);
      
      if (result.success) {
        toast.success("Contentful connection successful!");
      } else {
        toast.error("Contentful connection failed");
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
        error
      });
      toast.error("Error testing connection");
    } finally {
      setIsLoading(false);
    }
  };

  const clearStoredVariables = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vending-cms-env-variables');
      toast.success("Stored environment variables cleared");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4">
      <Alert variant={isConfigured ? "default" : "destructive"} className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Contentful Configuration Status</AlertTitle>
        <AlertDescription className="space-y-2">
          <div className="text-sm">
            <p><strong>Status:</strong> {isConfigured ? "Configured" : "Not configured"}</p>
            <p><strong>Space ID:</strong> {CONTENTFUL_CONFIG.SPACE_ID || "Not set"}</p>
            <p><strong>Delivery Token:</strong> {CONTENTFUL_CONFIG.DELIVERY_TOKEN ? "Set" : "Not set"}</p>
            <p><strong>Environment:</strong> {CONTENTFUL_CONFIG.ENVIRONMENT_ID || "master"}</p>
            <p><strong>Window.env available:</strong> {typeof window !== 'undefined' && window.env ? "Yes" : "No"}</p>
            <p><strong>Local storage vars:</strong> {typeof window !== 'undefined' && localStorage.getItem('vending-cms-env-variables') ? "Yes" : "No"}</p>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={runConnectionTest} disabled={isLoading}>
              {isLoading ? <RefreshCcw className="h-4 w-4 animate-spin mr-2" /> : <Bug className="h-4 w-4 mr-2" />}
              Test Connection
            </Button>
            <Button size="sm" variant="outline" onClick={clearStoredVariables}>
              <Trash2 className="h-4 w-4 mr-2" /> Clear Cache
            </Button>
          </div>
        </AlertDescription>
      </Alert>
      
      {testResult && (
        <Alert variant={testResult.success ? "default" : "destructive"} className="mt-4">
          <AlertTitle>Connection Test Result</AlertTitle>
          <AlertDescription className="text-sm">
            <p><strong>Status:</strong> {testResult.success ? "Success" : "Failed"}</p>
            <p><strong>Message:</strong> {testResult.message}</p>
            
            {testResult.details && (
              <div className="mt-2 p-2 bg-black/5 rounded overflow-auto max-h-40">
                <pre className="text-xs">{JSON.stringify(testResult.details, null, 2)}</pre>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ContentfulDebug;
