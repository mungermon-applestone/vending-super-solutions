
import React from 'react';
import { Button } from '@/components/ui/button';
import { Server, HardDrive } from 'lucide-react';
import { CMSMachine } from '@/types/cms';
import Image from '@/components/common/Image';
import { Link } from 'react-router-dom';
import ComingSoonRibbon from '@/components/ui/ComingSoonRibbon';

interface MachineDetailHeroProps {
  machine: CMSMachine;
}

const MachineDetailHero: React.FC<MachineDetailHeroProps> = ({ machine }) => {
  // Determine machine type for icon display
  const type = machine.type || 'vending';
  const temperature = machine.temperature || 'ambient';
  
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-blue-500 to-blue-600">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-white/10 p-2 rounded-full mr-3">
                {type === 'vending' ? (
                  <Server className="h-5 w-5 text-white" />
                ) : (
                  <HardDrive className="h-5 w-5 text-white" />
                )}
              </div>
              <span className="text-white font-medium">
                {type.charAt(0).toUpperCase()}{type.slice(1)} | {temperature}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 text-white">
              {machine.title}
            </h1>
            <p className="text-xl text-white/90 mb-8">
              {machine.description}
            </p>
            <div>
              <Button asChild className="bg-white text-blue-600 hover:bg-blue-50">
                <Link to="/contact">
                  Request Information
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="relative bg-white rounded-lg shadow-xl p-8 overflow-hidden">
              {machine.images && machine.images[0] ? (
                <div className="relative w-full h-auto flex items-center justify-center overflow-hidden">
                  <Image 
                    src={machine.images[0].url} 
                    alt={machine.images[0].alt || machine.title} 
                    className="w-full h-auto max-h-96"
                    objectFit="contain"
                    isThumbnail={false}
                    priority={true}
                  />
                  {machine.comingSoonRibbon && <ComingSoonRibbon />}
                </div>
              ) : (
                <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                  {type === 'vending' ? (
                    <Server className="h-20 w-20 text-gray-400" />
                  ) : (
                    <HardDrive className="h-20 w-20 text-gray-400" />
                  )}
                  {machine.comingSoonRibbon && <ComingSoonRibbon />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MachineDetailHero;
