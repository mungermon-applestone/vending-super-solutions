
import React, { useEffect, useState } from 'react';
import { testContentfulConnection } from '@/lib/contentful/client';

interface ContentfulDiagnosticsProps {
  slug?: string;
  productId?: string;
}

export default function ContentfulDiagnostics({ slug, productId }: ContentfulDiagnosticsProps) {
  const [connectionStatus, setConnectionStatus] = useState<{success: boolean, message: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Test the connection when the component mounts
  useEffect(() => {
    const testConnection = async () => {
      setIsLoading(true);
      try {
        const result = await testContentfulConnection();
        setConnectionStatus(result);
      } catch (error) {
        setConnectionStatus({ success: false, message: error instanceof Error ? error.message : 'Unknown error' });
      } finally {
        setIsLoading(false);
      }
    };
    
    testConnection();
  }, []);

  return (
    <div className="text-xs bg-gray-100 p-4 rounded-md mb-4">
      <h4 className="font-bold mb-1">Contentful Diagnostic Info</h4>
      <div className="space-y-1">
        <p><strong>Next.js Environment:</strong> {process.env.NODE_ENV}</p>
        <p><strong>Space ID:</strong> {process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || process.env.CONTENTFUL_SPACE_ID || 'Not set'}</p>
        <p><strong>Environment:</strong> {process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || process.env.CONTENTFUL_ENVIRONMENT || 'master'}</p>
        <p><strong>Has Delivery Token:</strong> {(!!process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || !!process.env.CONTENTFUL_DELIVERY_TOKEN) ? 'Yes' : 'No'}</p>
        {slug && <p><strong>Current Slug:</strong> {slug}</p>}
        {productId && <p><strong>Product ID:</strong> {productId}</p>}
        
        <div className="mt-4 pt-2 border-t border-gray-300">
          <p><strong>Connection Test:</strong> {isLoading ? 'Testing...' : connectionStatus ? (connectionStatus.success ? '✅ Connected' : '❌ Failed') : 'Not tested'}</p>
          {connectionStatus && <p className="text-xs mt-1">{connectionStatus.message}</p>}
        </div>
      </div>
    </div>
  );
}
