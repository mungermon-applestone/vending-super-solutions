
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
  machineThumbnail?: {
    url: string;
    alt?: string;
  };
}

interface RecommendedMachinesProps {
  machines: Machine[];
}

/**
 * IMPORTANT: DO NOT MODIFY THIS COMPONENT'S IMAGE SELECTION LOGIC
 * WITHOUT EXPLICIT INSTRUCTIONS
 * 
 * This component has been specifically designed to handle machine thumbnails 
 * in a particular way with fallbacks to prevent machine images from disappearing.
 * The image selection logic prioritizes machineThumbnail > thumbnail > image.
 */
const RecommendedMachines = ({ machines }: RecommendedMachinesProps) => {
  if (!machines?.length) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Recommended Machines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {machines.map((machine) => {
            // Determine image priority: machineThumbnail > thumbnail > image
            const imageToUse = machine.machineThumbnail || machine.thumbnail || machine.image;
            
            // Enhanced logging for debugging
            console.log(`[RecommendedMachines] Machine ${machine.title}: Image selection`, {
              machineId: machine.id,
              machineSlug: machine.slug,
              hasMachineThumbnail: !!machine.machineThumbnail,
              machineThumbnailUrl: machine.machineThumbnail?.url,
              hasThumbnail: !!machine.thumbnail,
              thumbnailUrl: machine.thumbnail?.url,
              hasImage: !!machine.image,
              imageUrl: machine.image?.url,
              selectedImageSource: machine.machineThumbnail ? 'machineThumbnail' : 
                                  (machine.thumbnail ? 'thumbnail' : 
                                  (machine.image ? 'image' : 'none'))
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
                        isThumbnail={!!machine.machineThumbnail || !!machine.thumbnail}
                        onError={(e) => {
                          console.error(`[RecommendedMachines] Failed to load image for machine ${machine.title}:`, {
                            url: imageToUse.url,
                            error: e,
                            imageSource: machine.machineThumbnail ? 'machineThumbnail' : 
                                         (machine.thumbnail ? 'thumbnail' : 'regular image')
                          });
                          // Fallback to placeholder
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
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
