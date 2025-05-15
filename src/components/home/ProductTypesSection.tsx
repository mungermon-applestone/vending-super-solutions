
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CMSProductType } from '@/types/cms';
import { useHomePageContent } from '@/hooks/useHomePageContent';
import ProductCard from '@/components/products/ProductCard';
import { useFeaturedProducts } from '@/hooks/cms/useFeaturedItems';
import { Skeleton } from '@/components/ui/skeleton';

const ProductTypesSection = () => {
  const { data: homeContent } = useHomePageContent();
  
  console.log('[ProductTypesSection] Content:', homeContent);

  // Use the specific hook for featured products
  const { 
    data: productTypes = [], 
    isLoading, 
    error 
  } = useFeaturedProducts();

  console.log('[ProductTypesSection] Featured products:', {
    count: productTypes?.length,
    data: productTypes,
    isLoading,
    hasError: !!error
  });

  // Fallback static data when no products are available
  const staticProductTypes = [
    {
      title: "Grocery",
      description: "Automate grocery sales with temperature-controlled vending for snacks, drinks, and everyday essentials.",
      image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a",
      path: "/products/grocery"
    },
    {
      title: "Vape & Cannabis",
      description: "Secure solutions for age-restricted products with ID verification and compliance features.",
      image: "https://images.unsplash.com/photo-1560913210-91e811632701",
      path: "/products/vape"
    },
    {
      title: "Fresh Food",
      description: "Temperature-monitored vending for fresh meals, salads, and sandwiches with extended shelf life tracking.",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      path: "/products/fresh-food"
    },
    {
      title: "Cosmetics",
      description: "Premium display options for beauty products with detailed product information access.",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
      path: "/products/cosmetics"
    }
  ];

  // Only use productTypes if they are available and not empty, otherwise use static data
  // But only if we're not still loading and there's no error
  const shouldUseRealData = !isLoading && !error && productTypes && productTypes.length > 0;
  
  // Map the CMS data or fallback to static data
  const displayProductTypes = shouldUseRealData
    ? productTypes.map((product: CMSProductType) => ({
        ...product,
        image: product.image || {
          id: product.id,
          url: "https://images.unsplash.com/photo-1606787366850-de6330128bfc",
          alt: product.title
        }
      }))
    : staticProductTypes.map(product => ({
        id: product.path,
        title: product.title,
        description: product.description,
        slug: product.path.replace('/products/', ''),
        image: {
          id: product.path,
          url: product.image,
          alt: product.title
        }
      } as CMSProductType));
  
  const featuredProductTypes = displayProductTypes.slice(0, 4);
  
  console.log('[ProductTypesSection] Display types:', {
    isUsingRealData: shouldUseRealData,
    featuredCount: featuredProductTypes.length,
    firstItem: featuredProductTypes[0]?.title
  });
  
  return (
    <section className="py-16 md:py-24">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-4">
              {homeContent?.productCategoriesTitle || "Featured Product Categories"}
            </h2>
            <p className="subtitle max-w-2xl">
              {homeContent?.productCategoriesDescription || "Find the perfect vending solution for your product type."}
            </p>
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <Link to="/products">View All Product Types</Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden shadow-md bg-white p-4">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Error loading product types</p>
            <p className="text-sm text-gray-500">Using fallback product data</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {featuredProductTypes.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProductTypes.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductTypesSection;
