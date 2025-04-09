
import React from 'react';
import { 
  Server, 
  HardDrive, 
  Ruler, 
  Weight, 
  Plug, 
  ThermometerSnowflake, 
  DollarSign, 
  Monitor, 
  Building, 
  CreditCard 
} from 'lucide-react';
import Wifi from '@/components/ui/Wifi';

// Helper function to get an appropriate icon for a specification based on its key
export const getSpecIcon = (key: string) => {
  const lowerKey = key.toLowerCase();
  
  if (lowerKey.includes('dimension')) return <Ruler className="mr-2 h-5 w-5 text-vending-blue" />;
  if (lowerKey.includes('weight')) return <Weight className="mr-2 h-5 w-5 text-vending-blue" />;
  if (lowerKey.includes('power')) return <Plug className="mr-2 h-5 w-5 text-vending-blue" />;
  if (lowerKey.includes('temp')) return <ThermometerSnowflake className="mr-2 h-5 w-5 text-vending-blue" />;
  if (lowerKey.includes('capacity')) return <Server className="mr-2 h-5 w-5 text-vending-blue" />;
  if (lowerKey.includes('connect')) return <Wifi className="mr-2 h-5 w-5 text-vending-blue" />;
  if (lowerKey.includes('price') || lowerKey.includes('cost')) return <DollarSign className="mr-2 h-5 w-5 text-vending-blue" />;
  if (lowerKey.includes('payment')) return <CreditCard className="mr-2 h-5 w-5 text-vending-blue" />;
  if (lowerKey.includes('screen')) return <Monitor className="mr-2 h-5 w-5 text-vending-blue" />;
  if (lowerKey.includes('manufacturer')) return <Building className="mr-2 h-5 w-5 text-vending-blue" />;
  
  // Default icon for other specs
  return <Server className="mr-2 h-5 w-5 text-vending-blue" />;
};
