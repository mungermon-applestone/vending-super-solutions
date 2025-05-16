
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Copy, FileIcon, FileImage, FileVideo } from 'lucide-react';
import { MediaFile } from '@/types/media';
import { useMediaUrl } from '@/hooks/useMediaData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import MediaEditDialog from './MediaEditDialog';

interface MediaCardProps {
  media: MediaFile;
  onDelete: (id: string) => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (media: MediaFile) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ 
  media, 
  onDelete,
  selectable = false,
  selected = false,
  onSelect
}) => {
  const { getUrl } = useMediaUrl();
  const { toast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const publicUrl = getUrl(media.storage_path);
  
  const isImage = media.file_type.startsWith('image/');
  const isVideo = media.file_type.startsWith('video/');
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl).then(
      () => {
        toast({
          title: "URL copied",
          description: "Media URL copied to clipboard",
        });
      },
      (err) => {
        console.error('Failed to copy URL: ', err);
        toast({
          title: "Failed to copy",
          description: "Couldn't copy URL to clipboard",
          variant: "destructive",
        });
      }
    );
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  const handleCardClick = () => {
    if (selectable && onSelect) {
      onSelect(media);
    }
  };

  return (
    <>
      <Card 
        className={cn(
          "overflow-hidden flex flex-col h-full transition-all", 
          selectable && "cursor-pointer hover:ring-2 hover:ring-primary/50",
          selected && "ring-2 ring-primary"
        )}
        onClick={handleCardClick}
      >
        {/* Media Preview */}
        <div className="aspect-square bg-gray-100 relative flex items-center justify-center">
          {isImage ? (
            <img 
              src={publicUrl} 
              alt={media.alt_text || media.filename} 
              className="object-cover w-full h-full"
            />
          ) : isVideo ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <FileVideo className="h-10 w-10 text-gray-400" />
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <FileIcon className="h-10 w-10 text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Media Info */}
        <div className="p-3 text-sm flex-grow">
          <h3 className="font-medium truncate mb-1" title={media.title || media.filename}>
            {media.title || media.filename}
          </h3>
          <p className="text-xs text-gray-500">
            {formatFileSize(media.file_size)}
            {media.width && media.height && (
              <span> · {media.width}×{media.height}</span>
            )}
          </p>
        </div>
        
        {/* Actions */}
        {!selectable && (
          <div className="flex border-t divide-x">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 h-9 rounded-none"
              onClick={() => setIsEditOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 h-9 rounded-none"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 h-9 rounded-none text-destructive hover:text-destructive"
              onClick={() => onDelete(media.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>
      
      <MediaEditDialog 
        isOpen={isEditOpen} 
        onOpenChange={setIsEditOpen}
        media={media}
      />
    </>
  );
};

export default MediaCard;
