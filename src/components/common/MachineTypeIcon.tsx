
import React from 'react';
import { Check, Shield, Server, Settings, Bell, Battery, Clipboard, 
  RefreshCcw, TrendingUp, PieChart, Map, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MachineTypeIconProps {
  icon?: string;
  type?: string;
  className?: string;
}

const MachineTypeIcon: React.FC<MachineTypeIconProps> = ({ 
  icon, 
  type, 
  className = ''
}) => {
  const iconType = icon || type || 'settings';
  const iconClassName = cn('h-6 w-6', className);
  
  switch (iconType) {
    case 'check':
      return <Check className={iconClassName} />;
    case 'shield':
      return <Shield className={iconClassName} />;
    case 'server':
      return <Server className={iconClassName} />;
    case 'settings':
      return <Settings className={iconClassName} />;
    case 'bell':
      return <Bell className={iconClassName} />;
    case 'battery':
      return <Battery className={iconClassName} />;
    case 'clipboard':
    case 'clipboard-check':
      return <Clipboard className={iconClassName} />;
    case 'refresh':
    case 'refresh-ccw':
      return <RefreshCcw className={iconClassName} />;
    case 'trend':
    case 'trending-up':
      return <TrendingUp className={iconClassName} />;
    case 'chart':
    case 'pie-chart':
      return <PieChart className={iconClassName} />;
    case 'map':
      return <Map className={iconClassName} />;
    case 'user':
    case 'user-check':
      return <UserCheck className={iconClassName} />;
    case 'google':
      return <div className={cn('text-blue-500', iconClassName)}>G</div>;
    case 'salesforce':
      return <div className={cn('text-blue-700', iconClassName)}>SF</div>;
    case 'quickbooks':
      return <div className={cn('text-green-600', iconClassName)}>QB</div>;
    case 'teams':
      return <div className={cn('text-purple-600', iconClassName)}>MS</div>;
    default:
      return <Settings className={iconClassName} />;
  }
};

export default MachineTypeIcon;
