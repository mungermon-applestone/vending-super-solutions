
import React from 'react';
import { formatSpecLabel } from '@/components/machines/specs/SpecificationItem';
import { 
  Ruler, 
  Scale, 
  Zap, 
  ShoppingBasket, 
  CreditCard, 
  Wifi, 
  Building, 
  ShieldCheck,
  ThermometerSnowflake
} from 'lucide-react';

interface MachineDetailSpecificationsProps {
  specs: Record<string, string>;
}

const MachineDetailSpecifications: React.FC<MachineDetailSpecificationsProps> = ({ specs }) => {
  const getIcon = (key: string) => {
    const iconProps = { className: "h-5 w-5 mr-2 text-blue-600" };
    switch (key.toLowerCase()) {
      case 'dimensions':
        return <Ruler {...iconProps} />;
      case 'weight':
        return <Scale {...iconProps} />;
      case 'powerrequirements':
        return <Zap {...iconProps} />;
      case 'capacity':
        return <ShoppingBasket {...iconProps} />;
      case 'paymentoptions':
        return <CreditCard {...iconProps} />;
      case 'connectivity':
        return <Wifi {...iconProps} />;
      case 'manufacturer':
        return <Building {...iconProps} />;
      case 'warranty':
        return <ShieldCheck {...iconProps} />;
      case 'temperature':
        return <ThermometerSnowflake {...iconProps} />;
      default:
        return null;
    }
  };

  if (!specs || Object.keys(specs).length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white" id="specifications">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-900">
          Machine Specifications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(specs).map(([key, value]) => {
            if (!value) return null;
            
            const normalizedKey = key.replace(/[_\s]/g, '').toLowerCase();
            
            return (
              <div key={key} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="flex items-center text-lg font-medium mb-2 text-gray-900">
                  {getIcon(normalizedKey)}
                  {formatSpecLabel(key)}
                </h3>
                <p className="text-gray-700">{value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MachineDetailSpecifications;
