
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductHeroSection from '@/components/products/ProductHeroSection';
import ProductFeaturesList from '@/components/products/ProductFeaturesList';
import ProductExamples from '@/components/products/ProductExamples';
import ProductVideoSection from '@/components/products/ProductVideoSection';
import CTASection from '@/components/common/CTASection';
import { Nutrition, ShoppingBag, ShieldCheck, Tags, Truck, Clock } from 'lucide-react';

// This is a sample implementation for the Grocery product type page
// In a real implementation, you would fetch this data from an API or CMS
const ProductDetail = () => {
  const { productType } = useParams<{ productType: string }>();
  
  // Default to grocery if no product type is specified
  const currentProductType = productType || 'grocery';
  
  // Sample data for grocery vending
  const groceryData = {
    title: "Grocery",
    description: "Our vending software helps you sell packaged foods, snacks, drinks, and everyday essentials with robust inventory management and temperature monitoring.",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a",
    benefits: [
      "Real-time inventory tracking and automated reordering",
      "Temperature monitoring and alerts for refrigerated items",
      "Multi-payment options including contactless and mobile payments",
      "Nutritional information display for health-conscious consumers",
      "Product expiration date tracking to reduce waste",
      "Analytics for optimizing product selection based on sales data"
    ],
    features: [
      {
        title: "Smart Inventory Management",
        description: "Track inventory levels in real-time, set automatic reorder points, and receive alerts when stock runs low. Our system uses predictive analytics to help you optimize your product mix and reduce waste.",
        icon: <ShoppingBag className="h-6 w-6 text-vending-teal" />,
        screenshot: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
      },
      {
        title: "Temperature Monitoring",
        description: "Ensure food safety with continuous temperature monitoring for refrigerated items. Receive immediate alerts if temperatures fall outside safe ranges to prevent product spoilage.",
        icon: <ShieldCheck className="h-6 w-6 text-vending-teal" />,
        screenshot: "https://images.unsplash.com/photo-1606248897732-2c5ffe759c04"
      },
      {
        title: "Nutritional Information Display",
        description: "Help customers make informed choices with detailed nutritional information, ingredient lists, and allergen warnings displayed on the touchscreen interface.",
        icon: <Nutrition className="h-6 w-6 text-vending-teal" />,
        screenshot: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b"
      },
      {
        title: "Dynamic Pricing",
        description: "Implement flexible pricing strategies including time-based discounts, bundle offers, and loyalty rewards to increase sales and reduce waste of perishable items.",
        icon: <Tags className="h-6 w-6 text-vending-teal" />,
        screenshot: "https://images.unsplash.com/photo-1553729459-efe14ef6055d"
      },
      {
        title: "Supply Chain Integration",
        description: "Seamlessly connect with your suppliers for automated ordering, delivery scheduling, and inventory reconciliation to streamline your operations.",
        icon: <Truck className="h-6 w-6 text-vending-teal" />
      },
      {
        title: "Expiration Date Tracking",
        description: "Track product expiration dates to ensure freshness, automate price reductions for items nearing expiration, and minimize waste through smart inventory rotation.",
        icon: <Clock className="h-6 w-6 text-vending-teal" />
      }
    ],
    examples: [
      {
        title: "Campus Convenience",
        description: "University deployed grocery vending machines across campus, providing 24/7 access to essentials for students.",
        image: "https://images.unsplash.com/photo-1607492138996-7141257a4b67"
      },
      {
        title: "Workplace Pantry",
        description: "Tech company replaced traditional break room with smart vending solution, offering healthy snacks and meal options.",
        image: "https://images.unsplash.com/photo-1567521464027-f35b1f9447e2"
      },
      {
        title: "Apartment Complex Convenience",
        description: "Residential building installed grocery vending in the lobby, giving residents access to essentials without leaving the building.",
        image: "https://images.unsplash.com/photo-1559553156-2e97137af16f"
      }
    ],
    video: {
      title: "See Grocery Vending in Action",
      description: "Watch how our grocery vending solutions provide convenience and accessibility for consumers while offering robust management tools for operators.",
      thumbnailImage: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2"
    }
  };
  
  // In a real implementation, you would dynamically load data based on the product type
  // For demo purposes, we're just using the grocery data
  
  return (
    <Layout>
      <ProductHeroSection 
        productType={groceryData.title}
        description={groceryData.description}
        image={groceryData.image}
        benefits={groceryData.benefits}
      />
      
      <ProductFeaturesList features={groceryData.features} />
      
      <ProductExamples examples={groceryData.examples} />
      
      <ProductVideoSection
        title={groceryData.video.title}
        description={groceryData.video.description}
        thumbnailImage={groceryData.video.thumbnailImage}
      />
      
      <CTASection />
    </Layout>
  );
};

export default ProductDetail;
