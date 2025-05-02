
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Image, X } from 'lucide-react';
import MediaLibrary from './MediaLibrary';

interface MediaSelectorProps {
  value: string;
  onChange: (url: string, contentType?: string, fileName?: string) => void;
  buttonLabel?: string;
  mediaType?: string;
}

const MediaSelector: React.FC<MediaSelectorProps> = ({
  value,
  onChange,
  buttonLabel = "Select Image",
  mediaType = "image/*"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(value);
  
  // Make sure to update local state when the external value changes
  useEffect(() => {
    setCurrentImageUrl(value);
    console.log("[MediaSelector] Value prop updated:", value);
  }, [value]);
  
  const handleOpenChange = (open: boolean) => {
    console.log("[MediaSelector] Dialog open state changed to:", open);
    setIsOpen(open);
    if (!open) {
      // Reset selected items when closing without selecting
      setSelectedMediaIds([]);
    }
  };
  
  const handleSelectMedia = (mediaId: string, url: string, contentType?: string, fileName?: string) => {
    console.log("[MediaSelector] Selected media:", mediaId, url, contentType, fileName);
    setSelectedMediaIds([mediaId]);
    setCurrentImageUrl(url);
    
    // Call the onChange prop to propagate the change upwards
    onChange(url, contentType, fileName);
    setIsOpen(false);
  };
  
  const handleRemove = () => {
    console.log("[MediaSelector] Removing selected image");
    setCurrentImageUrl('');
    onChange('', '', '');
    setSelectedMediaIds([]);
  };
  
  return (
    <>
      <div className="space-y-2">
        {currentImageUrl ? (
          <div className="relative border rounded-md overflow-hidden">
            <img 
              src={currentImageUrl} 
              alt="Selected media"
              className="max-h-48 object-contain mx-auto" 
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-1 right-1 h-7 w-7 p-0"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
        
        <Button
          type="button"
          variant={currentImageUrl ? "outline" : "default"}
          onClick={() => {
            console.log("[MediaSelector] Opening media selection dialog");
            setIsOpen(true);
          }}
        >
          <Image className="mr-2 h-4 w-4" />
          {currentImageUrl ? "Change Image" : buttonLabel}
        </Button>
      </div>
      
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-5xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Media Library</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto mt-4 pr-1">
            <MediaLibrary 
              selectable={true}
              onSelectMedia={handleSelectMedia}
              selectedMediaIds={selectedMediaIds}
              mediaType={mediaType}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaSelector;
