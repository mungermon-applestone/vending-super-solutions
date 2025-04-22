
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProductTypeBySlug } from '@/services/cms/products';
import { supabase } from '@/integrations/supabase/client';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(),
  },
}));

describe('Product Service - getProductTypeBySlug', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should fetch a product by slug', async () => {
    const mockProduct = { 
      id: '1', 
      title: 'Test Product', 
      slug: 'test-product', 
      description: 'A test product' 
    };
    
    const mockResponse = {
      data: mockProduct,
      error: null,
      count: null,
      status: 200,
      statusText: 'OK',
    };
    
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnValue({
        maybeSingle: vi.fn().mockResolvedValue(mockResponse),
      }),
    } as any);
    
    const result = await getProductTypeBySlug('test-product');
    
    expect(result).toEqual(mockProduct);
    expect(supabase.from).toHaveBeenCalledWith('product_types');
  });
  
  it('should return null for non-existent slug', async () => {
    const mockResponse = {
      data: null,
      error: null,
      count: null,
      status: 200,
      statusText: 'OK',
    };
    
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnValue({
        maybeSingle: vi.fn().mockResolvedValue(mockResponse),
      }),
    } as any);
    
    const result = await getProductTypeBySlug('non-existent');
    
    expect(result).toBeNull();
  });
});
