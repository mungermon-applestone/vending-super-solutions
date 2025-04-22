
import React from 'react';
import { Coffee, ShoppingCart, Package, Box } from 'lucide-react';

interface MachineTypeIconProps {
  type?: string;
  className?: string;
}

/**
 * Component that renders an appropriate icon based on machine type
 */
const MachineTypeIcon: React.FC<MachineTypeIconProps> = ({ type = 'default', className = '' }) => {
  switch (type?.toLowerCase()) {
    case 'coffee':
    case 'coffee-machine':
      return <Coffee className={className} />;
    case 'vending':
    case 'vending-machine':
      return <ShoppingCart className={className} />;
    case 'micro-market':
      return <Package className={className} />;
    default:
      return <Box className={className} />;
  }
};

export default MachineTypeIcon;
