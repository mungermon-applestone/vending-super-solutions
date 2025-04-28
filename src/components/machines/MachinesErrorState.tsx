
import React from 'react';
import { Button } from '@/components/ui/button';

interface MachinesErrorStateProps {
  error: Error | unknown;
  onRetry: () => void;
}

const MachinesErrorState: React.FC<MachinesErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
      <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Machines from Contentful</h3>
      <p className="text-red-600">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
      <Button onClick={onRetry} className="mt-4" variant="outline">
        Try Again
      </Button>
    </div>
  );
};

export default MachinesErrorState;
