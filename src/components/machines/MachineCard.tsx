
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Server, HardDrive } from 'lucide-react';
import Image from '@/components/common/Image';
import { CMSMachine } from '@/types/cms';

interface MachineCardProps {
  machine: CMSMachine;
}

const MachineCard: React.FC<MachineCardProps> = ({ machine }) => {
  // Use title as the display name
  const displayTitle = machine.title || 'Unnamed Machine';
  
  // Determine which image to use - thumbnail has priority, then mainImage, then first image from array
  const hasThumbnail = !!machine.thumbnail?.url;
  const hasMainImage = !!machine.mainImage?.url;
  const hasImages = Array.isArray(machine.images) && machine.images.length > 0;
  
  // Determine the image to display
  const displayImage = hasThumbnail ? machine.thumbnail : 
    (hasMainImage ? machine.mainImage : 
      (hasImages ? machine.images[0] : undefined));
  
  // Get machine type or default to 'vending'
  const machineType = machine.type || 'vending';
  
  return (
    <Card key={machine.id} className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48 bg-gray-50 flex items-center justify-center">
        {displayImage?.url ? (
          <Image 
            src={displayImage.url} 
            alt={displayImage.alt || displayTitle} 
            className="w-full h-full"
            objectFit="contain"
            isThumbnail={true}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            {machineType === 'vending' ? (
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
        <CardTitle className="text-xl">{displayTitle}</CardTitle>
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
