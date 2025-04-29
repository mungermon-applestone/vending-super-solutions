
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Settings, CheckCircle, RefreshCw } from 'lucide-react';
import { isPreviewEnvironment, CONTENTFUL_CONFIG } from '@/config/cms';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { refreshContentfulClient } from '@/services/cms/utils/contentfulClient';

const PreviewEnvironmentDetector = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [configStatus, setConfigStatus] = useState({
    spaceId: '',
    hasToken: false,
    source: ''
  });
  
  // Only show in preview environments
  if (!isPreviewEnvironment()) return null;
  
  useEffect(() => {
    // Collect configuration information
    setConfigStatus({
      spaceId: CONTENTFUL_CONFIG.SPACE_ID,
      hasToken: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN,
      source: typeof window !== 'undefined' ? 
        window._contentfulInitializedSource || 'unknown' : 
        'unknown'
    });
  }, []);
  
  const refreshCredentials = async () => {
    setIsRefreshing(true);
    try {
      await refreshContentfulClient();
      toast.success("Contentful client refreshed successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to refresh Contentful client");
      console.error("[PreviewEnvironmentDetector] Failed to refresh client:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Show successful configuration for preview environment
  return (
    <Alert variant="default" className="mb-6 border-green-300 bg-green-50">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-800 font-bold">Preview Environment Detected</AlertTitle>
        <Badge variant="outline" className="ml-auto border-green-300 text-green-700">Ready</Badge>
      </div>
      <AlertDescription className="space-y-3 text-green-700">
        <p>
          Using Contentful credentials for preview environment.
          Space ID: <code className="bg-green-100 px-1 rounded">{configStatus.spaceId}</code>
        </p>
        <div className="flex justify-between items-center text-xs mt-2">
          <span>Source: {configStatus.source === 'preview-hardcoded' 
            ? 'Preview environment credentials' 
            : configStatus.source}
          </span>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 text-xs"
            onClick={refreshCredentials}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3 mr-1" />
            )}
            Refresh
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default PreviewEnvironmentDetector;
