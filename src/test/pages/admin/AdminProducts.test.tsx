
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/utils/test-utils';
import AdminProducts from '@/pages/admin/AdminProducts';
import { useProductTypes } from '@/hooks/cms/useProductTypes';
import { CMSProductType } from '@/types/cms';

// Mock the hooks
vi.mock('@/hooks/cms/useProductTypes');
vi.mock('@/hooks/cms/useCloneCMS', () => ({
  useCloneProductType: () => ({
    mutateAsync: vi.fn(),
    isLoading: false,
  }),
}));

describe('AdminProducts Page', () => {
  it('renders loading state', () => {
    vi.mocked(useProductTypes).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      isError: false,
      isPending: true,
      isSuccess: false,
      refetch: vi.fn(),
      status: 'loading',
      fetchStatus: 'fetching',
    } as any);

    render(<AdminProducts />);
    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
  });

  it('renders product list', async () => {
    const mockProducts: CMSProductType[] = [
      {
        id: '1',
        title: 'Test Product',
        slug: 'test-product',
        description: 'A test product'
      }
    ];

    vi.mocked(useProductTypes).mockReturnValue({
      data: mockProducts,
      isLoading: false,
      error: null,
      isError: false,
      isPending: false,
      isSuccess: true,
      refetch: vi.fn(),
      status: 'success',
      fetchStatus: 'idle',
    } as any);

    render(<AdminProducts />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('test-product')).toBeInTheDocument();
    });

    // Verify action buttons are present
    expect(screen.getByText(/add new product/i)).toBeInTheDocument();
    expect(screen.getAllByTitle(/edit product/i)[0]).toBeInTheDocument();
    expect(screen.getAllByTitle(/delete product/i)[0]).toBeInTheDocument();
  });

  it('renders empty state', () => {
    vi.mocked(useProductTypes).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      isError: false,
      isPending: false,
      isSuccess: true,
      refetch: vi.fn(),
      status: 'success',
      fetchStatus: 'idle',
    } as any);

    render(<AdminProducts />);
    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
    expect(screen.getByText(/create your first product/i)).toBeInTheDocument();
  });
});
