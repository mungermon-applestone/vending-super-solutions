import React from 'react';
import { CMSMachine } from '@/types/cms';

interface MachinePageTemplateProps {
  machines: CMSMachine[];
  title?: string;
  description?: string;
}

const MachinePageTemplate: React.FC<MachinePageTemplateProps> = ({ 
  machines = [], 
  title, 
  description 
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {title && (
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
      )}
      {description && (
        <p className="text-gray-600 mb-8">{description}</p>
      )}
      
      {machines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((machine) => (
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
                {machine.dimensions && (
                  <div className="text-sm text-gray-500">
                    Dimensions: {machine.dimensions}
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
