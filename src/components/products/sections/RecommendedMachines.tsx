
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from '@/components/common/Image';

interface Machine {
  id: string;
  slug: string;
  title: string;
  description: string;
  image?: {
    url: string;
    alt?: string;
  };
  thumbnail?: {
    url: string;
    alt?: string;
  };
}

interface RecommendedMachinesProps {
  machines: Machine[];
}

const RecommendedMachines = ({ machines }: RecommendedMachinesProps) => {
  if (!machines?.length) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Recommended Machines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {machines.map((machine) => {
            // Determine which image to use - thumbnail has priority
            const imageToUse = machine.thumbnail || machine.image;
            
            return (
              <div key={machine.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {imageToUse && (
                  <div className="aspect-video w-full overflow-hidden">
                    <Image
                      src={imageToUse.url}
                      alt={imageToUse.alt || machine.title}
                      className="w-full h-full"
                      objectFit={machine.thumbnail ? 'contain' : 'cover'}
                      isThumbnail={!!machine.thumbnail}
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{machine.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{machine.description}</p>
                  <Button asChild variant="ghost" className="text-vending-blue hover:text-vending-blue-dark">
                    <Link to={`/machines/${machine.slug}`} className="flex items-center">
                      View details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecommendedMachines;
