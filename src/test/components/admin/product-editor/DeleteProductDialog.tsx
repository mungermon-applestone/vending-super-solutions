
import React from 'react';
import { CMSProductType } from '@/types/cms';

// This is a stub component for testing purposes
const DeleteProductDialog: React.FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  productToDelete: CMSProductType;
  onConfirmDelete: () => void;
  isDeleting: boolean;
}> = ({ isOpen, setIsOpen, productToDelete, onConfirmDelete, isDeleting }) => {
  if (!isOpen || !productToDelete) return null;
  
  return (
    <div role="dialog">
      <h2>Delete Product</h2>
      <p>Are you sure you want to delete {productToDelete.title}?</p>
      <div>
        <button onClick={() => setIsOpen(false)}>Cancel</button>
        <button onClick={onConfirmDelete} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default DeleteProductDialog;
