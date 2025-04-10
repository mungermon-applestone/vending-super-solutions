
import React from 'react';
import { Ruler, Weight, Plug, ThermometerSnowflake, Server, DollarSign, HardDrive } from 'lucide-react';
import Wifi from '@/components/ui/Wifi';
import { CMSMachine } from '@/types/cms';
import { formatSpecLabel } from '@/components/machines/specs/SpecificationItem';

interface MachineDetailSpecificationsProps {
  specs: CMSMachine['specs'];
}

const MachineDetailSpecifications: React.FC<MachineDetailSpecificationsProps> = ({ specs }) => {
  // Guard clause for when specs is undefined
  if (!specs) return null;
  
  // Get the appropriate icon for a spec
  const getSpecIcon = (key: string) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('dimension')) return <Ruler className="mr-2 h-5 w-5 text-vending-blue" />;
    if (lowerKey.includes('weight')) return <Weight className="mr-2 h-5 w-5 text-vending-blue" />;
    if (lowerKey.includes('power') || lowerKey.includes('electric')) return <Plug className="mr-2 h-5 w-5 text-vending-blue" />;
    if (lowerKey.includes('temp')) return <ThermometerSnowflake className="mr-2 h-5 w-5 text-vending-blue" />;
    if (lowerKey.includes('capacity')) return <Server className="mr-2 h-5 w-5 text-vending-blue" />;
    if (lowerKey.includes('connect') || lowerKey.includes('wifi')) return <Wifi className="mr-2 h-5 w-5 text-vending-blue" />;
    if (lowerKey.includes('price') || lowerKey.includes('cost')) return <DollarSign className="mr-2 h-5 w-5 text-vending-blue" />;
    if (lowerKey.includes('payment')) return <HardDrive className="mr-2 h-5 w-5 text-vending-blue" />;
    return <Server className="mr-2 h-5 w-5 text-vending-blue" />;  // Default icon
  };

  // Process specifications to handle numeric keys and convert to proper format
  const formattedSpecs = Object.entries(specs).reduce((acc, [key, value]) => {
    // Try to parse the key if it looks like it might be JSON
    let specKey = key;
    let specValue = value;
    
    try {
      // Check if this is a numeric key (from database) or a properly formatted key
      if (/^\d+$/.test(key) && typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (parsed && typeof parsed === 'object' && parsed.key && parsed.value) {
            specKey = parsed.key;
            specValue = parsed.value;
          }
        } catch (e) {
          // If parsing fails, use the original value
          console.log(`Failed to parse spec: ${key}=${value}`);
        }
      }
    } catch (e) {
      // If any error occurs, use the original key/value
      console.error("Error processing spec:", e);
    }
    
    acc[specKey] = specValue;
    return acc;
  }, {} as Record<string, string>);

  // Split specs into two equal columns
  const specEntries = Object.entries(formattedSpecs);
  const midpoint = Math.ceil(specEntries.length / 2);
  const leftColumnSpecs = specEntries.slice(0, midpoint);
  const rightColumnSpecs = specEntries.slice(midpoint);

  return (
    <section className="py-12 bg-white" id="specifications">
      <div className="container-wide">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-vending-blue-dark">
          Specifications
        </h2>
        <div className="bg-vending-gray rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {leftColumnSpecs.map(([key, value]) => (
                <div key={key}>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    {getSpecIcon(key)}
                    {formatSpecLabel(key)}
                  </h3>
                  <p className="text-gray-700">{String(value)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {rightColumnSpecs.map(([key, value]) => (
                <div key={key}>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    {getSpecIcon(key)}
                    {formatSpecLabel(key)}
                  </h3>
                  <p className="text-gray-700">{String(value)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MachineDetailSpecifications;
