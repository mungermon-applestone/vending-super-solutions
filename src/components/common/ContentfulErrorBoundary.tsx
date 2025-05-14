
import React from 'react';
import { isContentfulConfigured } from '@/config/cms';

interface ContentfulErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  contentType?: string;
}

interface ContentfulErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary specifically for Contentful-related errors
 * Catches errors in children and displays a fallback UI
 */
class ContentfulErrorBoundary extends React.Component<
  ContentfulErrorBoundaryProps, 
  ContentfulErrorBoundaryState
> {
  constructor(props: ContentfulErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[ContentfulErrorBoundary] Error rendering ${this.props.contentType || 'component'}:`, error);
    console.error('[ContentfulErrorBoundary] Component stack:', errorInfo.componentStack);
  }

  render() {
    const { children, fallback, contentType = 'content' } = this.props;
    const { hasError, error } = this.state;
    
    // If Contentful is not configured, show a special message
    if (!isContentfulConfigured()) {
      return fallback || (
        <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md">
          <p className="text-yellow-800">Contentful is not configured. Please set up your environment variables.</p>
        </div>
      );
    }

    // If there's an error, show the fallback or default error message
    if (hasError) {
      return fallback || (
        <div className="p-4 border border-red-200 bg-red-50 rounded-md">
          <p className="text-red-800">
            Error loading {contentType}: {error?.message || 'Unknown error'}
          </p>
        </div>
      );
    }

    // No error, render children
    return children;
  }
}

export default ContentfulErrorBoundary;
