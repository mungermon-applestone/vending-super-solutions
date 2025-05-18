
// Stub component for tests
import { FC } from 'react';

interface ProductEditorFormProps {
  productSlug?: string;
  isEditMode?: boolean;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

/**
 * @deprecated - Use the actual component from src/components/admin/product-editor/ProductEditorForm.tsx instead
 */
const ProductEditorForm: FC<ProductEditorFormProps> = () => {
  return null; // This is a stub for tests
};

export default ProductEditorForm;
