
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Server, Database, Check, AlertTriangle, X } from 'lucide-react';
import { getCMSInfo } from '@/services/cms/utils/cmsInfo';
import { Button } from '@/components/ui/button';
import { testCMSConnection } from '@/services/cms/utils/connection';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Component that displays detailed information about the current CMS provider
 * with connection testing functionality
 */
export const CMSProviderDisplay: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<{
    testing: boolean;
    tested: boolean;
    success?: boolean;
    message?: string;
    details?: any;
  }>({
    testing: false,
    tested: false
  });
  
  const cmsInfo = getCMSInfo();

  const handleTestConnection = async () => {
    setConnectionStatus({ testing: true, tested: false });
    
    try {
      const result = await testCMSConnection();
      setConnectionStatus({
        testing: false,
        tested: true,
        success: result.success,
        message: result.message,
        details: result.details
      });
    } catch (error) {
      setConnectionStatus({
        testing: false,
        tested: true,
        success: false,
        message: `Error testing connection: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          {cmsInfo.provider === 'Strapi' ? (
            <Server className="h-5 w-5 text-primary" />
          ) : (
            <Database className="h-5 w-5 text-primary" />
          )}
          CMS Provider
        </CardTitle>
        <CardDescription>
          Current content management system configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Provider:</span>
            <Badge variant={cmsInfo.provider === 'Strapi' ? 'outline' : 'default'}>
              {cmsInfo.provider}
            </Badge>
          </div>
          
          {cmsInfo.provider === 'Strapi' && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API URL:</span>
                <span className="text-sm font-mono max-w-[200px] truncate">
                  {cmsInfo.apiUrl || 'Not configured'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Key:</span>
                <Badge 
                  variant={cmsInfo.apiKeyConfigured ? 'outline' : 'destructive'}
                  className={cmsInfo.apiKeyConfigured ? 'text-green-600 border-green-600' : ''}
                >
                  {cmsInfo.apiKeyConfigured ? 'Configured' : 'Missing'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <Badge 
                  variant={
                    cmsInfo.status === 'configured' ? 'default' : 
                    cmsInfo.status === 'partial' ? 'outline' : 'destructive'
                  }
                >
                  {cmsInfo.status === 'configured' ? 'Fully Configured' : 
                   cmsInfo.status === 'partial' ? 'Partially Configured' : 'Not Configured'}
                </Badge>
              </div>
            </>
          )}
          
          {cmsInfo.provider === 'Supabase' && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant="default" className="bg-green-600">
                <Check className="h-3 w-3 mr-1" /> Ready
              </Badge>
            </div>
          )}
        </div>
        
        <div className="pt-2">
          <Button 
            size="sm" 
            onClick={handleTestConnection}
            disabled={connectionStatus.testing}
            variant="outline"
            className="w-full"
          >
            {connectionStatus.testing ? 'Testing...' : 'Test Connection'}
          </Button>
        </div>
        
        {connectionStatus.tested && (
          <Alert variant={connectionStatus.success ? "default" : "destructive"} className="mt-4">
            {connectionStatus.success ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertDescription className="flex flex-col">
              <span className="font-medium">
                {connectionStatus.success ? 'Connection Successful' : 'Connection Failed'}
              </span>
              <span className="text-sm">{connectionStatus.message}</span>
            </AlertDescription>
          </Alert>
        )}

        {cmsInfo.provider === 'Strapi' && (
          <div className="text-xs text-muted-foreground mt-2">
            <div className="flex items-center justify-between">
              <span>Strapi Admin Panel:</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 p-1"
                disabled={!cmsInfo.apiUrl}
                onClick={() => {
                  if (cmsInfo.apiUrl) {
                    window.open(cmsInfo.apiUrl.replace(/\/api\/?$/, '/admin'), '_blank');
                  }
                }}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CMSProviderDisplay;
