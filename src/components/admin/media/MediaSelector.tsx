
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Image, X } from 'lucide-react';
import MediaLibrary from './MediaLibrary';

interface MediaSelectorProps {
  value: string;
  onChange: (url: string) => void;
  buttonLabel?: string;
}

const MediaSelector: React.FC<MediaSelectorProps> = ({
  value,
  onChange,
  buttonLabel = "Select Image"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  
  console.log("[MediaSelector] Rendering with value:", value);
  
  const handleOpenChange = (open: boolean) => {
    console.log("[MediaSelector] Dialog open state changed to:", open);
    setIsOpen(open);
    if (!open) {
      // Reset selected items when closing without selecting
      setSelectedMediaIds([]);
    }
  };
  
  const handleSelectMedia = (mediaId: string, url: string) => {
    console.log("[MediaSelector] Selected media:", mediaId, url);
    setSelectedMediaIds([mediaId]);
    onChange(url);
    setIsOpen(false);
  };
  
  const handleRemove = () => {
    console.log("[MediaSelector] Removing selected image");
    onChange('');
    setSelectedMediaIds([]);
  };
  
  return (
    <>
      <div className="space-y-2">
        {value ? (
          <div className="relative border rounded-md overflow-hidden">
            <img 
              src={value} 
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
          variant={value ? "outline" : "default"}
          onClick={() => {
            console.log("[MediaSelector] Opening media selection dialog");
            setIsOpen(true);
          }}
        >
          <Image className="mr-2 h-4 w-4" />
          {value ? "Change Image" : buttonLabel}
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
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaSelector;
