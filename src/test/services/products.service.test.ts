
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getProductTypes, 
  getProductTypeBySlug,
  createProduct, 
  updateProduct, 
  deleteProduct,
  cloneProduct
} from '@/services/cms/products';
import { supabase } from '@/integrations/supabase/client';
import { ProductFormData } from '@/types/forms';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
  },
}));

describe('Product Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('getProductTypes', () => {
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
  
  describe('getProductTypeBySlug', () => {
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
      expect(vi.mocked(supabase.from().select).mock.calls[0][0]).toMatch('*');
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
  
  // Fix the issue with cloneProduct expecting an argument
  describe('cloneProduct', () => {
    it('should clone a product successfully', async () => {
      const productId = 'product-123';
      const mockClonedProduct = { 
        id: 'cloned-123', 
        title: 'Cloned Product', 
        slug: 'cloned-product',
        description: 'This is a cloned product'
      };
      
      const mockResponse = {
        data: mockClonedProduct,
        error: null
      };
      
      vi.mocked(supabase.from).mockReturnValue({
        // Mock implementation for cloning
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        insert: vi.fn().mockResolvedValue(mockResponse)
      } as any);
      
      const result = await cloneProduct(productId);
      
      expect(result).toEqual(mockClonedProduct);
    });
  });
  
  // Additional tests for createProduct, updateProduct, deleteProduct
});
