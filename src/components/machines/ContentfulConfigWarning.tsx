
import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { isContentfulConfigured } from '@/config/cms';
import { refreshContentfulClient, testContentfulConnection } from '@/services/cms/utils/contentfulClient';
import { toast } from 'sonner';

interface ContentfulConfigWarningProps {
  onRetry?: () => void;
  showDetails?: boolean;
}

const ContentfulConfigWarning: React.FC<ContentfulConfigWarningProps> = ({ 
  onRetry,
  showDetails = true 
}) => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const configured = isContentfulConfigured();

  const handleRefreshConnection = async () => {
    setIsRefreshing(true);
    try {
      await refreshContentfulClient();
      const result = await testContentfulConnection();
      
      if (result.success) {
        toast.success("Contentful connection refreshed successfully!");
        // Set global flag to indicate successful connection
        window._contentfulInitialized = true;
        
        if (onRetry) {
          onRetry();
        } else {
          // Reload page as fallback
          window.location.reload();
        }
      } else {
        toast.error("Failed to connect to Contentful. Please check your credentials.");
      }
    } catch (error) {
      console.error("[ContentfulConfigWarning] Error refreshing connection:", error);
      toast.error("Failed to refresh Contentful connection");
    } finally {
      setIsRefreshing(false);
    }
  };

  const goToEnvironmentSettings = () => {
    navigate('/admin/environment-variables');
  };

  return (
    <Alert variant="warning" className="mb-8">
      <AlertTriangle className="h-5 w-5 text-amber-600" />
      <AlertTitle className="text-amber-800">Contentful {configured ? 'Connection Issue' : 'Not Configured'}</AlertTitle>
      <AlertDescription>
        <div className="mt-2 text-amber-700 space-y-3">
          <p>
            {configured 
              ? "There was a problem connecting to Contentful. Your credentials appear valid but the connection failed." 
              : "Please set up your Contentful Space ID and Delivery Token to display content."}
          </p>
          
          {showDetails && (
            <div className="p-2 bg-amber-50 border border-amber-200 rounded text-sm">
              <p className="mb-1">Using fallback data for preview purposes.</p>
              <p className="text-xs">Credential source: {typeof window !== 'undefined' ? window._contentfulInitialized || 'Unknown' : 'Unknown'}</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white" 
              onClick={handleRefreshConnection}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh Connection
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white"
              onClick={goToEnvironmentSettings}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configure Credentials
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ContentfulConfigWarning;
