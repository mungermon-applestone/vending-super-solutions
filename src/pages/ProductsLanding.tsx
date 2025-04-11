
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import CTASection from '@/components/common/CTASection';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import CaseStudyCarousel from '@/components/case-studies/CaseStudyCarousel';
import { getProductCaseStudies } from '@/data/caseStudiesData';
import { useProductTypes } from '@/hooks/cms/useProductTypes';
import { Skeleton } from '@/components/ui/skeleton';

const ProductsLanding = () => {
  // Fetch actual product types from CMS
  const { data: productTypes = [], isLoading } = useProductTypes();
  
  // For debugging
  useEffect(() => {
    console.log('Product types loaded on landing page:', productTypes);
  }, [productTypes]);

  // Map CMS products to display format with default features if none available
  const mappedProducts = productTypes.map(product => ({
    title: product.title,
    description: product.description || "No description available",
    image: product.image?.url || "https://images.unsplash.com/photo-1604719312566-8912e9227c6a",
    path: `/products/${product.slug}`,
    features: product.benefits?.slice(0, 3).map(benefit => benefit) || ["Smart vending solution"]
  }));

  // Get product case studies
  const productCaseStudies = getProductCaseStudies();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light py-16">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-vending-blue-dark mb-6">
                Types of Products You Can Sell
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl">
                Our versatile vending software enables you to sell virtually any product type. Whether you're a vending operator, enterprise, SMB, or brand, our solutions adapt to your specific needs.
              </p>
              <div className="flex gap-4">
                <Button asChild className="btn-primary">
                  <Link to="/contact">Request a Demo</Link>
                </Button>
                {productTypes.length > 0 && (
                  <Button asChild variant="outline">
                    <Link to="/admin/products">Manage Products</Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1481495278953-0a688f58e194" 
                alt="Various vending products" 
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-vending-teal text-white p-4 rounded-lg shadow-lg hidden md:block">
                <p className="font-bold">Sell virtually any product</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Product Types Grid */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Product Types</h2>
              <p className="text-gray-600 max-w-2xl">
                {isLoading 
                  ? "Loading product types..." 
                  : productTypes.length > 0 
                    ? `Showing ${productTypes.length} product types` 
                    : "No product types found. Add some in the admin section!"
                }
              </p>
            </div>
            <Button asChild className="mt-4 md:mt-0">
              <Link to="/admin/products">Manage Products</Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : productTypes.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-6">Start by creating your first product type in the admin section.</p>
              <Button asChild>
                <Link to="/admin/products/new">Create First Product</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {mappedProducts.map((product, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x200?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    
                    {product.features && product.features.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {product.features.slice(0, 3).map((feature, i) => (
                            <span 
                              key={i}
                              className="text-xs bg-vending-blue-light text-vending-blue px-2 py-1 rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Button asChild variant="outline" className="w-full">
                      <Link to={product.path}>
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Case Studies Section */}
      <CaseStudyCarousel 
        title="Product Success Stories" 
        subtitle="See how our product solutions have helped businesses achieve their goals"
        caseStudies={productCaseStudies}
      />

      {/* Special Features Section */}
      <section className="py-16 bg-vending-gray">
        <div className="container-wide">
          <h2 className="text-3xl font-bold text-center mb-6">Special Features</h2>
          <p className="text-center subtitle mx-auto mb-16">
            Our software includes specialized features to help you sell any type of product effectively.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-vending-blue-light p-3 rounded-full w-14 h-14 flex items-center justify-center text-vending-blue mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Interactive Touchscreen</h3>
              <p className="text-gray-600">
                High-definition touchscreen interfaces provide detailed product information, nutritional facts, allergens, and interactive browsing experiences.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1558655146-d09347e92766" 
                alt="Interactive Touchscreen" 
                className="w-full h-48 object-cover rounded-lg mt-6" 
              />
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-vending-blue-light p-3 rounded-full w-14 h-14 flex items-center justify-center text-vending-blue mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Multiple Payment Options</h3>
              <p className="text-gray-600">
                Support for cashless payments, mobile wallets, credit cards, subscription models, and even cryptocurrency for maximum convenience.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1580894894513-541e068a3e2b" 
                alt="Payment Options" 
                className="w-full h-48 object-cover rounded-lg mt-6" 
              />
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-vending-blue-light p-3 rounded-full w-14 h-14 flex items-center justify-center text-vending-blue mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1c4.4 0 8.14 2.383 10 5.899V17.5a1.5 1.5 0 01-1.5 1.5h-17A1.5 1.5 0 010 17.5V7.899A11.954 11.954 0 012.166 4.999zm6.333 0c.35 0 .69.03 1.022.086a4.982 4.982 0 00-.658 2.497c0 .724.154 1.414.431 2.039a9.987 9.987 0 00-2.67-.91A9.992 9.992 0 0110 5c.685 0 1.354.07 2 .205a9.967 9.967 0 012.957 1.098 4.982 4.982 0 00-.442-2.178 10.043 10.043 0 00-6.016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Inventory Management</h3>
              <p className="text-gray-600">
                Real-time tracking, automatic reordering, and AI-powered stock optimization to minimize waste and maximize sales.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d" 
                alt="Inventory Management" 
                className="w-full h-48 object-cover rounded-lg mt-6" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Machine Types Preview */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Compatible Machine Types</h2>
              <p className="subtitle">
                Our software integrates seamlessly with a wide variety of vending machines and smart lockers.
              </p>
            </div>
            <Button asChild className="mt-4 md:mt-0">
              <Link to="/machines">View All Machines</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg overflow-hidden shadow-md relative group">
              <img 
                src="https://images.unsplash.com/photo-1525610553991-2bede1a236e2" 
                alt="Vending Machines" 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 w-full">
                  <h3 className="text-xl font-bold text-white mb-2">Vending Machines</h3>
                  <Link 
                    to="/machines/vending" 
                    className="text-white bg-vending-blue/80 hover:bg-vending-blue px-4 py-2 rounded inline-block mt-2"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-md relative group">
              <img 
                src="https://images.unsplash.com/photo-1621964275191-ccc01ef2134c" 
                alt="Smart Lockers" 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 w-full">
                  <h3 className="text-xl font-bold text-white mb-2">Smart Lockers</h3>
                  <Link 
                    to="/machines/lockers" 
                    className="text-white bg-vending-blue/80 hover:bg-vending-blue px-4 py-2 rounded inline-block mt-2"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-md relative group">
              <img 
                src="https://images.unsplash.com/photo-1493723843671-1d655e66ac1c" 
                alt="Mixed Solutions" 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 w-full">
                  <h3 className="text-xl font-bold text-white mb-2">Mixed Solutions</h3>
                  <Link 
                    to="/machines/mixed" 
                    className="text-white bg-vending-blue/80 hover:bg-vending-blue px-4 py-2 rounded inline-block mt-2"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </Layout>
  );
};

export default ProductsLanding;
