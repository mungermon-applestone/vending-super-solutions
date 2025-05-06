
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Server, HardDrive } from 'lucide-react';
import Image from '@/components/common/Image';

interface MachineCardProps {
  machine: {
    id: string;
    slug: string;
    title: string;
    description: string;
    type: string;
    temperature?: string;
    images?: Array<{
      url: string;
      alt?: string;
    }>;
    thumbnail?: {
      url: string;
      alt?: string;
    }>;
  };
}

const MachineCard: React.FC<MachineCardProps> = ({ machine }) => {
  // Determine which image to use - thumbnail has priority
  const hasImages = machine.images && machine.images.length > 0;
  const hasThumbnail = !!machine.thumbnail;
  
  // Log the image selection for debugging
  console.log(`[MachineCard] Rendering ${machine.title}:`, {
    hasThumbnail,
    hasImages,
    imageSource: hasThumbnail ? 'thumbnail' : (hasImages ? 'first image' : 'none')
  });
  
  return (
    <Card key={machine.id} className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48 bg-gray-50">
        {hasThumbnail ? (
          <Image 
            src={machine.thumbnail.url} 
            alt={machine.thumbnail.alt || machine.title} 
            className="w-full h-full"
            objectFit="contain"
            isThumbnail={true}
          />
        ) : hasImages ? (
          <Image 
            src={machine.images[0].url} 
            alt={machine.images[0].alt || machine.title} 
            className="w-full h-full"
            objectFit="contain"
            isThumbnail={false}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            {machine.type === 'vending' ? (
              <Server className="h-16 w-16 text-gray-300" />
            ) : (
              <HardDrive className="h-16 w-16 text-gray-300" />
            )}
          </div>
        )}
        {machine.temperature && (
          <div className="absolute top-0 right-0 bg-vending-blue text-white px-3 py-1 m-2 rounded-md text-sm">
            {machine.temperature}
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{machine.title || 'Unnamed Machine'}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 line-clamp-3">
          {machine.description || 'No description available'}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/machines/${machine.slug}`}>
            View Details <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MachineCard;
