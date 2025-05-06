
import React, { useEffect, useState } from 'react';
import { testContentfulConnection } from '@/lib/contentful/client';

interface ContentfulDiagnosticsProps {
  slug?: string;
  productId?: string;
}

export default function ContentfulDiagnostics({ slug, productId }: ContentfulDiagnosticsProps) {
  const [connectionStatus, setConnectionStatus] = useState<{success: boolean, message: string, details?: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [environmentVariables, setEnvironmentVariables] = useState<{
    spaceId?: string;
    accessToken?: string;
    environment?: string;
  }>({});
  
  // Get environment variables for display
  useEffect(() => {
    const getEnvSafely = (key: string, isSecret = false) => {
      let value;
      
      // Check window.env first (runtime config)
      if (typeof window !== 'undefined' && window.env && window.env[key]) {
        value = window.env[key];
      } 
      // Then check process.env
      else if (process.env[`NEXT_PUBLIC_${key}`]) {
        value = process.env[`NEXT_PUBLIC_${key}`];
      } else if (process.env[key]) {
        value = process.env[key];
      }
      
      if (!value) return 'Not set';
      
      // Mask secrets for security
      if (isSecret) return 'Set (hidden)';
      
      // Mask IDs for display (show first 4 chars and last 2)
      if (value.length <= 6) return '******';
      return `${value.slice(0, 4)}****${value.slice(-2)}`;
    };

    setEnvironmentVariables({
      spaceId: getEnvSafely('CONTENTFUL_SPACE_ID'),
      accessToken: getEnvSafely('CONTENTFUL_DELIVERY_TOKEN', true),
      environment: getEnvSafely('CONTENTFUL_ENVIRONMENT') === 'Not set' ? 'master' : getEnvSafely('CONTENTFUL_ENVIRONMENT')
    });
    
    // Debug information for troubleshooting
    console.log('ContentfulDiagnostics: Environment variables check', {
      windowEnvExists: typeof window !== 'undefined' && !!window.env,
      windowEnvKeys: typeof window !== 'undefined' && window.env ? Object.keys(window.env) : [],
      hardcodedSpaceId: "p8y13tvmv0uj",
      hardcodedTokenExists: true
    });
  }, []);
  
  // Test the connection when the component mounts
  useEffect(() => {
    const testConnection = async () => {
      setIsLoading(true);
      try {
        console.log('ContentfulDiagnostics: Testing connection');
        const result = await testContentfulConnection();
        console.log('ContentfulDiagnostics: Connection test result', result);
        setConnectionStatus(result);
      } catch (error) {
        console.error('ContentfulDiagnostics: Connection test error', error);
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
    <div className="text-xs bg-gray-100 p-4 rounded-md mb-4 border border-gray-300">
      <h4 className="font-bold mb-2 text-sm">Contentful Diagnostic Info</h4>
      <div className="space-y-2">
        <p><strong>Next.js Environment:</strong> {process.env.NODE_ENV}</p>
        <p><strong>Space ID:</strong> {environmentVariables.spaceId}</p>
        <p><strong>Environment:</strong> {environmentVariables.environment}</p>
        <p><strong>Has Delivery Token:</strong> {environmentVariables.accessToken !== 'Not set' ? 'Yes' : 'No'}</p>
        <p><strong>Using Hardcoded Credentials:</strong> Yes</p>
        <p><strong>Window.env Available:</strong> {typeof window !== 'undefined' && !!window.env ? 'Yes' : 'No'}</p>
        {typeof window !== 'undefined' && window.env && (
          <p><strong>Window.env Keys:</strong> {Object.keys(window.env).join(', ')}</p>
        )}
        {slug && <p><strong>Current Slug:</strong> {slug}</p>}
        {productId && <p><strong>Product ID:</strong> {productId}</p>}
        
        <div className="mt-4 pt-2 border-t border-gray-300">
          <p>
            <strong>Connection Test:</strong> 
            {isLoading ? 'Testing...' : 
              connectionStatus ? 
                (connectionStatus.success ? '✅ Connected' : '❌ Failed') : 
                'Not tested'}
          </p>
          {connectionStatus && (
            <div>
              <p className="text-xs mt-1">{connectionStatus.message}</p>
              {connectionStatus.details && (
                <p className="text-xs mt-1 text-red-600">{connectionStatus.details}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
