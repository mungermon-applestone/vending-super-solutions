
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CMSProductType } from '@/types/cms';
import CloneButton from '@/components/admin/common/CloneButton';

interface ProductTableRowProps {
  product: CMSProductType;
  onDeleteClick: (product: CMSProductType) => void;
  onCloneClick?: (product: CMSProductType) => Promise<void>;
  isCloningId?: string | null;
}

const ProductTableRow: React.FC<ProductTableRowProps> = ({ 
  product, 
  onDeleteClick,
  onCloneClick,
  isCloningId
}) => {
  const navigate = useNavigate();
  
  return (
    <TableRow>
      <TableCell className="font-medium">{product.title}</TableCell>
      <TableCell>{product.slug}</TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/products/${product.slug}`)}
            className="flex items-center gap-1"
            title="View product"
          >
            <Eye className="h-4 w-4" /> View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/products/edit/${product.slug}`)}
            className="flex items-center gap-1"
            title="Edit product"
          >
            <Pencil className="h-4 w-4" /> Edit
          </Button>
          
          {onCloneClick && (
            <CloneButton
              onClone={() => onCloneClick(product)}
              itemName={product.title}
              isCloning={isCloningId === product.id}
            />
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteClick(product)}
            className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50"
            title="Delete product"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ProductTableRow;
