
// Stub component for tests
import { FC } from 'react';

interface DeleteProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  productName: string;
}

const DeleteProductDialog: FC<DeleteProductDialogProps> = () => {
  return null; // This is a stub for tests
};

export default DeleteProductDialog;
