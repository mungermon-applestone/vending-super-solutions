
import React from 'react';
import { 
  Bell, 
  Battery, 
  ClipboardCheck, 
  UserCheck,
  RefreshCcw,
  TrendingUp,
  PieChart,
  Map
} from 'lucide-react';

type MachineTypeIconProps = {
  type: string;
  size?: number;
  className?: string;
};

const MachineTypeIcon: React.FC<MachineTypeIconProps> = ({ 
  type, 
  size = 24, 
  className = "" 
}) => {
  // Map icon types to Lucide components
  const iconMap: Record<string, React.ReactNode> = {
    'bell': <Bell size={size} className={className} />,
    'battery': <Battery size={size} className={className} />,
    'clipboard': <ClipboardCheck size={size} className={className} />,
    'user': <UserCheck size={size} className={className} />,
    'refresh': <RefreshCcw size={size} className={className} />,
    'trend': <TrendingUp size={size} className={className} />,
    'chart': <PieChart size={size} className={className} />,
    'map': <Map size={size} className={className} />,
  };

  // Default to PieChart if icon type not found
  if (!type || !iconMap[type.toLowerCase()]) {
    return <PieChart size={size} className={className} />;
  }

  return <>{iconMap[type.toLowerCase()]}</>;
};

export default MachineTypeIcon;
