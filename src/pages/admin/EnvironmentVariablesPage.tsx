
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import EnvironmentVariableManager from '@/components/admin/cms/EnvironmentVariableManager';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { testContentfulConnection } from '@/services/cms/utils/contentfulClient';

const EnvironmentVariablesPage = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestConnection = async () => {
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
      console.error('Error testing connection:', error);
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Environment Variables</h1>
        
        <div className="grid grid-cols-1 gap-6">
          <EnvironmentVariableManager />
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Test Connection</CardTitle>
              <CardDescription>
                Verify your Contentful connection with current environment variables
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleTestConnection}
                disabled={isLoading}
                className="mb-4"
              >
                {isLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Test Contentful Connection
              </Button>
              
              {testResult && (
                <Alert variant={testResult.success ? "default" : "destructive"}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{testResult.success ? "Success" : "Connection Failed"}</AlertTitle>
                  <AlertDescription>
                    {testResult.message}
                    
                    {testResult.details && (
                      <div className="mt-2 p-2 bg-black/5 rounded overflow-auto max-h-40">
                        <pre className="text-xs">{JSON.stringify(testResult.details, null, 2)}</pre>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default EnvironmentVariablesPage;
