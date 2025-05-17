
import React from 'react';
import { CMSProductType } from '@/types/cms';

// This is a stub component for testing purposes
const ProductEditorForm: React.FC<{
  productType?: CMSProductType;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}> = ({ productType, onSubmit, isSubmitting }) => {
  return (
    <div>
      <h1>{productType ? 'Edit' : 'Create'} Product</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ title: 'Test Product', slug: 'test-product' });
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
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default ProductEditorForm;
