
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Edit, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import ViewInContentful from '@/components/admin/ViewInContentful';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

const AdminProducts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Log deprecation of this admin page
  React.useEffect(() => {
    logDeprecationWarning(
      "AdminProducts",
      "The Products admin interface is deprecated and will be removed in a future version.",
      "Please use Contentful to manage product content."
    );
  }, []);
  
  // Fetch all product types to display in the table
  const { data: productTypes = [], error, isLoading: isLoadingProducts } = useQuery({
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

  return (
    <DeprecatedAdminLayout
      title="Product Management"
      description="View product types displayed on the site (read-only)"
      contentType="Product"
      backPath="/admin/dashboard"
    >
      <div className="flex justify-between mb-6">
        <div>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Read-Only View
          </Badge>
        </div>
        <div className="flex gap-2">
          <ViewInContentful 
            contentType="product"
            className="bg-blue-50 text-blue-700 border-blue-200"
          />
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          {isLoadingProducts ? (
            <div className="text-center py-10">Loading products...</div>
          ) : productTypes.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No products found</p>
              <ViewInContentful 
                contentType="product" 
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              />
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
                        <ViewInContentful 
                          contentType="product"
                          contentId={product.id}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="View in Contentful"
                        >
                          <ExternalLink size={16} />
                        </ViewInContentful>
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
        <CardFooter className="border-t bg-gray-50 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            This interface is read-only. All content management should be done in Contentful.
          </p>
          <ViewInContentful 
            contentType="product"
            size="sm"
          />
        </CardFooter>
      </Card>
    </DeprecatedAdminLayout>
  );
};

export default AdminProducts;
