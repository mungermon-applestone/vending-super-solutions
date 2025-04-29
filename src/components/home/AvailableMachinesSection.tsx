
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useContentfulMachines } from '@/hooks/cms/useContentfulMachines';
import { useHomePageContent } from '@/hooks/useHomePageContent';
import MachineCard from '@/components/machines/MachineCard';
import { Loader2 } from 'lucide-react';

const AvailableMachinesSection = () => {
  const { data: homeContent } = useHomePageContent();
  const { data: machines = [], isLoading } = useContentfulMachines();

  // Select the top 4 machines
  const featuredMachines = machines.slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-4">
              {homeContent?.availableMachines || "Available Machines"}
            </h2>
            <p className="subtitle max-w-2xl">
              {homeContent?.availableMachinesDescription || "Explore our range of cutting-edge vending machines compatible with our software solution."}
            </p>
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <Link to="/machines">View All Machines</Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMachines.map((machine) => (
              <MachineCard key={machine.id} machine={machine} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AvailableMachinesSection;
