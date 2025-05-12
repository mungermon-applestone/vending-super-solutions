
import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  contentType?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component specifically for Contentful content
 * Catches errors in Contentful content rendering and displays a friendly message
 */
class ContentfulErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`[ContentfulErrorBoundary] Error rendering ${this.props.contentType || 'content'}:`, error);
    console.error(errorInfo);
  }

  render(): ReactNode {
    const { contentType = 'content' } = this.props;
    
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-4 border rounded bg-amber-50 border-amber-200">
          <h3 className="text-amber-800 font-medium mb-2">
            Unable to display {contentType}
          </h3>
          <p className="text-amber-700 text-sm">
            There was an error rendering this {contentType}. Please try refreshing the page.
          </p>
          {this.state.error && (
            <p className="text-xs text-amber-600 mt-2 font-mono">
              Error: {this.state.error.message}
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ContentfulErrorBoundary;
