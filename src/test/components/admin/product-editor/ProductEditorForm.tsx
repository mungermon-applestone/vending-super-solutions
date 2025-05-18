
import React from 'react';
import { CMSProductType } from '@/types/cms';

// This is a stub component for testing purposes
const ProductEditorForm: React.FC<{
  productSlug?: string;
  isEditMode?: boolean;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}> = ({ productSlug, isEditMode, onSubmit, isSubmitting = false }) => {
  const isLoading = false;
  const productType = {
    title: 'Test Product',
    slug: 'test-product',
    description: 'Test description'
  };

  if (isLoading) {
    return <div>Loading Product Data</div>;
  }

  return (
    <div>
      <h1>{isEditMode ? `Edit Product: ${productType.title}` : 'Create New Product'}</h1>
      
      {isEditMode && (
        <button type="button">
          Clone Product
        </button>
      )}
      
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ title: productType.title, slug: productType.slug });
      }}>
        <div>
          <label htmlFor="title">Title</label>
          <input 
            id="title"
            name="title" 
            defaultValue={productType?.title || ''} 
          />
        </div>
        <div>
          <label htmlFor="slug">Slug</label>
          <input 
            id="slug"
            name="slug" 
            defaultValue={productType?.slug || ''} 
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            defaultValue={productType?.description || ''}
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default ProductEditorForm;
