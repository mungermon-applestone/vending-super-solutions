
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cloneProduct } from '@/services/cms/products';
import { supabase } from '@/integrations/supabase/client';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
  },
}));

describe('Product Service - cloneProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should clone a product successfully', async () => {
    const productId = 'product-123';
    
    const mockClonedProduct = { 
      id: 'cloned-123', 
      title: 'Cloned Product', 
      slug: 'cloned-product',
      description: 'This is a cloned product',
      image: {
        id: 'image-123',
        url: 'https://example.com/cloned-image.jpg',
        alt: 'Cloned product image'
      },
      benefits: [],
      features: []
    };
    
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockClonedProduct, error: null })
    } as any);
    
    const result = await cloneProduct(productId);
    
    expect(result).toEqual(mockClonedProduct);
    expect(supabase.from).toHaveBeenCalledWith('product_types');
  });
});
