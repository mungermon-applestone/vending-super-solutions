
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const MachinesEmptyState: React.FC = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-6 text-center">
      <h3 className="text-lg font-semibold text-amber-800 mb-2">No Machines Found in Contentful</h3>
      <p className="text-amber-600">
        No machines are currently available from Contentful. 
        This could be due to:
      </p>
      <ul className="text-amber-600 mt-2 list-disc list-inside text-left max-w-lg mx-auto">
        <li>No machine entries in Contentful</li>
        <li>Connection issues with Contentful API</li>
        <li>Data transformation errors</li>
      </ul>
      <p className="text-amber-600 mt-4">Check the browser console for detailed debugging information.</p>
    </div>
  );
};

export default MachinesEmptyState;
