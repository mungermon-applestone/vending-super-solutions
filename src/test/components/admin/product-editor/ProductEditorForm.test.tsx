
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@/test/utils/test-utils';
import ProductEditorForm from '@/components/admin/product-editor/ProductEditorForm';
import { useProductType } from '@/hooks/cms/useProductTypes';
import { useCloneProductType } from '@/hooks/cms/useCloneCMS';
import { CMSProductType } from '@/types/cms';

// Mock necessary hooks
vi.mock('@/hooks/cms/useProductTypes', () => ({
  useProductType: vi.fn()
}));

vi.mock('@/hooks/cms/useCloneCMS', () => ({
  useCloneProductType: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isLoading: false
  }))
}));

// Mock React Router hooks
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

// Mock toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('ProductEditorForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders create mode correctly', () => {
    // Mock product data as undefined for create mode
    vi.mocked(useProductType).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      isError: false,
      isPending: false,
      isSuccess: true,
      refetch: vi.fn(),
      status: 'success',
      fetchStatus: 'idle',
    } as any);

    render(<ProductEditorForm />);

    expect(screen.getByText('Create New Product')).toBeInTheDocument();
    expect(screen.queryByText(/Loading Product Data/i)).not.toBeInTheDocument();
  });

  it('renders loading state', () => {
    // Mock loading state
    vi.mocked(useProductType).mockReturnValue({
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

    render(<ProductEditorForm productSlug="test-product" isEditMode={true} />);

    expect(screen.getByText(/Loading Product Data/i)).toBeInTheDocument();
  });

  it('renders edit mode with product data', async () => {
    const mockProduct: CMSProductType = {
      id: '123',
      title: 'Test Product',
      slug: 'test-product',
      description: 'Test description',
      image: {
        url: 'https://example.com/image.jpg',
        alt: 'Test Image'
      },
      benefits: ['Benefit 1', 'Benefit 2'],
      features: [
        {
          title: 'Feature 1',
          description: 'Feature description',
          icon: 'check',
          screenshot: {
            url: 'https://example.com/screenshot.jpg',
            alt: 'Screenshot'
          }
        }
      ]
    };

    // Mock product data for edit mode
    vi.mocked(useProductType).mockReturnValue({
      data: mockProduct,
      isLoading: false,
      error: null,
      isError: false,
      isPending: false,
      isSuccess: true,
      refetch: vi.fn(),
      status: 'success',
      fetchStatus: 'idle',
    } as any);

    render(<ProductEditorForm productSlug="test-product" isEditMode={true} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Edit Product:/i)).toBeInTheDocument();
    });
    
    // Check that form is populated with product data
    expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test-product')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
  });

  it('shows clone button only in edit mode', () => {
    const mockProduct: CMSProductType = {
      id: '123',
      title: 'Test Product',
      slug: 'test-product',
      description: 'Test description'
    };

    // Mock product data for edit mode
    vi.mocked(useProductType).mockReturnValue({
      data: mockProduct,
      isLoading: false,
      error: null,
      isError: false,
      isPending: false,
      isSuccess: true,
      refetch: vi.fn(),
      status: 'success',
      fetchStatus: 'idle',
    } as any);

    // Render in edit mode
    const { rerender } = render(<ProductEditorForm productSlug="test-product" isEditMode={true} />);
    expect(screen.getByText(/Clone Product/i)).toBeInTheDocument();

    // Re-render in create mode
    rerender(<ProductEditorForm isEditMode={false} />);
    expect(screen.queryByText(/Clone Product/i)).not.toBeInTheDocument();
  });
});
