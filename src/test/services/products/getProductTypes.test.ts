
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProductTypes } from '@/services/cms/products';
import { supabase } from '@/integrations/supabase/client';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
  },
}));

describe('Product Service - getProductTypes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should fetch all product types', async () => {
    const mockProducts = [
      { id: '1', title: 'Product 1', slug: 'product-1', description: 'Description 1' },
      { id: '2', title: 'Product 2', slug: 'product-2', description: 'Description 2' },
    ];
    
    const mockResponse = {
      data: mockProducts,
      error: null,
      count: null,
      status: 200,
      statusText: 'OK',
    };
    
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockResolvedValue(mockResponse),
    } as any);
    
    const result = await getProductTypes();
    
    expect(result).toEqual(mockProducts);
    expect(supabase.from).toHaveBeenCalledWith('product_types');
  });
  
  it('should handle errors', async () => {
    const mockError = new Error('Database error');
    
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockRejectedValue(mockError),
    } as any);
    
    await expect(getProductTypes()).rejects.toThrow('Database error');
  });
});
