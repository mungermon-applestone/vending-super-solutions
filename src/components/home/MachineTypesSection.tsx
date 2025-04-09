import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useMachines } from '@/hooks/useMachinesData';
import { CMSMachine, CMSImage } from '@/types/cms';

interface MachineCardProps {
  title: string;
  image: string | CMSImage;
  categories: string[];
  path: string;
}

const MachineCard = ({ title, image, categories, path }: MachineCardProps) => {
  // Handle both string and CMSImage types
  const imageUrl = typeof image === 'string' ? image : image.url;
  const imageAlt = typeof image === 'string' ? title : (image.alt || title);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={imageAlt} 
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-vending-teal/90 text-white px-2 py-1 rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
            <Button asChild variant="outline" className="bg-white/80 hover:bg-white">
              <Link to={path} className="flex items-center">
                View Details <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MachineTypesSection = () => {
  // Fetch featured machines from CMS using the useMachines hook
  const { data: machines = [], isLoading } = useMachines({ featured: true, limit: 3 });
  
  return (
    <section className="bg-vending-gray py-16 md:py-24">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-4">
            Compatible Machine Types
          </h2>
          <p className="subtitle mx-auto">
            Our software integrates with a wide variety of vending machines and smart lockers to meet your specific requirements.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md p-4">
                <div className="animate-pulse">
                  <div className="bg-gray-300 h-64 w-full mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {machines.map((machine, index) => {
              // Make sure image is properly handled with the required id property
              const machineImage = machine.images?.[0] || {
                id: `machine-${index}`,
                url: "https://placehold.co/600x400?text=No+Image",
                alt: "No Image"
              };
              
              // Create machine categories
              const machineCategories = [
                machine.type.charAt(0).toUpperCase() + machine.type.slice(1),
                machine.temperature.charAt(0).toUpperCase() + machine.temperature.slice(1)
              ];
              
              return (
                <MachineCard 
                  key={index}
                  title={machine.title}
                  image={machineImage}
                  categories={machineCategories}
                  path={`/machines/${machine.type}/${machine.slug}`}
                />
              );
            })}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Button asChild className="btn-primary">
            <Link to="/machines">Browse All Machine Types</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MachineTypesSection;
