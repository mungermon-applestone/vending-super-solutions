import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Edit, ChevronRight, ExternalLink } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
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
import DeprecatedInterfaceWarning from '@/components/admin/DeprecatedInterfaceWarning';

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

  const handleOpenContentful = () => {
    window.open("https://app.contentful.com/", "_blank");
  };

  return (
    <Layout>
      <div className="container py-10">
        <DeprecatedInterfaceWarning 
          contentType="Products Administration"
          message="This products administration interface is being phased out. Please use Contentful directly to manage product content."
          title="Products Administration Deprecated"
        />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Product Management</h1>
            <p className="text-muted-foreground mt-1">
              View product types displayed on the site
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleOpenContentful}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Manage in Contentful
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/products/new')}
            >
              <Plus size={16} className="mr-2" />
              Create Product (Legacy)
            </Button>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <CardTitle>Products</CardTitle>
            <CardDescription>
              All product types currently in the system
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoadingProducts ? (
              <div className="text-center py-10">Loading products...</div>
            ) : productTypes.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">No products found</p>
                <Button 
                  onClick={handleOpenContentful} 
                  className="bg-blue-600 hover:bg-blue-700 text-white mb-2"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Create Products in Contentful
                </Button>
                <div className="mt-2 text-sm text-muted-foreground">
                  or
                </div>
                <Button 
                  variant="outline" 
                  className="mt-2" 
                  onClick={() => navigate('/admin/products/new')}
                >
                  Use Legacy Editor
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
                            onClick={() => navigate(`/admin/products/edit/${product.slug}`)}
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
          <CardFooter className="border-t bg-gray-50">
            <div className="w-full flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Note:</span> This interface is being deprecated
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleOpenContentful}
                className="text-blue-600 border-blue-200"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Manage in Contentful
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminProducts;
