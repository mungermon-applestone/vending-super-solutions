
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from 'lucide-react';

interface DeleteBlogPostDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  postToDelete: { id: string; title: string } | null;
  onConfirmDelete: () => Promise<void>;
  isDeleting: boolean;
}

const DeleteBlogPostDialog: React.FC<DeleteBlogPostDialogProps> = ({
  isOpen,
  setIsOpen,
  postToDelete,
  onConfirmDelete,
  isDeleting,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the blog post
            <strong>{postToDelete ? ` "${postToDelete.title}"` : ''}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirmDelete();
            }}
            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Blog Post'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBlogPostDialog;
