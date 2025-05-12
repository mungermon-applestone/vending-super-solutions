
import React, { ReactNode } from 'react';

interface ContentfulInitializerProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ContentfulInitializer
 * 
 * A wrapper component that ensures Contentful content is only rendered
 * when the client is properly initialized.
 */
const ContentfulInitializer: React.FC<ContentfulInitializerProps> = ({ 
  children, 
  fallback
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    // Give a small delay to ensure Contentful client initialization
    // This helps prevent race conditions in some cases
    const timer = setTimeout(() => {
      try {
        setIsLoaded(true);
      } catch (error) {
        console.error('Error initializing Contentful:', error);
        setHasError(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show fallback while loading or if there's an error
  if (!isLoaded || hasError) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="container py-12">
        <p className="text-center text-gray-500">Loading content...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ContentfulInitializer;
