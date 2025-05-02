
import React, { ErrorInfo, Component, ReactNode } from 'react';

interface VideoErrorBoundaryProps {
  children: ReactNode;
  fallbackImage?: string;
  className?: string;
}

interface VideoErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class VideoErrorBoundary extends Component<VideoErrorBoundaryProps, VideoErrorBoundaryState> {
  constructor(props: VideoErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): VideoErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`[VideoErrorBoundary] Error rendering video:`, error);
    console.error(`[VideoErrorBoundary] Component stack:`, errorInfo.componentStack);
  }

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallbackImage, className } = this.props;

    if (hasError) {
      // If there's an error, show the fallback image or an error message
      if (fallbackImage) {
        return (
          <div className={className}>
            <img 
              src={fallbackImage} 
              alt="Video unavailable" 
              className="w-full h-auto rounded-lg"
            />
            <p className="mt-2 text-xs text-gray-500 text-center">
              Video playback unavailable
            </p>
          </div>
        );
      }
      
      return (
        <div className={`p-4 bg-gray-100 rounded-lg text-center ${className}`}>
          <p className="text-gray-700">Unable to play video</p>
          <p className="text-xs text-gray-500 mt-2">
            {error?.message || 'An unknown error occurred'}
          </p>
        </div>
      );
    }

    return children;
  }
}

export default VideoErrorBoundary;
