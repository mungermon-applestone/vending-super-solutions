
import React from 'react';
import { CMSMachine } from '@/types/cms';
import { normalizeMachineData } from '@/utils/machineDataAdapter';

interface MachinePageTemplateProps {
  machines?: CMSMachine[];
  machine?: CMSMachine;
  title?: string;
  description?: string;
}

const MachinePageTemplate: React.FC<MachinePageTemplateProps> = ({ 
  machines = [], 
  machine,
  title, 
  description 
}) => {
  // If a single machine is provided, use that; otherwise use the machines array
  // Also normalize any machine data passed to ensure compatibility
  let machinesToDisplay: CMSMachine[] = [];
  
  if (machine) {
    machinesToDisplay = [normalizeMachineData(machine)];
  } else if (machines && machines.length > 0) {
    machinesToDisplay = machines.map(m => normalizeMachineData(m));
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {title && (
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
      )}
      {description && (
        <p className="text-gray-600 mb-8">{description}</p>
      )}
      
      {machinesToDisplay.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machinesToDisplay.map((machine) => (
            <div key={machine.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {machine.images && machine.images.length > 0 && (
                <img 
                  src={machine.images[0].url} 
                  alt={machine.images[0].alt || machine.title} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{machine.title}</h2>
                <p className="text-gray-600 mb-4">{machine.description}</p>
                {machine.temperature && (
                  <div className="text-sm text-gray-500 mb-2">
                    Temperature: {machine.temperature}
                  </div>
                )}
                {machine.specs && machine.specs.dimensions && (
                  <div className="text-sm text-gray-500">
                    Dimensions: {machine.specs.dimensions}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p>No machines found.</p>
        </div>
      )}
    </div>
  );
};

export default MachinePageTemplate;
