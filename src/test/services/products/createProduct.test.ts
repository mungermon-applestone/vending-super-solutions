
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { ProductFormData } from '@/types/forms';
import { createProduct } from '@/services/product/createProduct';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
  },
}));

describe('Product Service - createProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should create a new product', async () => {
    const mockProductFormData: ProductFormData = { 
      title: 'New Product', 
      slug: 'new-product',
      description: 'This is a new product',
      image: {
        url: 'https://example.com/image.jpg',
        alt: 'Product image'
      },
      benefits: ['Benefit 1', 'Benefit 2'],
      features: [
        {
          title: 'Feature 1',
          description: 'Feature 1 description',
          icon: 'icon-1',
          screenshotUrl: 'https://example.com/screenshot1.jpg',
          screenshotAlt: 'Feature 1 screenshot'
        }
      ]
    };
    
    const mockToast = {
      toast: vi.fn(),
      toasts: [],
      dismiss: vi.fn()
    };
    
    const mockCreatedProduct = {
      id: 'new-product-id',
      ...mockProductFormData
    };
    
    const mockResponse = {
      data: mockCreatedProduct,
      error: null
    };
    
    vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn().mockResolvedValue(mockResponse)
    } as any);
    
    const result = await createProduct(mockProductFormData, mockToast);
    
    expect(result).toBe(mockCreatedProduct.id);
  });
});
