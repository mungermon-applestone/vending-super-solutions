
import React from 'react';
import { Package2 } from 'lucide-react';

const MachinesEmptyState = () => {
  return (
    <div className="p-8 text-center border border-gray-200 rounded-lg bg-gray-50">
      <Package2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Machines Available</h3>
      <p className="text-gray-600">
        No machines were found in the Contentful database. Please check your configuration and content setup.
      </p>
    </div>
  );
};

export default MachinesEmptyState;
