
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface RefreshDataButtonProps {
  isLoading: boolean;
  onRefresh: () => void;
}

const RefreshDataButton: React.FC<RefreshDataButtonProps> = ({ isLoading, onRefresh }) => {
  return (
    <div className="flex justify-end mb-8">
      <Button onClick={onRefresh} variant="outline" className="flex items-center gap-2">
        Refresh Contentful Data <Loader2 className={`h-4 w-4 ${isLoading ? 'animate-spin' : 'hidden'}`} />
      </Button>
    </div>
  );
};

export default RefreshDataButton;
