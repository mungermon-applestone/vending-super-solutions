
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Edit, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { getProductTypes } from '@/services/cms/products';
import DeprecatedAdminLayout from '@/components/admin/layout/DeprecatedAdminLayout';

const AdminProductsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

  return (
    <DeprecatedAdminLayout
      title="Product Management"
      description="View all product types in the system (read-only)"
      contentType="Product"
      backPath="/admin/dashboard"
    >
      <div className="flex justify-between mb-6">
        <div></div>
        <Button 
          onClick={() => navigate('/admin/products/new')}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add New Product in Contentful
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
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
              <TableCaption>A list of all product types (read-only view).</TableCaption>
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
                          onClick={() => navigate(`/admin/products/edit/${product.slug}`)}
                          className="h-8 px-2 w-8"
                          title="Edit product in Contentful"
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
    </DeprecatedAdminLayout>
  );
};

export default AdminProductsPage;
