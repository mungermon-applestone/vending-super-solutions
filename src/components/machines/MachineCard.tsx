
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, HardDrive } from 'lucide-react';
import Image from '@/components/common/Image';
import { useTranslatedCMSContent } from '@/hooks/useTranslatedCMSContent';

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
    };
  };
}

const MachineCard: React.FC<MachineCardProps> = ({ machine }) => {
  // Translate machine content
  const { translatedContent } = useTranslatedCMSContent(machine, 'machine');
  
  // Use translated content if available, otherwise use original
  const displayTitle = translatedContent?.title || machine.title;
  const displayDescription = translatedContent?.description || machine.description;
  
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
    <Link 
      to={`/machines/${machine.slug}`}
      className="block h-full"
      onClick={() => window.scrollTo(0, 0)}
      aria-label={`View details for ${machine.title}`}
    >
      <Card 
        key={machine.id} 
        className="overflow-hidden flex flex-col h-full cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="relative h-48 bg-gray-50 flex items-center justify-center">
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
          <CardTitle className="text-xl">{displayTitle || 'Unnamed Machine'}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-gray-600 line-clamp-3">
            {displayDescription || 'No description available'}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MachineCard;
