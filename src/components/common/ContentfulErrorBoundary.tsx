import React, { Component, ErrorInfo, ReactNode } from 'react';
import ContentfulFallbackMessage from './ContentfulFallbackMessage';

interface Props {
  children: ReactNode;
  contentType: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component specifically for Contentful content rendering
 * Catches errors that occur during rendering of Contentful content
 */
class ContentfulErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Contentful Error Boundary caught error for ${this.props.contentType}:`, error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  public render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, render that instead
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Otherwise use the default fallback message
      return (
        <ContentfulFallbackMessage
          title={`Error Rendering ${this.props.contentType}`}
          message={this.state.error?.message || 'An unexpected error occurred while rendering content.'}
          contentType={this.props.contentType}
        />
      );
    }

    return this.props.children;
  }
}

export default ContentfulErrorBoundary;
