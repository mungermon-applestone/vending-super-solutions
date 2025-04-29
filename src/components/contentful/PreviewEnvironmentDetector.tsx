
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Settings, CheckCircle } from 'lucide-react';
import { isPreviewEnvironment, isContentfulConfigured, CONTENTFUL_CONFIG } from '@/config/cms';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const PreviewEnvironmentDetector = () => {
  const navigate = useNavigate();
  const [isPreview, setIsPreview] = useState(false);
  const [configurationNeeded, setConfigurationNeeded] = useState(false);
  const [configStatus, setConfigStatus] = useState<{
    isConfigured: boolean;
    spaceId: string | null;
    hasToken: boolean;
    envId: string | null;
    source: string | null;
  }>({
    isConfigured: false,
    spaceId: null,
    hasToken: false,
    envId: null,
    source: null
  });
  
  useEffect(() => {
    // Detect if we're in a preview environment
    const preview = isPreviewEnvironment();
    setIsPreview(preview);
    
    // Check if we need to configure Contentful
    if (preview) {
      const configured = isContentfulConfigured();
      setConfigurationNeeded(!configured);
      
      // Set detailed config status
      setConfigStatus({
        isConfigured: configured,
        spaceId: CONTENTFUL_CONFIG.SPACE_ID || null,
        hasToken: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN,
        envId: CONTENTFUL_CONFIG.ENVIRONMENT_ID || null,
        source: window._contentfulInitialized === true ? 'runtime-config' : 
                window._contentfulInitialized ? String(window._contentfulInitialized) : 'unknown'
      });
      
      // Log information for debugging
      console.log('[PreviewEnvironmentDetector] Environment check:', {
        isPreview: preview,
        isConfigured: configured,
        needsConfig: !configured,
        configDetails: {
          spaceId: CONTENTFUL_CONFIG.SPACE_ID || null,
          hasToken: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN,
          envId: CONTENTFUL_CONFIG.ENVIRONMENT_ID || null,
          source: window._contentfulInitialized
        }
      });
    }
  }, []);
  
  // If not a preview environment, don't show anything
  if (!isPreview) {
    return null;
  }
  
  // Show configuration status for preview environments
  if (configStatus.isConfigured) {
    return (
      <Alert variant="default" className="mb-6 border-green-300 bg-green-50">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800 font-bold">Contentful Configuration Detected</AlertTitle>
          <Badge variant="outline" className="ml-auto border-green-300 text-green-700">Ready</Badge>
        </div>
        <AlertDescription className="space-y-3 text-green-700">
          <p>
            Your preview environment is properly configured with Contentful credentials.
            Space ID: <code className="bg-green-100 px-1 rounded">{configStatus.spaceId}</code>
          </p>
          <p className="text-xs text-green-600">
            Source: {configStatus.source === 'runtime-config' ? 'Runtime configuration file' : configStatus.source}
          </p>
        </AlertDescription>
      </Alert>
    );
  }
  
  // Show configuration needed alert
  return (
    <Alert variant="warning" className="mb-6 border-amber-300 bg-amber-50">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <AlertTitle className="text-amber-800 font-bold">Preview Environment Configuration Needed</AlertTitle>
        <Badge variant="warning" className="ml-auto">Action Required</Badge>
      </div>
      <AlertDescription className="space-y-3 text-amber-700">
        <p>
          You're viewing this site in a preview environment, but Contentful credentials are not configured.
          Content will appear as fallback data until you configure Contentful.
        </p>
        <div className="mt-3">
          <Button 
            variant="default" 
            onClick={() => navigate('/admin/environment-variables')}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Settings className="mr-2 h-4 w-4" />
            Configure Contentful Now
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default PreviewEnvironmentDetector;
