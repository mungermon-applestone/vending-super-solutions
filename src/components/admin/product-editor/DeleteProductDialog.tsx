
import React from 'react';

interface DeleteProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  productName: string;
}

/**
 * Dialog to confirm deletion of a product
 */
const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
  isOpen,
  onClose,
  onDelete,
  productName
}) => {
  return (
    <div className="delete-product-dialog">
      {/* Implementation will be added when needed */}
      <h2>Delete Product</h2>
      <p>Are you sure you want to delete {productName}?</p>
      <div className="actions">
        <button onClick={onClose}>Cancel</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default DeleteProductDialog;
