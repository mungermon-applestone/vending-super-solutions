
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { deleteProduct as deleteProductService } from '@/services/product/index';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(),
  },
}));

describe('Product Service - deleteProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should delete a product', async () => {
    const productSlug = 'product-to-delete';
    
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
        delete: vi.fn().mockResolvedValue({ 
          data: true, 
          error: null 
        })
      })
    } as any);
    
    const result = await deleteProductService(productSlug);
    
    expect(result).toBe(true);
  });
});
