
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Settings } from 'lucide-react';
import { isPreviewEnvironment, isContentfulConfigured } from '@/config/cms';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const PreviewEnvironmentDetector = () => {
  const navigate = useNavigate();
  const [isPreview, setIsPreview] = useState(false);
  const [configurationNeeded, setConfigurationNeeded] = useState(false);
  
  useEffect(() => {
    // Detect if we're in a preview environment
    const preview = isPreviewEnvironment();
    setIsPreview(preview);
    
    // Check if we need to configure Contentful
    if (preview) {
      const configured = isContentfulConfigured();
      setConfigurationNeeded(!configured);
      
      // Log information for debugging
      console.log('[PreviewEnvironmentDetector] Environment check:', {
        isPreview: preview,
        isConfigured: configured,
        needsConfig: !configured
      });
    }
  }, []);
  
  // Only show the alert if we're in a preview environment and need configuration
  if (!isPreview || !configurationNeeded) {
    return null;
  }
  
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
