
import React from 'react';
import * as LucideIcons from 'lucide-react';

interface TechnologyFeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

const TechnologyFeatureItem: React.FC<TechnologyFeatureItemProps> = ({ 
  icon, 
  title, 
  description 
}) => {
  // Dynamically get the icon component from lucide-react
  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.HelpCircle;
  
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 mt-1 bg-blue-50 p-2 rounded-full">
        <IconComponent className="h-5 w-5 text-blue-500" />
      </div>
      <div className="text-left">
        <h3 className="font-medium text-lg leading-tight mb-0.5">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default TechnologyFeatureItem;
