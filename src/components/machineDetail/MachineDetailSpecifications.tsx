
import React from 'react';
import { formatSpecLabel } from '@/components/machines/specs/SpecificationItem';
import { 
  Scale, 
  Ruler, 
  Zap, 
  ShoppingBasket, 
  CreditCard, 
  Wifi, 
  Building, 
  ShieldCheck 
} from 'lucide-react';

interface MachineDetailSpecificationsProps {
  specs: Record<string, string>;
}

const MachineDetailSpecifications: React.FC<MachineDetailSpecificationsProps> = ({ specs }) => {
  if (!specs || Object.keys(specs).length === 0) {
    return null;
  }

  const getIcon = (key: string) => {
    switch (key.toLowerCase()) {
      case 'dimensions':
        return <Ruler className="h-5 w-5 mr-2 text-vending-blue" />;
      case 'weight':
        return <Scale className="h-5 w-5 mr-2 text-vending-blue" />;
      case 'powerrequirements':
      case 'power_requirements':
      case 'power requirements':
        return <Zap className="h-5 w-5 mr-2 text-vending-blue" />;
      case 'capacity':
        return <ShoppingBasket className="h-5 w-5 mr-2 text-vending-blue" />;
      case 'paymentoptions':
      case 'payment_options':
      case 'payment options':
        return <CreditCard className="h-5 w-5 mr-2 text-vending-blue" />;
      case 'connectivity':
        return <Wifi className="h-5 w-5 mr-2 text-vending-blue" />;
      case 'manufacturer':
        return <Building className="h-5 w-5 mr-2 text-vending-blue" />;
      case 'warranty':
        return <ShieldCheck className="h-5 w-5 mr-2 text-vending-blue" />;
      default:
        return <div className="w-5 mr-2" />;
    }
  };

  return (
    <section className="py-12 bg-white" id="specifications">
      <div className="container-wide">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-vending-blue-dark">
          Machine Specifications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(specs).map(([key, value]) => {
            if (!value) return null;
            
            const normalizedKey = key.replace(/[_\s]/g, '').toLowerCase();
            
            return (
              <div key={key} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="flex items-center text-lg font-medium mb-2 text-vending-blue-dark">
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
