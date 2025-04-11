
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useDeleteMedia } from '@/hooks/useMediaData';
import { MediaFile } from '@/types/media';
import MediaCard from './MediaCard';
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface MediaGridProps {
  media: MediaFile[];
  isLoading: boolean;
  selectable?: boolean;
  selectedMedia?: string[];
  onSelectMedia?: (media: MediaFile) => void;
}

const MediaGrid: React.FC<MediaGridProps> = ({ 
  media, 
  isLoading,
  selectable = false,
  selectedMedia = [],
  onSelectMedia
}) => {
  const [mediaToDelete, setMediaToDelete] = React.useState<MediaFile | null>(null);
  const deleteMediaMutation = useDeleteMedia();
  const { toast } = useToast();
  
  const handleDeleteClick = (id: string) => {
    const mediaItem = media.find(item => item.id === id);
    if (mediaItem) {
      setMediaToDelete(mediaItem);
    }
  };
  
  const confirmDelete = async () => {
    if (!mediaToDelete) return;
    
    try {
      await deleteMediaMutation.mutateAsync(mediaToDelete.id);
      toast({
        title: "Media deleted",
        description: `${mediaToDelete.filename} has been deleted.`
      });
      setMediaToDelete(null);
    } catch (error) {
      console.error('Error deleting media:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the media file. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }
  
  if (media.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-2">No media files found</p>
        <p className="text-sm text-gray-400">
          Upload some files to see them here
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {media.map((item) => (
          <MediaCard 
            key={item.id} 
            media={item}
            onDelete={handleDeleteClick}
            selectable={selectable}
            selected={selectedMedia.includes(item.id)}
            onSelect={onSelectMedia}
          />
        ))}
      </div>
      
      <AlertDialog open={!!mediaToDelete} onOpenChange={(open) => !open && setMediaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <span className="font-medium">{mediaToDelete?.filename}</span> and
              remove it from any content that references it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMediaMutation.isPending}
            >
              {deleteMediaMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MediaGrid;
