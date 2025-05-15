
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  contentType?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary specifically for handling Contentful rendering errors
 */
class ContentfulErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidMount() {
    // Check for Contentful configuration
    const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
    const deliveryToken = import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN;

    if (!spaceId || !deliveryToken) {
      this.setState({ 
        hasError: true, 
        error: new Error("Contentful is not properly configured. Missing space ID or delivery token.") 
      });
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Contentful Error:", error);
    console.error("Error Details:", errorInfo);
  }

  public render() {
    const { hasError, error } = this.state;
    const { children, contentType = "content", fallback } = this.props;

    if (hasError) {
      return fallback || (
        <div className="bg-white rounded-lg shadow-md p-6 my-4 border border-red-200">
          <h3 className="text-lg font-semibold text-red-700 mb-2">
            Error Loading {contentType}
          </h3>
          <p className="text-gray-700 mb-4">
            There was a problem loading the {contentType} from Contentful.
          </p>
          {error && (
            <div className="bg-red-50 p-3 rounded text-sm font-mono text-red-800 overflow-auto">
              {error.message}
            </div>
          )}
          <p className="text-sm mt-4 text-gray-600">
            Please check your Contentful configuration and ensure the content exists.
          </p>
        </div>
      );
    }

    return children;
  }
}

export default ContentfulErrorBoundary;
