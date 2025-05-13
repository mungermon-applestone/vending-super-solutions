
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MachinesErrorStateProps {
  error: unknown;
  onRetry: () => void;
}

const MachinesErrorState: React.FC<MachinesErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="p-8 text-center border border-red-200 rounded-lg bg-red-50">
      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Machines</h3>
      <p className="text-red-600 mb-4">
        {error instanceof Error ? error.message : 'An unknown error occurred'}
      </p>
      <Button onClick={onRetry} variant="default">
        Try Again
      </Button>
    </div>
  );
};

export default MachinesErrorState;
