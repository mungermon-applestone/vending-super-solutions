
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { Link } from 'react-router-dom';

interface ContentfulProductType {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    slug: string;
    description: string;
    image?: any;
  };
}

const ContentfulProductTypes: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  
  const { data: products = [], isLoading, refetch, error } = useQuery({
    queryKey: ['contentful', 'products'],
    queryFn: async () => {
      try {
        const entries = await fetchContentfulEntries<ContentfulProductType>('product');
        return entries.map(entry => ({
          id: entry.sys.id,
          title: entry.fields.title,
          slug: entry.fields.slug,
          description: entry.fields.description,
          image: entry.fields.image ? {
            url: `https:${entry.fields.image.fields?.file?.url}` || '',
            alt: entry.fields.image.fields?.title || ''
          } : null
        }));
      } catch (err) {
        console.error('Error fetching products from Contentful:', err);
        return [];
      }
    }
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Product Types</span>
          <Button size="sm" variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>
          Manage product types in Contentful
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          <Button
            onClick={() => window.open('https://app.contentful.com/', '_blank')}
            className="flex items-center"
            variant="outline"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Contentful to Create Product Types
          </Button>
          <div className="mt-2 text-sm text-muted-foreground">
            <p>Use the "Product Type" model in Contentful to create and edit product types.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-md p-4">
                <Skeleton className="h-8 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-32 w-full" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 border rounded-md">
            <p className="text-muted-foreground mb-4">No product types found in Contentful</p>
            <Button
              onClick={() => window.open('https://app.contentful.com/', '_blank')}
              variant="default"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Product Types in Contentful
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{product.title}</h3>
                    <p className="text-sm text-muted-foreground">Slug: {product.slug}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(`/products/${product.slug}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Product
                  </Button>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm line-clamp-3">{product.description}</p>
                  </div>
                  <div>
                    {product.image?.url && (
                      <img
                        src={product.image.url}
                        alt={product.image.alt || product.title}
                        className="w-full h-32 object-cover rounded"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Note: To edit product types, you need to use the Contentful web interface directly.
        </p>
      </CardFooter>
    </Card>
  );
};

export default ContentfulProductTypes;
