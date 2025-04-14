
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/utils/test-utils';
import Products from '@/pages/Products';
import { useProductTypes } from '@/hooks/cms/useProductTypes';
import { CMSProductType } from '@/types/cms';

// Mock the useProductTypes hook
vi.mock('@/hooks/cms/useProductTypes', () => ({
  useProductTypes: vi.fn(),
}));

describe('Products Page', () => {
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

    render(<Products />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders product list', async () => {
    const mockProducts: CMSProductType[] = [
      { 
        id: '1', 
        title: 'Snack Vending Machine', 
        slug: 'snack-machine', 
        description: 'A vending machine for snacks'
      },
      { 
        id: '2', 
        title: 'Drink Vending Machine', 
        slug: 'drink-machine',
        description: 'A vending machine for drinks'
      },
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

    render(<Products />);
    
    await waitFor(() => {
      expect(screen.getByText('Snack Vending Machine')).toBeInTheDocument();
      expect(screen.getByText('Drink Vending Machine')).toBeInTheDocument();
    });
  });

  it('handles error state', () => {
    const errorMessage = 'Failed to load products';
    vi.mocked(useProductTypes).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error(errorMessage),
      isError: true,
      isPending: false,
      isSuccess: false,
      refetch: vi.fn(),
      status: 'error',
      fetchStatus: 'idle',
    } as any);

    render(<Products />);
    
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
