
import React, { useEffect, useState } from 'react';
import { testContentfulConnection } from '@/lib/contentful/client';

interface ContentfulDiagnosticsProps {
  slug?: string;
  productId?: string;
}

export default function ContentfulDiagnostics({ slug, productId }: ContentfulDiagnosticsProps) {
  const [connectionStatus, setConnectionStatus] = useState<{success: boolean, message: string, details?: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [environmentVariables, setEnvironmentVariables] = useState<{
    spaceId?: string;
    accessToken?: string;
    environment?: string;
  }>({});
  
  // Get environment variables for display
  useEffect(() => {
    // Only show first few chars of IDs for security
    const maskString = (str?: string) => {
      if (!str) return 'Not set';
      if (str.length <= 5) return '****' + str.slice(-2);
      return str.slice(0, 4) + '****' + str.slice(-2);
    };

    setEnvironmentVariables({
      spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || 
               process.env.CONTENTFUL_SPACE_ID || 
               (typeof window !== 'undefined' && window.env?.CONTENTFUL_SPACE_ID),
      accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || 
                   process.env.CONTENTFUL_DELIVERY_TOKEN || 
                   (typeof window !== 'undefined' && window.env?.CONTENTFUL_DELIVERY_TOKEN) ? 
                   'Set (hidden)' : undefined,
      environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 
                  process.env.CONTENTFUL_ENVIRONMENT || 
                  (typeof window !== 'undefined' && window.env?.CONTENTFUL_ENVIRONMENT) || 
                  'master'
    });
  }, []);
  
  // Test the connection when the component mounts
  useEffect(() => {
    const testConnection = async () => {
      setIsLoading(true);
      try {
        const result = await testContentfulConnection();
        setConnectionStatus(result);
      } catch (error) {
        setConnectionStatus({ 
          success: false, 
          message: error instanceof Error ? error.message : 'Unknown error',
          details: 'Check console for more information'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    testConnection();
  }, []);

  return (
    <div className="text-xs bg-gray-100 p-4 rounded-md mb-4">
      <h4 className="font-bold mb-2">Contentful Diagnostic Info</h4>
      <div className="space-y-2">
        <p><strong>Next.js Environment:</strong> {process.env.NODE_ENV}</p>
        <p><strong>Space ID:</strong> {environmentVariables.spaceId ? 
          (environmentVariables.spaceId.length > 5 ? 
            `${environmentVariables.spaceId.substring(0, 3)}...${environmentVariables.spaceId.substring(environmentVariables.spaceId.length - 3)}` : 
            '***') 
          : 'Not set'}</p>
        <p><strong>Environment:</strong> {environmentVariables.environment || 'master'}</p>
        <p><strong>Has Delivery Token:</strong> {environmentVariables.accessToken ? 'Yes' : 'No'}</p>
        {slug && <p><strong>Current Slug:</strong> {slug}</p>}
        {productId && <p><strong>Product ID:</strong> {productId}</p>}
        
        <div className="mt-4 pt-2 border-t border-gray-300">
          <p><strong>Connection Test:</strong> {isLoading ? 'Testing...' : connectionStatus ? (connectionStatus.success ? '✅ Connected' : '❌ Failed') : 'Not tested'}</p>
          {connectionStatus && (
            <div>
              <p className="text-xs mt-1">{connectionStatus.message}</p>
              {connectionStatus.details && (
                <p className="text-xs mt-1 text-red-600">{connectionStatus.details}</p>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-2 border-t border-gray-300">
          <p className="text-xs mt-1">
            <strong>How to fix:</strong> Make sure your Contentful Space ID and Delivery Token are correctly set in the environment variables.
            Verify that you have published content in your Contentful space.
          </p>
        </div>
      </div>
    </div>
  );
}
