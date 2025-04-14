
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { testContentfulConnection } from '@/services/cms/utils/connection';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, CheckCircle, AlertTriangle, Settings, Database } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const CMSConnectionTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [noConfigFound, setNoConfigFound] = useState(false);
  const [dbConnectionStatus, setDbConnectionStatus] = useState<{
    checked: boolean;
    success: boolean;
    rows?: number;
    error?: string;
  }>({ checked: false, success: false });
  const { toast } = useToast();

  // Check database connection on component mount
  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      console.log('[CMSConnectionTest] Checking Supabase connection and contentful_config table...');
      
      const { data, error, count } = await supabase
        .from('contentful_config')
        .select('*', { count: 'exact' });
      
      if (error) {
        console.error('[CMSConnectionTest] Error connecting to database:', error);
        setDbConnectionStatus({
          checked: true,
          success: false,
          error: error.message
        });
      } else {
        console.log(`[CMSConnectionTest] Successfully connected to database. Found ${count} rows in contentful_config.`);
        setDbConnectionStatus({
          checked: true,
          success: true,
          rows: count
        });
        
        if (count === 0) {
          setNoConfigFound(true);
        }
      }
    } catch (error) {
      console.error('[CMSConnectionTest] Unexpected error during DB check:', error);
      setDbConnectionStatus({
        checked: true,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const handleConnectionTest = async () => {
    setIsLoading(true);
    setErrorDetails(null);
    setNoConfigFound(false);
    
    try {
      console.log('[CMSConnectionTest] Starting Contentful connection test');
      const result = await testContentfulConnection();
      console.log('[CMSConnectionTest] Test result:', result);

      if (result.success) {
        toast({
          title: 'Contentful Connection',
          description: (
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" />
              <span>{result.message}</span>
            </div>
          ),
          variant: 'default'
        });
      } else {
        // Check if this is a configuration missing error
        if (result.message.includes('No Contentful configuration found')) {
          console.warn('[CMSConnectionTest] No Contentful configuration found in database');
          setNoConfigFound(true);
        }
        
        // Store error details for display
        if (result.errorData) {
          setErrorDetails(result.errorData);
        }
        
        toast({
          title: 'Connection Error',
          description: (
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-red-500" />
              <span>{result.message}</span>
            </div>
          ),
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('[CMSConnectionTest] Unexpected error during test:', error);
      toast({
        title: 'Unexpected Error',
        description: (
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-500" />
            <span>Failed to test Contentful connection</span>
          </div>
        ),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {dbConnectionStatus.checked && (
        <Alert variant={dbConnectionStatus.success ? "default" : "destructive"} className="mb-4">
          <AlertTitle className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Database Connection Status
          </AlertTitle>
          <AlertDescription>
            {dbConnectionStatus.success ? (
              <>
                Successfully connected to Supabase database.
                {dbConnectionStatus.rows !== undefined && (
                  <p className="mt-1">
                    Found <strong>{dbConnectionStatus.rows}</strong> rows in contentful_config table.
                  </p>
                )}
              </>
            ) : (
              <>
                Error connecting to database: {dbConnectionStatus.error}
              </>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center space-x-2">
        <Button 
          onClick={handleConnectionTest} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            'Test Contentful Connection'
          )}
        </Button>
      </div>
      
      {noConfigFound && (
        <Alert variant="warning" className="mt-4 border-amber-200 bg-amber-50">
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium text-amber-800">No Contentful configuration found</p>
              <p className="text-sm text-amber-700">
                Please add your Contentful credentials in the Contentful Configuration section below.
              </p>
              <p className="text-sm text-amber-700">
                You'll need to enter your Space ID and Management Token to connect to Contentful.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {errorDetails && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>
            <div className="space-y-2 text-sm">
              <p><strong>Error Code:</strong> {errorDetails.status}</p>
              <p><strong>Message:</strong> {errorDetails.message}</p>
              {errorDetails.request?.url && (
                <p><strong>Request URL:</strong> {errorDetails.request.url}</p>
              )}
              <p className="text-xs text-gray-100 mt-2">
                This error typically indicates an invalid or expired management token. 
                Please check your Contentful credentials in the settings page.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CMSConnectionTest;
