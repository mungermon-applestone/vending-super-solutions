
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useContentfulProductType } from '@/hooks/cms/useContentfulProductType';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, AlertCircle, Bug, Info } from 'lucide-react';
import ProductHeroSection from '@/components/products/ProductHeroSection';
import ContentfulErrorBoundary from '@/components/common/ContentfulErrorBoundary';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { 
    data: product, 
    isLoading, 
    error, 
    diagnosticInfo 
  } = useContentfulProductType(slug || '');

  useEffect(() => {
    console.log("[ProductDetailPage] Rendering with slug:", slug);
    console.log("[ProductDetailPage] Current product data:", product);
    console.log("[ProductDetailPage] Current error state:", error);
    console.log("[ProductDetailPage] Diagnostic info:", diagnosticInfo);
  }, [slug, product, error, diagnosticInfo]);

  return (
    <Layout>
      <ContentfulErrorBoundary contentType="Product Details">
        <div className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
          <div className="container mx-auto">
            <Link to="/products" className="inline-flex items-center text-vending-blue-dark hover:text-vending-blue py-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="container py-12 text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading product information for slug: <code className="bg-gray-100 px-1 rounded">{slug}</code>...</p>
            <p className="text-sm text-gray-500 mt-2">Attempting to fetch data from Contentful...</p>
          </div>
        ) : error ? (
          <div className="container py-12">
            <div className="max-w-3xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="font-bold text-lg text-red-800">Error Loading Product</h3>
                    <p className="text-red-700 mt-2">
                      {error instanceof Error ? error.message : 'Failed to load product details'}
                    </p>
                  </div>
                </div>
              </div>
              
              <Card className="border border-amber-200 bg-amber-50 p-5 mb-8">
                <h3 className="text-lg font-semibold text-amber-800 flex items-center mb-4">
                  <Bug className="mr-2 h-5 w-5" />
                  Diagnostic Information
                </h3>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="request-info">
                    <AccordionTrigger className="text-amber-700">
                      Request Information
                    </AccordionTrigger>
                    <AccordionContent className="bg-white p-3 rounded border border-amber-100">
                      <ul className="space-y-2 text-sm">
                        <li><strong>Requested Slug:</strong> {slug || 'None'}</li>
                        <li><strong>API Endpoint:</strong> {diagnosticInfo?.endpoint || 'Unknown'}</li>
                        <li><strong>Content Type:</strong> {diagnosticInfo?.contentType || 'productType'}</li>
                        <li><strong>Query:</strong> <pre className="bg-gray-50 p-2 rounded text-xs mt-1 overflow-auto">{JSON.stringify(diagnosticInfo?.query || {}, null, 2)}</pre></li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="contentful-info">
                    <AccordionTrigger className="text-amber-700">
                      Contentful Configuration
                    </AccordionTrigger>
                    <AccordionContent className="bg-white p-3 rounded border border-amber-100">
                      <ul className="space-y-2 text-sm">
                        <li><strong>Space ID:</strong> {diagnosticInfo?.contentfulConfig?.spaceId || 'Not available'}</li>
                        <li><strong>Environment:</strong> {diagnosticInfo?.contentfulConfig?.environment || 'Not available'}</li>
                        <li><strong>Has Valid Token:</strong> {diagnosticInfo?.contentfulConfig?.hasToken ? 'Yes' : 'No'}</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="error-details">
                    <AccordionTrigger className="text-amber-700">
                      Error Details
                    </AccordionTrigger>
                    <AccordionContent className="bg-white p-3 rounded border border-amber-100">
                      <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto">
                        {diagnosticInfo?.errorDetails || 'No detailed error information available'}
                      </pre>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
              
              <div className="flex gap-4 justify-center">
                <Button asChild variant="default">
                  <Link to="/products">Browse Products</Link>
                </Button>
                <Button asChild variant="outline" className="inline-flex items-center">
                  <a href="/diagnostic" className="inline-flex items-center">
                    <Info className="mr-2 h-4 w-4" /> View Full Diagnostic Page
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ) : !product ? (
          <div className="container py-12">
            <div className="max-w-3xl mx-auto">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center mb-8">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">Product Not Found</h2>
                <p className="text-orange-700 mb-6">We couldn't find the product "{slug}" in our Contentful database.</p>
                
                <Card className="border border-orange-200 bg-white p-5 text-left mb-6">
                  <h3 className="text-lg font-semibold text-orange-800 mb-3">Possible Reasons:</h3>
                  <ul className="list-disc pl-5 space-y-2 text-orange-700">
                    <li>The product slug <strong>{slug}</strong> might not match any Contentful entry</li>
                    <li>The product may exist but with a different slug format</li>
                    <li>The product might not be published in Contentful</li>
                    <li>There might be a connection issue with Contentful</li>
                  </ul>
                </Card>
                
                <Button asChild variant="default" className="mb-4">
                  <Link to="/products">Browse Products</Link>
                </Button>
              </div>
              
              <Card className="border border-amber-200 bg-amber-50 p-5">
                <h3 className="text-lg font-semibold text-amber-800 flex items-center mb-4">
                  <Bug className="mr-2 h-5 w-5" />
                  Diagnostic Information
                </h3>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="request-info">
                    <AccordionTrigger className="text-amber-700">
                      Request Information
                    </AccordionTrigger>
                    <AccordionContent className="bg-white p-3 rounded border border-amber-100">
                      <ul className="space-y-2 text-sm">
                        <li><strong>Requested Slug:</strong> {slug || 'None'}</li>
                        <li><strong>Content Type:</strong> {diagnosticInfo?.contentType || 'productType'}</li>
                        <li><strong>Query:</strong> <pre className="bg-gray-50 p-2 rounded text-xs mt-1 overflow-auto">{JSON.stringify(diagnosticInfo?.query || {}, null, 2)}</pre></li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="contentful-info">
                    <AccordionTrigger className="text-amber-700">
                      Contentful Configuration
                    </AccordionTrigger>
                    <AccordionContent className="bg-white p-3 rounded border border-amber-100">
                      <ul className="space-y-2 text-sm">
                        <li><strong>Space ID:</strong> {diagnosticInfo?.contentfulConfig?.spaceId || 'Not available'}</li>
                        <li><strong>Environment:</strong> {diagnosticInfo?.contentfulConfig?.environment || 'Not available'}</li>
                        <li><strong>Has Valid Token:</strong> {diagnosticInfo?.contentfulConfig?.hasToken ? 'Yes' : 'No'}</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            </div>
          </div>
        ) : (
          <>
            <ProductHeroSection
              productType={product.title}
              description={product.description}
              image={product.image?.url || '/placeholder.svg'}
              benefits={product.benefits || []}
            />

            {product.features && product.features.length > 0 && (
              <section className="py-16 bg-gray-50">
                <div className="container mx-auto">
                  <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {product.features.map((feature) => (
                        <div key={feature.id} className="bg-white rounded-lg p-6 shadow-md">
                          <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                          <p className="text-gray-600">{feature.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className="py-16 bg-vending-blue-dark text-white">
              <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto">
                  Contact our team today to learn more about {product.title} and how it can benefit your business.
                </p>
                <Button 
                  asChild
                  size="lg" 
                  className="bg-vending-teal hover:bg-vending-teal-dark"
                >
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </section>
          </>
        )}
      </ContentfulErrorBoundary>
    </Layout>
  );
};

export default ProductDetailPage;
