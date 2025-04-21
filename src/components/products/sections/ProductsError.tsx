
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DebugInfo {
  spaceId?: string;
  environmentId?: string;
  hasToken: boolean;
}

interface ProductsErrorProps {
  error: Error | null;
  debugInfo: DebugInfo;
  onRetry: () => void;
}

const ProductsError = ({ error, debugInfo, onRetry }: ProductsErrorProps) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
      <div className="flex flex-col items-center">
        <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Products</h3>
        <p className="text-red-600 mb-4">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
        
        <div className="bg-white p-4 rounded border border-red-100 max-w-2xl mb-6 text-left">
          <p className="font-semibold mb-2 text-red-800">Contentful Environment Variables Status:</p>
          <ul className="text-sm space-y-1 mb-4">
            <li>Space ID: {debugInfo.spaceId ? '✓ Set' : '✗ Missing'}</li>
            <li>Environment ID: {debugInfo.environmentId ? '✓ Set' : '✗ Missing'}</li>
            <li>Delivery Token: {debugInfo.hasToken ? '✓ Set' : '✗ Missing'}</li>
          </ul>
          <p className="text-xs text-gray-600">
            Note: Make sure these variables are correctly set in your Vercel environment settings.
          </p>
        </div>
        
        <Button onClick={onRetry} variant="outline" className="flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    </div>
  );
};

export default ProductsError;
