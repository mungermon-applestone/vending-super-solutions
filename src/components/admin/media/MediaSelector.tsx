
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';

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
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(value);
  
  // Mock implementation that just displays the current value
  // and provides an input for manual URL entry
  
  useEffect(() => {
    setCurrentImageUrl(value);
  }, [value]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentImageUrl(e.target.value);
  };
  
  const handleApply = () => {
    onChange(currentImageUrl);
  };
  
  return (
    <div className="space-y-2">
      {currentImageUrl ? (
        <div className="relative border rounded-md overflow-hidden">
          <img 
            src={currentImageUrl} 
            alt="Selected media"
            className="max-h-48 object-contain mx-auto"
            onError={(e) => {
              // If image fails to load, show a placeholder
              (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Image+URL+Invalid';
            }}
          />
        </div>
      ) : null}
      
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          value={currentImageUrl || ''}
          onChange={handleInputChange}
          placeholder="Enter image URL"
          className="border rounded px-3 py-2"
        />
        
        <Button
          type="button"
          variant="default"
          onClick={handleApply}
        >
          <Image className="mr-2 h-4 w-4" />
          {currentImageUrl ? "Apply URL" : buttonLabel}
        </Button>
      </div>
      
      <div className="text-xs text-gray-500 mt-2">
        Note: Media library functionality has been simplified. Please enter image URLs directly.
      </div>
    </div>
  );
};

export default MediaSelector;
