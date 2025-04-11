
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { getProductTypes, deleteProductType } from '@/services/cms';
import { useCloneProductType } from '@/hooks/cms/useCloneCMS';
import ProductTableRow from '@/components/admin/product-editor/ProductTableRow';
import DeleteProductDialog from '@/components/admin/product-editor/DeleteProductDialog';
import { CMSProductType } from '@/types/cms';

const AdminProducts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: string; title: string; slug: string } | null>(null);
  
  // For cloning functionality
  const cloneProductMutation = useCloneProductType();
  const [cloningProductId, setCloningProductId] = useState<string | null>(null);
  
  const { data: productTypes = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['productTypes'],
    queryFn: async () => {
      try {
        console.log('[AdminProducts] Fetching product types...');
        const products = await getProductTypes();
        console.log('[AdminProducts] Products loaded:', products);
        return products;
      } catch (error) {
        console.error('[AdminProducts] Error fetching product types:', error);
        toast({
          title: 'Error',
          description: 'Failed to load products. Please try again.',
          variant: 'destructive',
        });
        return [];
      }
    },
  });

  const handleDeleteClick = (product: CMSProductType) => {
    setProductToDelete({
      id: product.id,
      title: product.title,
      slug: product.slug
    });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      setIsDeleting(true);
      console.log(`[AdminProducts] Deleting product with slug: ${productToDelete.slug}`);
      
      await deleteProductType(productToDelete.slug);
      
      toast({
        title: "Product deleted",
        description: `${productToDelete.title} has been deleted successfully.`
      });
      
      queryClient.invalidateQueries({ queryKey: ['productTypes'] });
      
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("[AdminProducts] Error deleting product:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloneProduct = async (product: CMSProductType) => {
    try {
      setCloningProductId(product.id);
      const clonedProduct = await cloneProductMutation.mutateAsync(product.id);
      
      if (clonedProduct) {
        toast({
          title: "Product cloned",
          description: `${product.title} has been cloned successfully.`
        });
      }
    } catch (error) {
      console.error("[AdminProducts] Error cloning product:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to clone product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCloningProductId(null);
    }
  };

  return (
    <Layout>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Product Management</h1>
            <p className="text-muted-foreground mt-1">
              Create, view and edit product types displayed on the site.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/admin/products/new')}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add New Product
          </Button>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              All product types currently in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingProducts ? (
              <div className="text-center py-10">Loading products...</div>
            ) : productTypes.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">No products found</p>
                <Button onClick={() => navigate('/admin/products/new')}>
                  Create Your First Product
                </Button>
              </div>
            ) : (
              <Table>
                <TableCaption>A list of all product types.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productTypes.map((product) => (
                    <ProductTableRow 
                      key={product.id} 
                      product={product}
                      onDeleteClick={handleDeleteClick}
                      onCloneClick={handleCloneProduct}
                      isCloningId={cloningProductId}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      
      <DeleteProductDialog
        isOpen={deleteDialogOpen}
        setIsOpen={setDeleteDialogOpen}
        productToDelete={productToDelete}
        onConfirmDelete={confirmDelete}
        isDeleting={isDeleting}
      />
    </Layout>
  );
};

export default AdminProducts;
