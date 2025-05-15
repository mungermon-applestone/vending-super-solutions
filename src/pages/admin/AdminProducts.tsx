import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import RunRegressionTest from '@/components/admin/testing/RunRegressionTest';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProductTypes } from '@/hooks/cms/useProductTypes';
import { CMSProductType } from '@/types/cms';
import { Skeleton } from "@/components/ui/skeleton";
import { EditProductDialog } from '@/components/admin/products/EditProductDialog';
import { DeleteProductDialog } from '@/components/admin/products/DeleteProductDialog';
import { useCloneProductType } from '@/hooks/cms/useCloneCMS';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const AdminProducts: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: products, isLoading, error, refetch, status, fetchStatus } = useProductTypes();
  const { mutateAsync: cloneProductType, isPending: isCloning } = useCloneProductType();
  const navigate = useNavigate();
  
  // Force refresh products when component mounts AND when products is empty
  useEffect(() => {
    console.log("[AdminProducts] Component mounted, refreshing products data");
    queryClient.invalidateQueries({ queryKey: ['productTypes'] });
  }, [queryClient]);
  
  useEffect(() => {
    // If products array is empty after loading completes, try refetching
    if (!isLoading && products && products.length === 0) {
      console.log("[AdminProducts] No products found after loading, triggering refetch");
      refetch();
    }
  }, [products, isLoading, refetch]);
  
  const handleRefresh = () => {
    console.log("[AdminProducts] Manual refresh requested");
    queryClient.invalidateQueries({ queryKey: ['productTypes'] });
    refetch();
    toast({
      title: "Refreshing products",
      description: "Reloading product data from the database.",
    });
  };
  
  const handleClone = async (id: string) => {
    try {
      await cloneProductType(id);
      toast({
        title: "Product Cloned",
        description: "Successfully cloned the product.",
      });
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Cloning Product",
        description: error instanceof Error ? error.message : "An error occurred while cloning the product.",
      });
    }
  };

  const handleAddNewProduct = () => {
    navigate('/admin/products/new');
  };

  const handleEditProduct = (slug: string) => {
    navigate(`/admin/products/edit/${slug}`);
  };

  // Admin pages should always show refresh controls regardless of environment

  return (
    <Layout>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Manage your product types
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isLoading || fetchStatus === 'fetching'}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <RunRegressionTest />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-12 w-[200px]" />
            <Skeleton className="h-8 w-[400px]" />
            <Skeleton className="h-8 w-[400px]" />
            <Skeleton className="h-8 w-[400px]" />
          </div>
        ) : error ? (
          <div className="rounded-md border p-4">
            <h3 className="mb-2 font-medium text-red-500">Error!</h3>
            <p className="text-sm text-muted-foreground">
              {error.message}
            </p>
            <Button onClick={() => refetch()} variant="secondary" size="sm" className="mt-2">
              Try Again
            </Button>
          </div>
        ) : products && products.length > 0 ? (
          <div className="w-full">
            <Table>
              <TableCaption>A list of your product types.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>{product.slug}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <EditProductDialog product={product} />
                        <Button
                          variant="outline"
                          size="sm"
                          title="Clone Product"
                          disabled={isCloning}
                          onClick={() => handleClone(product.id)}
                        >
                          Clone
                        </Button>
                        <DeleteProductDialog product={product} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>
                    <Button variant="secondary" onClick={handleAddNewProduct}>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add New Product
                    </Button>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        ) : (
          <div className="rounded-md border p-4">
            <h3 className="mb-2 font-medium">No Products Found</h3>
            <p className="text-sm text-muted-foreground">
              It looks like you haven't created any product types yet.
            </p>
            <Button variant="secondary" size="sm" className="mt-2" onClick={handleAddNewProduct}>
              Create your first product
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminProducts;
