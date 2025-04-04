
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface MachineCardProps {
  title: string;
  image: string;
  categories: string[];
  path: string;
}

const MachineCard = ({ title, image, categories, path }: MachineCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div className="relative">
        <img 
          src={image} 
          alt={title} 
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
  const machines = [
    {
      title: "Ambient Vending Machines",
      image: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2",
      categories: ["Vending Machines", "Ambient"],
      path: "/machines/vending/ambient"
    },
    {
      title: "Refrigerated Vending",
      image: "https://images.unsplash.com/photo-1597393353415-b3730f3719fe",
      categories: ["Vending Machines", "Refrigerated"],
      path: "/machines/vending/refrigerated"
    },
    {
      title: "Smart Lockers",
      image: "https://images.unsplash.com/photo-1621964275191-ccc01ef2134c",
      categories: ["Lockers", "Ambient"],
      path: "/machines/lockers/ambient"
    }
  ];
  
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {machines.map((machine, index) => (
            <MachineCard 
              key={index}
              title={machine.title}
              image={machine.image}
              categories={machine.categories}
              path={machine.path}
            />
          ))}
        </div>
        
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
