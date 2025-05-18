
import React from 'react';

interface ProductTableRowProps {
  product: any;
  onDeleteClick: (product: any) => void;
  onCloneClick: (product: any) => void;
  isCloningId?: string;
}

/**
 * Table row component for displaying a product in a list
 */
const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  onDeleteClick,
  onCloneClick,
  isCloningId
}) => {
  return (
    <tr className="product-table-row">
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
