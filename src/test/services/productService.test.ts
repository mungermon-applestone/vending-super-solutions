
import { describe, it, expect, vi } from 'vitest';
import { getProductTypes, getProductTypeBySlug, createProduct, updateProduct } from '@/services/cms/products';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
  },
}));

describe('Product Services', () => {
  it('should fetch product types', async () => {
    const mockProductTypes = [
      { id: '1', title: 'Test Product', slug: 'test-product', description: 'A test product' },
    ];

    // Create a proper PostgrestResponse mock
    const mockResponse = {
      data: mockProductTypes,
      error: null,
      count: null,
      status: 200,
      statusText: 'OK',
    };

    vi.mocked(supabase.from('product_types').select).mockResolvedValue(mockResponse);

    const result = await getProductTypes();
    
    expect(result).toEqual(mockProductTypes);
    expect(supabase.from).toHaveBeenCalledWith('product_types');
  });

  it('should fetch product type by slug', async () => {
    const mockProduct = { id: '1', title: 'Test Product', slug: 'test-product', description: 'A test product' };

    // Create a proper PostgrestResponse mock
    const mockResponse = {
      data: [mockProduct],
      error: null,
      count: null,
      status: 200,
      statusText: 'OK',
    };

    vi.mocked(supabase.from('product_types').select).mockResolvedValue(mockResponse);

    const result = await getProductTypeBySlug('test-product');
    
    expect(result).toEqual(mockProduct);
  });
});
