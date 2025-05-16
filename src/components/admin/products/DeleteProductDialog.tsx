
import React, { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CMSProductType } from '@/types/cms';
import { deleteProductType } from '@/services/cms/productTypes';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
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

interface DeleteProductDialogProps {
  product: CMSProductType;
}

export const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProductType(product.slug);
      toast({
        title: "Product deleted",
        description: `${product.title} has been deleted.`,
      });
      queryClient.invalidateQueries({ queryKey: ['productTypes'] });
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting product",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50"
        title="Delete product"
      >
        <Trash2 className="h-4 w-4" /> Delete
      </Button>
      
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product "{product.title}" and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
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
    </>
  );
};
