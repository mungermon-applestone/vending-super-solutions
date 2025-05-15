
import React, { ErrorInfo, Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  contentType: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * A component that catches errors in Contentful data rendering and displays
 * a helpful fallback UI instead of crashing the app.
 */
class ContentfulErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`[ContentfulErrorBoundary] Error rendering ${this.props.contentType}:`, error);
    console.error(`[ContentfulErrorBoundary] Component stack:`, errorInfo.componentStack);
  }

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback, contentType } = this.props;

    if (hasError) {
      // If there's a custom fallback, use it
      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <div className="p-6 border border-amber-200 bg-amber-50 rounded-lg text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle size={32} className="text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-amber-800 mb-2">
            Content Display Error
          </h3>
          <p className="text-amber-700 mb-4">
            There was an error displaying {contentType} content.
          </p>
          {error && (
            <p className="text-sm text-amber-600 bg-amber-100 p-3 rounded mb-4 max-w-md mx-auto overflow-auto">
              {error.message}
            </p>
          )}
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="border-amber-400 text-amber-700 hover:bg-amber-100"
          >
            Try Again
          </Button>
        </div>
      );
    }

    return children;
  }
}

export default ContentfulErrorBoundary;
