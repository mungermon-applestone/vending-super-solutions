
// Stub component for tests
import { FC } from 'react';

interface ProductTableRowProps {
  product: any;
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}

const ProductTableRow: FC<ProductTableRowProps> = () => {
  return null; // This is a stub for tests
};

export default ProductTableRow;
