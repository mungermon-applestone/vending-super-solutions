
import React from 'react';
import { Button } from '@/components/ui/button';
import { Server, HardDrive } from 'lucide-react';
import { CMSMachine } from '@/types/cms';

interface MachineDetailHeroProps {
  machine: CMSMachine;
}

const MachineDetailHero: React.FC<MachineDetailHeroProps> = ({ machine }) => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-vending-blue p-2 rounded-full mr-3">
                {machine.type === 'vending' ? (
                  <Server className="h-5 w-5 text-white" />
                ) : (
                  <HardDrive className="h-5 w-5 text-white" />
                )}
              </div>
              <span className="text-vending-blue font-medium">
                {machine.type.charAt(0).toUpperCase()}{machine.type.slice(1)} | {machine.temperature.charAt(0).toUpperCase()}{machine.temperature.slice(1)}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-vending-blue-dark">
              {machine.title}
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              {machine.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="btn-primary">
                Request Pricing
              </Button>
              <Button variant="outline">
                Download Spec Sheet
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <img 
                src={machine.images[0]?.url} 
                alt={machine.images[0]?.alt || machine.title} 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MachineDetailHero;
