
import React from 'react';
import { Info, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyProductsListProps {
  debugInfo: {
    spaceId?: string;
  };
  onRefresh: () => void;
}

const EmptyProductsList = ({ debugInfo, onRefresh }: EmptyProductsListProps) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
      <div className="flex flex-col items-center">
        <Info className="h-8 w-8 text-gray-500 mb-2" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Found</h3>
        <p className="text-gray-600 mb-4">No products are currently available in your Contentful space.</p>
        
        <p className="text-sm bg-white p-3 rounded border border-gray-100 max-w-2xl mb-4 text-left">
          To add products to your Contentful space:
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Log in to your Contentful account</li>
            <li>Navigate to your space: "{debugInfo.spaceId || 'al01e4yh2wq4'}"</li>
            <li>Go to Content &gt; Add entry &gt; Product Type</li>
            <li>Create products with title, slug, description and image</li>
            <li>Publish your entries</li>
          </ol>
        </p>
        
        <Button onClick={onRefresh} variant="outline" className="flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default EmptyProductsList;
