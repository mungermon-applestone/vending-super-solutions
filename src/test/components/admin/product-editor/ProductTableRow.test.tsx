
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils/test-utils';
import ProductTableRow from '@/components/admin/product-editor/ProductTableRow';
import { CMSProductType } from '@/types/cms';

// Mock React Router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('ProductTableRow', () => {
  const mockProduct: CMSProductType = {
    id: '123',
    title: 'Test Product',
    slug: 'test-product',
    description: 'Product description'
  };

  it('renders product information correctly', () => {
    const onDeleteClick = vi.fn();
    const onCloneClick = vi.fn();

    render(
      <ProductTableRow 
        product={mockProduct} 
        onDeleteClick={onDeleteClick}
        onCloneClick={onCloneClick}
      />
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('test-product')).toBeInTheDocument();
  });

  it('handles delete click correctly', () => {
    const onDeleteClick = vi.fn();
    const onCloneClick = vi.fn();

    render(
      <ProductTableRow 
        product={mockProduct} 
        onDeleteClick={onDeleteClick}
        onCloneClick={onCloneClick}
      />
    );

    // Find and click the delete button
    const deleteButton = screen.getByTitle(/delete product/i);
    fireEvent.click(deleteButton);

    expect(onDeleteClick).toHaveBeenCalledWith(mockProduct);
  });

  it('handles clone click correctly', () => {
    const onDeleteClick = vi.fn();
    const onCloneClick = vi.fn();

    render(
      <ProductTableRow 
        product={mockProduct} 
        onDeleteClick={onDeleteClick}
        onCloneClick={onCloneClick}
      />
    );

    // Find and click the clone button
    const cloneButton = screen.getByText(/Clone/i);
    fireEvent.click(cloneButton);

    expect(onCloneClick).toHaveBeenCalledWith(mockProduct);
  });

  it('shows loading state when cloning', () => {
    const onDeleteClick = vi.fn();
    const onCloneClick = vi.fn();

    render(
      <ProductTableRow 
        product={mockProduct} 
        onDeleteClick={onDeleteClick}
        onCloneClick={onCloneClick}
        isCloningId={mockProduct.id}
      />
    );

    expect(screen.getByText(/Cloning/i)).toBeInTheDocument();
    const cloneButton = screen.getByText(/Cloning/i).closest('button');
    expect(cloneButton).toBeDisabled();
  });
});
