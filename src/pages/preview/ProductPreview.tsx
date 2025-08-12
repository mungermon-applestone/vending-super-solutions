/**
 * Product preview page for draft content
 */

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CMSProductType } from '@/types/cms';
import { contentfulProductPreviewAdapter } from '@/services/cms/adapters/products/contentfulProductPreviewAdapter';
import { PreviewWrapper } from '@/components/preview/PreviewWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

export function ProductPreview() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<CMSProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await contentfulProductPreviewAdapter.getBySlug(slug);
        setProduct(productData);
        setError(null);
      } catch (err) {
        console.error('Error fetching preview product:', err);
        setError('Failed to load product preview');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const content = (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {loading && (
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Preview Error</h2>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      )}

      {product && (
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">{product.title}</h1>
            <div className="flex justify-center gap-2">
              <Badge variant="secondary">Product Type</Badge>
              <Badge variant="outline">{product.slug}</Badge>
            </div>
          </div>

          {/* Image */}
          {product.image && (
            <div className="flex justify-center">
              <img
                src={product.image.url}
                alt={product.image.alt}
                className="max-w-2xl w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed">{product.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          {product.benefits && product.benefits.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Features</h2>
                <div className="grid gap-4">
                  {product.features.map((feature) => (
                    <div key={feature.id} className="border-l-4 border-primary pl-4">
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommended Machines */}
          {product.recommendedMachines && product.recommendedMachines.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Recommended Machines</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {product.recommendedMachines.map((machine) => (
                    <div key={machine.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold">{machine.title}</h3>
                      <p className="text-sm text-muted-foreground">{machine.description}</p>
                      <Badge variant="outline" className="mt-2">{machine.slug}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Debug Info */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-2">Debug Information</h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Product ID: {product.id}</p>
                <p>Created: {product.created_at}</p>
                <p>Updated: {product.updated_at}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  return <PreviewWrapper>{content}</PreviewWrapper>;
}