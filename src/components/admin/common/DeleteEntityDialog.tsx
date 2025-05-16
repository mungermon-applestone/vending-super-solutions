
import React from 'react';
import { Loader2 } from 'lucide-react';
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

export interface EntityToDelete {
  id: string;
  title: string;
  slug: string;
}

interface DeleteEntityDialogProps {
  /**
   * Whether the delete dialog is open
   */
  isOpen: boolean;
  /**
   * Function to set the open state of the dialog
   */
  setIsOpen: (open: boolean) => void;
  /**
   * Entity data to delete
   */
  entityToDelete: EntityToDelete | null;
  /**
   * Function to call when delete is confirmed
   */
  onConfirmDelete: () => Promise<void>;
  /**
   * Whether deletion is in progress
   */
  isDeleting: boolean;
  /**
   * Type of entity being deleted (for customized messages)
   * @default "item"
   */
  entityType?: string;
  /**
   * Custom description to show in the dialog
   * If not provided, a default message will be used
   */
  customDescription?: React.ReactNode;
}

/**
 * Reusable confirmation dialog for deleting entities
 */
const DeleteEntityDialog: React.FC<DeleteEntityDialogProps> = ({
  isOpen,
  setIsOpen,
  entityToDelete,
  onConfirmDelete,
  isDeleting,
  entityType = 'item',
  customDescription,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {customDescription || (
              <>
                This will permanently delete the {entityType} "{entityToDelete?.title}".
                This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirmDelete} 
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteEntityDialog;
