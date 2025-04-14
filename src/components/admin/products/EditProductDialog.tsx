
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { CMSProductType } from '@/types/cms';

interface EditProductDialogProps {
  product: CMSProductType;
}

export const EditProductDialog: React.FC<EditProductDialogProps> = ({ product }) => {
  const navigate = useNavigate();
  
  const handleEditClick = () => {
    navigate(`/admin/product-types/edit/${product.slug}`);
  };
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleEditClick}
      className="flex items-center gap-1"
      title="Edit product"
    >
      <Pencil className="h-4 w-4" /> Edit
    </Button>
  );
};
