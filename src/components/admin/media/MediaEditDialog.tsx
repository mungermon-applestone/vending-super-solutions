
import React, { useState } from 'react';
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
import { MediaFile } from '@/types/media';
import { useUpdateMediaMetadata } from '@/hooks/useMediaData';
import { useToast } from '@/hooks/use-toast';

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
  
  const handleSave = async () => {
    try {
      await updateMediaMutation.mutateAsync({
        id: media.id,
        title,
        alt_text: altText,
        description
      });
      
      toast({
        title: "Media updated",
        description: "Media details have been updated successfully."
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating media:', error);
      toast({
        title: "Update failed",
        description: "Failed to update media details. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Media</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="flex justify-center mb-4">
            {media.file_type.startsWith('image/') ? (
              <img 
                src={`https://eyxlqcavscrthjkonght.supabase.co/storage/v1/object/public/cms_media/${media.storage_path}`} 
                alt={media.alt_text || media.filename}
                className="max-h-40 max-w-full object-contain rounded border"
              />
            ) : (
              <div className="text-center p-6 bg-gray-100 rounded">
                <p>{media.filename}</p>
                <p className="text-sm text-gray-500 mt-1">{media.file_type}</p>
              </div>
            )}
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="alt-text">Alt Text</Label>
            <Input
              id="alt-text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image for accessibility"
            />
          </div>
          
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
