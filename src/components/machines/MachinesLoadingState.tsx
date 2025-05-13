
import React from 'react';
import { Loader2 } from 'lucide-react';

const MachinesLoadingState = () => {
  return (
    <div className="py-12 text-center">
      <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
      <p>Loading machines from Contentful...</p>
    </div>
  );
};

export default MachinesLoadingState;
