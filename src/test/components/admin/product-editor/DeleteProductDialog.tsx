
import React from 'react';
import { CMSProductType } from '@/types/cms';

// This is a stub component for testing purposes
const DeleteProductDialog: React.FC<{
  product?: CMSProductType;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}> = ({ product, isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen || !product) return null;
  
  return (
    <div role="dialog">
      <h2>Delete Product</h2>
      <p>Are you sure you want to delete {product.title}?</p>
      <div>
        <button onClick={onClose}>Cancel</button>
        <button onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default DeleteProductDialog;
