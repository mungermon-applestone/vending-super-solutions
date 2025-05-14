
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  contentType?: string;
  fallbackComponent?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component specifically for catching Contentful-related errors
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
    console.error(`[ContentfulErrorBoundary] Error in ${this.props.contentType || 'component'}:`, {
      error,
      errorInfo,
      component: this.props.contentType || 'unknown'
    });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, contentType, fallbackComponent } = this.props;

    if (hasError) {
      // If a custom fallback component is provided, use it
      if (fallbackComponent) {
        return fallbackComponent;
      }

      // Default error UI
      return (
        <Alert variant="destructive" className="my-4">
          <AlertTitle>Error Loading {contentType || 'Content'}</AlertTitle>
          <AlertDescription>
            <p className="mb-2">{error?.message || 'An unexpected error occurred'}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={this.handleReset} 
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return children;
  }
}

export default ContentfulErrorBoundary;
