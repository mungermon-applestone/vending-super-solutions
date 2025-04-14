
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils/test-utils';
import DeleteProductDialog from '@/components/admin/product-editor/DeleteProductDialog';

describe('DeleteProductDialog', () => {
  const mockProduct = {
    id: '123',
    title: 'Test Product',
    slug: 'test-product'
  };

  it('renders correctly when open', () => {
    const setIsOpen = vi.fn();
    const onConfirmDelete = vi.fn();

    render(
      <DeleteProductDialog
        isOpen={true}
        setIsOpen={setIsOpen}
        productToDelete={mockProduct}
        onConfirmDelete={onConfirmDelete}
        isDeleting={false}
      />
    );

    expect(screen.getByText(/delete product/i)).toBeInTheDocument();
    expect(screen.getByText(/test product/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    const setIsOpen = vi.fn();
    const onConfirmDelete = vi.fn();

    render(
      <DeleteProductDialog
        isOpen={false}
        setIsOpen={setIsOpen}
        productToDelete={mockProduct}
        onConfirmDelete={onConfirmDelete}
        isDeleting={false}
      />
    );

    expect(screen.queryByText(/delete product/i)).not.toBeInTheDocument();
  });

  it('calls onConfirmDelete when delete button is clicked', () => {
    const setIsOpen = vi.fn();
    const onConfirmDelete = vi.fn();

    render(
      <DeleteProductDialog
        isOpen={true}
        setIsOpen={setIsOpen}
        productToDelete={mockProduct}
        onConfirmDelete={onConfirmDelete}
        isDeleting={false}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(onConfirmDelete).toHaveBeenCalled();
  });

  it('closes the dialog when cancel button is clicked', () => {
    const setIsOpen = vi.fn();
    const onConfirmDelete = vi.fn();

    render(
      <DeleteProductDialog
        isOpen={true}
        setIsOpen={setIsOpen}
        productToDelete={mockProduct}
        onConfirmDelete={onConfirmDelete}
        isDeleting={false}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  it('shows loading state when deleting', () => {
    const setIsOpen = vi.fn();
    const onConfirmDelete = vi.fn();

    render(
      <DeleteProductDialog
        isOpen={true}
        setIsOpen={setIsOpen}
        productToDelete={mockProduct}
        onConfirmDelete={onConfirmDelete}
        isDeleting={true}
      />
    );

    expect(screen.getByRole('button', { name: /deleting/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /deleting/i })).toBeDisabled();
  });
});
