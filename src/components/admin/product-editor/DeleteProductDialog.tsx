
import React from 'react';

interface DeleteProductDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  productToDelete: {
    id: string;
    title: string;
  };
  onConfirmDelete: () => void;
  isDeleting: boolean;
}

/**
 * Dialog to confirm deletion of a product
 */
const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
  isOpen,
  setIsOpen,
  productToDelete,
  onConfirmDelete,
  isDeleting
}) => {
  if (!isOpen || !productToDelete) return null;

  return (
    <div className="delete-product-dialog" role="dialog">
      <h2>Delete Product</h2>
      <p>Are you sure you want to delete {productToDelete.title}?</p>
      <div className="actions">
        <button onClick={() => setIsOpen(false)}>Cancel</button>
        <button 
          onClick={onConfirmDelete} 
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default DeleteProductDialog;
