
// Stub component for tests
import { FC } from 'react';

interface ProductTableRowProps {
  product: any;
  onDeleteClick: (product: any) => void;
  onCloneClick: (product: any) => void;
  isCloningId?: string;
}

/**
 * @deprecated - Use the actual component from src/components/admin/product-editor/ProductTableRow.tsx instead
 */
const ProductTableRow: FC<ProductTableRowProps> = () => {
  return null; // This is a stub for tests
};

export default ProductTableRow;
