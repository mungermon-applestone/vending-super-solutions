
import React from 'react';

interface TechnologyFeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const TechnologyFeatureItem: React.FC<TechnologyFeatureItemProps> = ({ 
  icon, 
  title, 
  description 
}) => {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 mt-1 bg-blue-50 p-2 rounded-full">
        {icon}
      </div>
      <div className="text-left">
        <h3 className="font-medium text-lg leading-tight mb-0.5">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default TechnologyFeatureItem;
