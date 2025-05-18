
import React from 'react';
import { useParams } from 'react-router-dom';
import { useContentfulMachine } from '@/hooks/cms/useContentfulMachines';
import MachineDetail from '@/components/machineDetail/MachineDetail';
import { Loader2 } from 'lucide-react';

const Option4Refrigerated = () => {
  const { machineId } = useParams<{ machineId: string }>();
  
  // Update to use the direct contentful hook
  const { data: machine, isLoading, error } = useContentfulMachine(machineId);

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
        <p>Loading machine information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>Error: {error instanceof Error ? error.message : 'An unknown error occurred'}</div>
    );
  }

  if (!machine) {
    return (
      <div>Machine not found.</div>
    );
  }

  return (
    <MachineDetail machine={machine} />
  );
};

export default Option4Refrigerated;
