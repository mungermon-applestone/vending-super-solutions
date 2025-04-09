
import React from 'react';
import SpecificationItem from './SpecificationItem';

interface SpecificationsSectionProps {
  specs: {
    [key: string]: string | undefined;
  };
}

const SpecificationsSection: React.FC<SpecificationsSectionProps> = ({ specs }) => {
  // Get all specification keys for rendering
  const specKeys = Object.keys(specs);
  
  // Split specs into two columns for better visual layout
  const leftColSpecs = specKeys.slice(0, Math.ceil(specKeys.length / 2));
  const rightColSpecs = specKeys.slice(Math.ceil(specKeys.length / 2));

  if (specKeys.length === 0) {
    return (
      <p className="text-center text-gray-500">No specifications available for this machine.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left column */}
      <div className="space-y-6">
        {leftColSpecs.map(key => (
          <SpecificationItem 
            key={key} 
            specKey={key} 
            value={specs[key] || ''} 
          />
        ))}
      </div>
      
      {/* Right column */}
      <div className="space-y-6">
        {rightColSpecs.map(key => (
          <SpecificationItem 
            key={key} 
            specKey={key} 
            value={specs[key] || ''} 
          />
        ))}
      </div>
    </div>
  );
};

export default SpecificationsSection;
