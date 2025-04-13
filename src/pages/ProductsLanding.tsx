import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useProductTypes } from '@/hooks/cms/useProductTypes';
import { Link } from 'react-router-dom';
import CTASection from '@/components/common/CTASection';
import PageHero from '@/components/common/PageHero';

const ProductsLanding = () => {
  const { data: productTypes = [], isLoading } = useProductTypes();
  
  return (
    <Layout>
      <PageHero 
        pageKey="products"
        fallbackTitle="Custom Vending Solutions for Any Product"
        fallbackSubtitle="From food and beverages to electronics and PPE, our flexible vending solutions can accommodate nearly any product type."
        fallbackImage="https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e"
        fallbackImageAlt="Various products in vending machine display"
        fallbackPrimaryButtonText="Request Product Demo"
        fallbackPrimaryButtonUrl="/contact"
        fallbackSecondaryButtonText="View Machine Types"
        fallbackSecondaryButtonUrl="/machines"
      />
      
      {/* Rest of the component remains unchanged */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-vending-blue-dark mb-4">
              Explore Our Product Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the perfect vending solution tailored to your specific product needs.
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 h-80">
                  <div className="animate-pulse">
                    <div className="bg-gray-300 h-40 w-full mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
                    <div className="h-10 bg-gray-300 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : productTypes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productTypes.map((productType) => (
                <Card key={productType.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    <img 
                      src={productType.image_url} 
                      alt={productType.image_alt || productType.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{productType.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{productType.description}</p>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/products/${productType.slug}`} className="flex items-center justify-center">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p>No product types found.</p>
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default ProductsLanding;
