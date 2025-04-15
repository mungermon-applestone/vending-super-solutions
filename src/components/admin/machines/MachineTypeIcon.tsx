
import React from 'react';
import { Server, Package } from 'lucide-react';

interface MachineTypeIconProps {
  type: string;
  size?: number;
  className?: string;
}

const MachineTypeIcon: React.FC<MachineTypeIconProps> = ({ type, size = 4, className }) => {
  switch (type?.toLowerCase()) {
    case 'vending':
      return <Server className={className || ""} size={size} />;
    case 'locker':
      return <Package className={className || ""} size={size} />;
    default:
      return <Server className={className || ""} size={size} />;
  }
};

export default MachineTypeIcon;
