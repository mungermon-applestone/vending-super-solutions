
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CMSTechnologyFeature } from '@/types/cms';
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

interface TechnologyFeatureCardProps {
  feature: CMSTechnologyFeature;
}

const TechnologyFeatureCard: React.FC<TechnologyFeatureCardProps> = ({ feature }) => {
  const getIconComponent = (iconName: string | undefined) => {
    if (!iconName) return <Settings className="h-6 w-6" />;
    
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
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          {getIconComponent(feature.icon)}
        </div>
        <CardTitle className="text-lg">{feature.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{feature.description}</p>
        
        {feature.items && feature.items.length > 0 && (
          <ul className="mt-4 list-disc list-inside text-sm text-gray-600">
            {feature.items.map((item, i) => (
              <li key={i} className="mb-1">{item.text}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default TechnologyFeatureCard;
