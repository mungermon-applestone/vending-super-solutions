
import React from 'react';
import { CMSProductType } from '@/types/cms';

// This is a stub component for testing purposes
const ProductTableRow: React.FC<{
  product: CMSProductType;
  onDeleteClick: (product: CMSProductType) => void;
  onCloneClick: (product: CMSProductType) => void;
  isCloningId?: string;
}> = ({ product, onDeleteClick, onCloneClick, isCloningId }) => {
  return (
    <tr>
      <td>{product.title}</td>
      <td>{product.slug}</td>
      <td>
        <button 
          onClick={() => onCloneClick(product)}
          disabled={isCloningId === product.id}
          title="Clone product"
        >
          {isCloningId === product.id ? 'Cloning...' : 'Clone'}
        </button>
        <button 
          onClick={() => onDeleteClick(product)}
          title="Delete product"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ProductTableRow;
