
import React from 'react';
import { Server, Package, ArrowRight } from 'lucide-react';

interface MachineTypeIconProps {
  type: string | React.ReactNode;
  size?: number;
  className?: string;
}

const MachineTypeIcon: React.FC<MachineTypeIconProps> = ({ type, size = 4, className }) => {
  // If type is a React element, return it directly
  if (React.isValidElement(type)) {
    return type;
  }
  
  // Ensure we're working with a string before calling toLowerCase
  const typeString = typeof type === 'string' ? type.toLowerCase() : '';
  
  switch (typeString) {
    case 'vending':
      return <Server className={className || ""} size={size} />;
    case 'locker':
      return <Package className={className || ""} size={size} />;
    default:
      return <ArrowRight className={className || ""} size={size} />;
  }
};

export default MachineTypeIcon;
