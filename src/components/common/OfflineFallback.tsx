
import React from 'react';
import { WifiOff, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface OfflineFallbackProps {
  onRetry?: () => void;
}

const OfflineFallback: React.FC<OfflineFallbackProps> = ({ onRetry }) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-gray-50 p-8 rounded-lg shadow-sm max-w-md w-full">
        <div className="bg-yellow-50 p-4 rounded-full inline-flex items-center justify-center mb-6">
          <WifiOff className="h-8 w-8 text-yellow-600" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">You're offline</h1>
        
        <p className="text-gray-600 mb-6">
          The content you're trying to access is currently not available offline. Please check your 
          connection and try again.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry Connection
          </Button>
          
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-8">
        <p className="text-sm text-gray-500">
          Some content may be available offline if you've visited it before.
        </p>
      </div>
    </div>
  );
};

export default OfflineFallback;
