
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RefreshDataButtonProps {
  isLoading: boolean;
  onRefresh: () => void;
}

const RefreshDataButton: React.FC<RefreshDataButtonProps> = ({ isLoading, onRefresh }) => {
  return (
    <div className="flex justify-end mb-6">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh}
        disabled={isLoading}
        className="flex items-center"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
        {isLoading ? 'Refreshing...' : 'Refresh Data'}
      </Button>
    </div>
  );
};

export default RefreshDataButton;
