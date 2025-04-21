import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProductTypes } from '@/services/cms';
import { CMSProductType } from '@/types/cms';
import { normalizeSlug } from '@/services/cms/utils/slugMatching';
import { useHomePageContent } from '@/hooks/useHomePageContent';

interface ProductCardProps {
  title: string;
  description: string;
  image: string;
  path: string;
}

const ProductCard = ({ title, description, image, path }: ProductCardProps) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <Button asChild variant="outline" className="w-full">
          <Link to={path} className="flex items-center justify-center">
            Learn more <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

const ProductTypesSection = () => {
  const { data: homeContent } = useHomePageContent();

  const { data: productTypes = [], isLoading, error } = useQuery({
    queryKey: ['productTypes'],
    queryFn: () => getProductTypes(),
    retry: 2,
    retryDelay: 1000,
    meta: {
      onError: (err: any) => {
        console.error('Error fetching product types:', err);
      }
    }
  });

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

  const displayProductTypes = (productTypes && productTypes.length > 0) 
    ? productTypes.map((product: CMSProductType) => ({
        title: product.title,
        description: product.description,
        image: product.image?.url || "https://images.unsplash.com/photo-1606787366850-de6330128bfc",
        path: `/products/${normalizeSlug(product.slug)}`
      }))
    : staticProductTypes;
  
  const featuredProductTypes = displayProductTypes.slice(0, 4);
  
  const shouldShowLoading = isLoading && !error;
  
  return (
    <section className="py-16 md:py-24">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-4">
              {homeContent?.productCategoriesTitle}
            </h2>
            <p className="subtitle max-w-2xl">
              {homeContent?.productCategoriesDescription}
            </p>
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <Link to="/products">View All Product Types</Link>
          </Button>
        </div>
        
        {shouldShowLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden shadow-md bg-white p-4">
                <div className="animate-pulse">
                  <div className="bg-gray-300 h-48 w-full mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProductTypes.map((product, index) => (
              <ProductCard 
                key={index}
                title={product.title}
                description={product.description}
                image={product.image}
                path={product.path}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductTypesSection;
