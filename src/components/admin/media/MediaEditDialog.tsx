
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MediaFile } from '@/types/media';
import { useUpdateMediaMetadata, useMediaUrl } from '@/hooks/useMediaData';

interface MediaEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  media: MediaFile;
}

const MediaEditDialog: React.FC<MediaEditDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  media 
}) => {
  const [title, setTitle] = useState(media.title || '');
  const [altText, setAltText] = useState(media.alt_text || '');
  const [description, setDescription] = useState(media.description || '');
  
  const { toast } = useToast();
  const updateMediaMutation = useUpdateMediaMetadata();
  const { getUrl } = useMediaUrl();
  
  // Update form values when media changes
  useEffect(() => {
    if (isOpen) {
      setTitle(media.title || '');
      setAltText(media.alt_text || '');
      setDescription(media.description || '');
    }
  }, [isOpen, media]);
  
  const handleSave = async () => {
    try {
      await updateMediaMutation.mutateAsync({
        id: media.id,
        title,
        alt_text: altText,
        description
      });
      
      toast({
        title: 'Media updated successfully',
        description: 'The media details have been updated.',
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating media:', error);
      toast({
        title: 'Update failed',
        description: 'There was an error updating the media. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const isImage = media.file_type.startsWith('image/');
  const publicUrl = getUrl(media.storage_path);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Media</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Media Preview */}
          {isImage && (
            <div className="flex justify-center border rounded-md p-2">
              <img
                src={publicUrl}
                alt={media.alt_text || media.filename}
                className="max-h-40 max-w-full object-contain"
              />
            </div>
          )}

          {/* Filename (readonly) */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="filename">Filename</Label>
            <Input
              id="filename"
              value={media.filename}
              readOnly
              disabled
            />
          </div>
          
          {/* Title */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          {/* Alt Text */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="alt-text">Alt Text</Label>
            <Input
              id="alt-text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image for accessibility"
            />
          </div>
          
          {/* Description */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          
          <Button
            type="button"
            onClick={handleSave}
            disabled={updateMediaMutation.isPending}
          >
            {updateMediaMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MediaEditDialog;
