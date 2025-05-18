
import React from 'react';

interface ProductTableRowProps {
  product: any;
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}

/**
 * Table row component for displaying a product in a list
 */
const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  onEdit,
  onDelete
}) => {
  return (
    <tr className="product-table-row">
      {/* Implementation will be added when needed */}
      <td>{product.title}</td>
      <td>
        <button onClick={() => onEdit(product.id)}>Edit</button>
        <button onClick={() => onDelete(product.id, product.title)}>Delete</button>
      </td>
    </tr>
  );
};

export default ProductTableRow;
