
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
  
  describe('cloneProduct', () => {
    it('should clone a product successfully', async () => {
      const productId = 'product-123';
      const mockClonedProduct = { 
        id: 'cloned-123', 
        title: 'Cloned Product', 
        slug: 'cloned-product',
        description: 'This is a cloned product'
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
  
  describe('createProduct', () => {
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
      
      const result = await createProduct(mockProductFormData);
      
      expect(result).toBe(mockCreatedProduct.id);
    });
  });
  
  describe('updateProduct', () => {
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
      
      // First mock the getBySlug call
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { id: 'product-123' },
            error: null
          })
        })
      } as any);
      
      // Then mock the update call
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
  
  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const productSlug = 'product-to-delete';
      
      // Mock the getBySlug call
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { id: 'product-123' },
            error: null
          })
        })
      } as any);
      
      // Mock the delete call
      vi.mocked(supabase.from).mockReturnValueOnce({
        eq: vi.fn().mockReturnValue({
          delete: vi.fn().mockResolvedValue({ 
            data: true, 
            error: null 
          })
        })
      } as any);
      
      const result = await deleteProduct(productSlug);
      
      expect(result).toBe(true);
    });
  });
});
