
import React, { useEffect, useState } from 'react';
import { testContentfulConnection } from '@/lib/contentful/client';

interface ContentfulDiagnosticsProps {
  slug?: string;
  productId?: string;
}

export default function ContentfulDiagnostics({ slug, productId }: ContentfulDiagnosticsProps) {
  const [connectionStatus, setConnectionStatus] = useState<{success: boolean, message: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Hardcoded credentials for display
  const credentials = {
    spaceId: "p8y13tvmv0uj", 
    accessToken: "fyVJxmu9K8jX3kcWHa0yEFIsvdzY5U-gkOcxU0JNxtU",
    environment: "master"
  };
  
  // Test the connection when the component mounts
  useEffect(() => {
    const testConnection = async () => {
      setIsLoading(true);
      try {
        console.log('[ContentfulDiagnostics] Testing connection');
        const result = await testContentfulConnection();
        console.log('[ContentfulDiagnostics] Connection test result', result);
        setConnectionStatus(result);
      } catch (error) {
        console.error('[ContentfulDiagnostics] Connection test error', error);
        setConnectionStatus({ 
          success: false, 
          message: error instanceof Error ? error.message : 'Unknown error'
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
        <p><strong>Space ID:</strong> {credentials.spaceId.substring(0, 4)}...{credentials.spaceId.substring(credentials.spaceId.length-2)}</p>
        <p><strong>Environment:</strong> {credentials.environment}</p>
        <p><strong>Using Hardcoded Credentials:</strong> Yes</p>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
