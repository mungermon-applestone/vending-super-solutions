
import React from 'react';
import { Server, Package } from 'lucide-react';

interface MachineTypeIconProps {
  type: string;
}

const MachineTypeIcon: React.FC<MachineTypeIconProps> = ({ type }) => {
  switch (type?.toLowerCase()) {
    case 'vending':
      return <Server className="h-4 w-4" />;
    case 'locker':
      return <Package className="h-4 w-4" />;
    default:
      return <Server className="h-4 w-4" />;
  }
};

export default MachineTypeIcon;
