
// Stub component for tests
import { FC } from 'react';

interface DeleteProductDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  productToDelete: any;
  onConfirmDelete: () => void;
  isDeleting: boolean;
}

/**
 * @deprecated - Use the actual component from src/components/admin/product-editor/DeleteProductDialog.tsx instead
 */
const DeleteProductDialog: FC<DeleteProductDialogProps> = () => {
  return null; // This is a stub for tests
};

export default DeleteProductDialog;
