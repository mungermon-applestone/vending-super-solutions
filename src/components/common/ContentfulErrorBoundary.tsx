
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  contentType?: string;
  showDetails?: boolean;
  onRetry?: () => Promise<void>;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isRetrying: boolean;
}

class ContentfulErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    isRetrying: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render shows the fallback UI
    return { 
      hasError: true, 
      error, 
      errorInfo: null,
      isRetrying: false
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to the console
    console.error('[ContentfulErrorBoundary] Error caught:', {
      error,
      errorInfo: errorInfo.componentStack,
      component: this.props.contentType || 'unknown'
    });
    
    this.setState({ 
      error, 
      errorInfo 
    });
  }

  private handleRetry = async (): Promise<void> => {
    this.setState({ isRetrying: true });
    
    try {
      // If onRetry prop exists, call it
      if (this.props.onRetry) {
        await this.props.onRetry();
      }
      
      // Reset the error state
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isRetrying: false
      });
    } catch (error) {
      // If retry fails, update state with new error
      this.setState({
        hasError: true,
        error: error instanceof Error ? error : new Error(String(error)),
        isRetrying: false
      });
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      const contentType = this.props.contentType || 'content';
      
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-4 text-center">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Unable to load {contentType}
          </h3>
          <p className="text-gray-600 mb-4">
            There was a problem loading the {contentType} from our CMS.
          </p>
          
          {this.props.showDetails && this.state.error && (
            <div className="bg-gray-100 p-3 rounded text-left text-sm mb-4 overflow-auto max-h-40">
              <p className="font-mono text-red-600">
                {this.state.error.toString()}
              </p>
              {this.state.errorInfo && (
                <pre className="text-xs text-gray-600 mt-2">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          )}
          
          <Button 
            onClick={this.handleRetry} 
            disabled={this.state.isRetrying}
            variant="outline"
            className="mt-2"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${this.state.isRetrying ? 'animate-spin' : ''}`} />
            {this.state.isRetrying ? 'Retrying...' : 'Try Again'}
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ContentfulErrorBoundary;
