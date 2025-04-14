
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useProductType } from '@/hooks/cms/useProductTypes';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductDetail = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const { data: product, isLoading, error } = useProductType(productSlug || '');

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto" />
          <p className="mt-4">Loading product information...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-xl font-semibold text-red-500 mb-4">Error Loading Product</h1>
            <p className="mb-6">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
            <Button asChild>
              <Link to="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-xl font-semibold mb-4">Product Not Found</h1>
            <p className="mb-6">We couldn't find the product "{productSlug}" in the database.</p>
            <Button asChild>
              <Link to="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-10">
        <Button asChild variant="outline" className="mb-6">
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            {product.features && product.features.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features.map((feature, index) => (
                    <div key={index} className="p-4 border rounded-md">
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {product.benefits && product.benefits.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Benefits</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index}>{typeof benefit === 'string' ? benefit : benefit.benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
