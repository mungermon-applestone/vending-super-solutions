
import React, { useEffect } from 'react';
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
  // Early return if no machines
  if (!machines?.length) return null;

  // Log the machines data for debugging purposes
  console.log('[RecommendedMachines] Rendering machines:', machines.map(m => ({
    title: m.title,
    hasImage: !!m.image,
    hasThumbnail: !!m.thumbnail,
    imageUrl: m.image?.url,
    thumbnailUrl: m.thumbnail?.url
  })));

  // Add effect to log when the component mounts
  useEffect(() => {
    console.log('[RecommendedMachines] Component mounted with', machines.length, 'machines');
    console.log('[RecommendedMachines] First machine details:', machines[0] ? {
      title: machines[0].title,
      hasThumbnail: !!machines[0].thumbnail,
      hasImage: !!machines[0].image,
      thumbnailUrl: machines[0].thumbnail?.url || 'none',
      imageUrl: machines[0].image?.url || 'none'
    } : 'No machines');
  }, [machines]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Recommended Machines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {machines.map((machine) => {
            // Determine which image to use - thumbnail has priority
            const imageToUse = machine.thumbnail || machine.image;
            
            // Log which image we're using for debugging
            console.log(`[RecommendedMachines] Machine ${machine.title}:`, {
              hasThumbnail: !!machine.thumbnail,
              hasImage: !!machine.image, 
              usingThumbnail: !!machine.thumbnail,
              imageUrl: imageToUse?.url || 'none'
            });
            
            return (
              <div key={machine.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-video w-full overflow-hidden bg-white flex items-center justify-center">
                  {imageToUse ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image
                        src={imageToUse.url}
                        alt={imageToUse.alt || machine.title}
                        className="w-full h-full"
                        objectFit="contain"
                        isThumbnail={!!machine.thumbnail}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </div>
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
