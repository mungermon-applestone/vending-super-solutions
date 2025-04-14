
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/utils/test-utils';
import Products from '@/pages/Products';
import { useProductTypes } from '@/hooks/cms/useProductTypes';

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
    });

    render(<Products />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders product list', async () => {
    const mockProducts = [
      { id: '1', title: 'Snack Vending Machine', slug: 'snack-machine' },
      { id: '2', title: 'Drink Vending Machine', slug: 'drink-machine' },
    ];

    vi.mocked(useProductTypes).mockReturnValue({
      data: mockProducts,
      isLoading: false,
      error: null,
    });

    render(<Products />);
    
    await waitFor(() => {
      expect(screen.getByText('Snack Vending Machine')).toBeInTheDocument();
      expect(screen.getByText('Drink Vending Machine')).toBeInTheDocument();
    });
  });

  it('handles error state', () => {
    vi.mocked(useProductTypes).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load products'),
    });

    render(<Products />);
    
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
