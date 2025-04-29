
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Settings } from 'lucide-react';
import { isPreviewEnvironment, isContentfulConfigured } from '@/config/cms';
import { useNavigate } from 'react-router-dom';

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
    <Alert variant="warning" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Preview Environment Configuration Needed</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>
          You're viewing this site in a preview environment, but Contentful credentials are not configured.
          Content will appear as fallback data until you configure Contentful.
        </p>
        <div className="mt-3">
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => navigate('/admin/environment-variables')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Configure Contentful
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default PreviewEnvironmentDetector;
