
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Check } from 'lucide-react';

interface TechnologyFeatureItemProps {
  icon: string;
  title: string;
  description: string;
  items?: string[]; // Add items prop
}

const TechnologyFeatureItem: React.FC<TechnologyFeatureItemProps> = ({ 
  icon, 
  title, 
  description,
  items = [] // Default to empty array
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
        
        {/* Display bullet points if available */}
        {items && items.length > 0 && (
          <ul className="mt-2 space-y-1">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-1.5">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TechnologyFeatureItem;
