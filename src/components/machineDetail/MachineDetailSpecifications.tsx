
import React from 'react';

export interface MachineDetailSpecificationsProps {
  specifications: Record<string, string>;
}

const MachineDetailSpecifications: React.FC<MachineDetailSpecificationsProps> = ({ specifications }) => {
  const specs = specifications || {};
  const specEntries = Object.entries(specs);
  
  if (specEntries.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Specifications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {specEntries.map(([key, value]) => (
          <div key={key} className="flex items-start">
            <div className="mr-3 text-blue-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-500">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
              <span className="text-gray-800">{value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MachineDetailSpecifications;
