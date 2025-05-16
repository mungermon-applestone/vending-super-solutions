
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TemperatureBadgeProps {
  temperature: string;
}

const TemperatureBadge: React.FC<TemperatureBadgeProps> = ({ temperature }) => {
  switch (temperature?.toLowerCase()) {
    case 'refrigerated':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Refrigerated</Badge>;
    case 'ambient':
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Ambient</Badge>;
    case 'frozen':
      return <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">Frozen</Badge>;
    case 'multi':
      return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Multi-temp</Badge>;
    case 'controlled':
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Controlled</Badge>;
    default:
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">{temperature || 'Unknown'}</Badge>;
  }
};

export default TemperatureBadge;
