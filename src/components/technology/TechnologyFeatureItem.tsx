
import React from 'react';
import { 
  Cloud, 
  Clock, 
  Box, 
  Network, 
  UploadCloud, 
  ArrowDownToLine,
  ShieldCheck, 
  CreditCard,
  Database, 
  Users, 
  Mail,
  Layers,
  BarChartBig,
  Zap,
  Wifi,
  Settings
} from 'lucide-react';

type IconType = 
  | 'Cloud'
  | 'Clock'
  | 'Box'
  | 'Network'
  | 'UploadCloud'
  | 'ArrowDownToLine'
  | 'ShieldCheck'
  | 'CreditCard'
  | 'Database'
  | 'Users'
  | 'Mail'
  | 'Layers'
  | 'BarChartBig'
  | 'Zap'
  | 'Wifi'
  | 'Settings'
  | string;

interface TechnologyFeatureItemProps {
  icon?: IconType;
  title: string;
  description: string;
  items?: string[];
}

const TechnologyFeatureItem = ({ icon, title, description, items }: TechnologyFeatureItemProps) => {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Cloud': return <Cloud className="h-6 w-6" />;
      case 'Clock': return <Clock className="h-6 w-6" />;
      case 'Box': return <Box className="h-6 w-6" />;
      case 'Network': return <Network className="h-6 w-6" />;
      case 'UploadCloud': return <UploadCloud className="h-6 w-6" />;
      case 'ArrowDownToLine': return <ArrowDownToLine className="h-6 w-6" />;
      case 'ShieldCheck': return <ShieldCheck className="h-6 w-6" />;
      case 'CreditCard': return <CreditCard className="h-6 w-6" />;
      case 'Database': return <Database className="h-6 w-6" />;
      case 'Users': return <Users className="h-6 w-6" />;
      case 'Mail': return <Mail className="h-6 w-6" />;
      case 'Layers': return <Layers className="h-6 w-6" />;
      case 'BarChartBig': return <BarChartBig className="h-6 w-6" />;
      case 'Zap': return <Zap className="h-6 w-6" />;
      case 'Wifi': return <Wifi className="h-6 w-6" />;
      case 'Settings': return <Settings className="h-6 w-6" />;
      default: return <Settings className="h-6 w-6" />;
    }
  };

  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 flex-shrink-0 rounded-full bg-blue-50 p-3 text-blue-600">
        {icon && getIconComponent(icon)}
      </div>
      <div>
        <h4 className="text-lg font-medium">{title}</h4>
        <p className="mt-1 text-gray-600">{description}</p>
        
        {items && items.length > 0 && (
          <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-gray-600">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TechnologyFeatureItem;
