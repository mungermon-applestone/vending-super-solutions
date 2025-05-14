
import React from 'react';
import ContentfulInitializer from '@/components/contentful/ContentfulInitializer';

// This is just a wrapper component to maintain backward compatibility
const BlogContentfulInitializer: React.FC<React.PropsWithChildren<{fallback?: React.ReactNode}>> = ({
  children,
  fallback
}) => {
  return (
    <ContentfulInitializer fallback={fallback}>
      {children}
    </ContentfulInitializer>
  );
};

export default BlogContentfulInitializer;
