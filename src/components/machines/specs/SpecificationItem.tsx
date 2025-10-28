
import React from 'react';
import { getSpecIcon } from './specIcon';

interface SpecificationItemProps {
  specKey: string;
  value: string;
  formattedLabel?: string;
}

const SpecificationItem: React.FC<SpecificationItemProps> = ({ 
  specKey, 
  value,
  formattedLabel
}) => {
  // Use the formatted label if provided, otherwise format the key
  const displayLabel = formattedLabel || formatSpecLabel(specKey);

  return (
    <div>
      <h3 className="text-lg font-medium mb-3 flex items-center">
        {getSpecIcon(specKey)}
        {displayLabel}
      </h3>
      <p className="text-gray-700">{value}</p>
    </div>
  );
};

// Helper function to make a spec label more readable
export const formatSpecLabel = (key: string): string => {
  // First, handle camelCase by inserting space before uppercase letters
  let formatted = key.replace(/([a-z])([A-Z])/g, '$1 $2');
  
  // Replace underscores and hyphens with spaces
  formatted = formatted.replace(/[_-]/g, ' ');
  
  // Capitalize first letter of each word
  formatted = formatted.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
  
  return formatted;
};

export default SpecificationItem;
