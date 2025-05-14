
import React from 'react';
import { useContentfulInit } from '@/hooks/useContentfulInit';
import { Loader2 } from 'lucide-react';

interface ContentfulInitializerProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Simple wrapper component to handle Contentful initialization for blog content
 */
const ContentfulInitializer: React.FC<ContentfulInitializerProps> = ({ 
  children, 
  fallback 
}) => {
  const { isInitialized, isLoading, error } = useContentfulInit();

  // Still initializing
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
          <span className="text-sm text-gray-600">Connecting to Contentful...</span>
        </div>
      </div>
    );
  }

  // Initialization failed
  if (error || !isInitialized) {
    return fallback ? fallback : (
      <div className="p-4 border rounded shadow-sm bg-gray-50">
        <p className="text-red-500 mb-2">Failed to connect to Contentful</p>
        <p className="text-sm text-gray-600">Please check your Contentful configuration.</p>
      </div>
    );
  }

  // Successfully initialized
  return <>{children}</>;
};

export default ContentfulInitializer;
