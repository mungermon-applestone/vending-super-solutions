
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateProduct } from '@/services/cms/products';
import { supabase } from '@/integrations/supabase/client';
import { ProductFormData } from '@/types/forms';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(),
  },
}));

describe('Product Service - updateProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should update an existing product', async () => {
    const originalSlug = 'original-product';
    
    const mockProductFormData: ProductFormData = { 
      title: 'Updated Product',
      slug: 'updated-product',
      description: 'This is an updated product',
      image: {
        url: 'https://example.com/updated-image.jpg',
        alt: 'Updated product image'
      },
      benefits: ['Updated Benefit 1', 'Updated Benefit 2'],
      features: [
        {
          title: 'Updated Feature',
          description: 'Updated feature description',
          icon: 'updated-icon',
          screenshotUrl: 'https://example.com/updated-screenshot.jpg',
          screenshotAlt: 'Updated feature screenshot'
        }
      ]
    };
    
    const mockUpdatedProduct = {
      id: 'product-123',
      ...mockProductFormData
    };
    
    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnValue({
        maybeSingle: vi.fn().mockResolvedValue({
          data: { id: 'product-123' },
          error: null
        })
      })
    } as any);
    
    vi.mocked(supabase.from).mockReturnValueOnce({
      eq: vi.fn().mockReturnValue({
        update: vi.fn().mockResolvedValue({
          data: mockUpdatedProduct,
          error: null
        })
      })
    } as any);
    
    const result = await updateProduct(mockProductFormData, originalSlug);
    
    expect(result).toBe(mockUpdatedProduct.id);
  });
});
