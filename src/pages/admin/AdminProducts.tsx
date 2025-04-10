
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Edit, ChevronRight } from 'lucide-react';
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
import { getProductTypes } from '@/services/cms';

const AdminProducts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch all product types to display in the table
  const { data: productTypes = [], error, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['productTypes'],
    queryFn: async () => {
      try {
        return await getProductTypes();
      } catch (error) {
        console.error('[AdminProductsPage] Error fetching product types:', error);
        toast({
          title: 'Error',
          description: 'Failed to load products. Please try again.',
          variant: 'destructive',
        });
        return [];
      }
    },
  });

  // Debug log for product types
  console.log('[AdminProducts] Product types loaded:', productTypes);

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
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productTypes.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.title}</TableCell>
                      <TableCell>{product.slug}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              console.log(`[AdminProducts] Navigating to edit product with slug: ${product.slug}`);
                              navigate(`/admin/products/edit/${product.slug}`);
                            }}
                            className="h-8 px-2 w-8"
                            title="Edit product"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/products/${product.slug}`)}
                            className="h-8 px-2 w-8"
                            title="View product page"
                          >
                            <ChevronRight size={16} />
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
    </Layout>
  );
};

export default AdminProducts;
