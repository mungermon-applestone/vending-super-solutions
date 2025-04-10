
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, ChevronRight, Trash2, Eye } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { getProductTypes, deleteProductType } from '@/services/cms';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminProducts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: string; title: string; slug: string } | null>(null);
  
  const { data: productTypes = [], isLoading: isLoadingProducts, refetch } = useQuery({
    queryKey: ['productTypes'],
    queryFn: async () => {
      try {
        return await getProductTypes();
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

  console.log('[AdminProducts] Product types loaded:', productTypes);

  const handleDeleteClick = (product: any) => {
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
      await deleteProductType(productToDelete.slug);
      
      toast({
        title: "Product deleted",
        description: `${productToDelete.title} has been deleted successfully.`
      });
      
      queryClient.invalidateQueries({ queryKey: ['productTypes'] });
      
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
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
                    <TableHead className="w-[220px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productTypes.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.title}</TableCell>
                      <TableCell>{product.slug}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/products/${product.slug}`)}
                            className="flex items-center gap-1"
                            title="View product"
                          >
                            <Eye className="h-4 w-4" /> View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              console.log(`[AdminProducts] Navigating to edit product with slug: ${product.slug}`);
                              navigate(`/admin/products/edit/${product.slug}`);
                            }}
                            className="flex items-center gap-1"
                            title="Edit product"
                          >
                            <Edit className="h-4 w-4" /> Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(product)}
                            className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Delete product"
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product "{productToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default AdminProducts;
