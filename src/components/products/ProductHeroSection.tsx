
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Image from '@/components/common/Image';

/**
 * Product Hero Section Component
 * 
 * IMPORTANT REGRESSION PREVENTION NOTES:
 * - This component is used across all product type pages
 * - Maintains consistent layout with left text, right image on desktop 
 * - Benefits list is crucial for product marketing and must maintain checkmark styling
 * - CTA buttons (primary/secondary) maintain consistent hierarchy and styling
 * 
 * Layout specifications:
 * - Uses grid layout with 2 columns on desktop (lg:grid-cols-2)
 * - Text content on left, image on right
 * - Stacked layout on mobile (grid-cols-1)
 * - Specific background gradient must be maintained for brand consistency
 * - Image uses specific shadow and rounding (rounded-lg shadow-xl)
 * 
 * @param {ProductHeroSectionProps} props - Component properties 
 * @returns React component
 */
interface ProductHeroSectionProps {
  productType: string;
  description: string;
  image: string;
  benefits: string[];
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
}

const ProductHeroSection = ({
  productType,
  description,
  image,
  benefits,
  primaryAction,
  secondaryAction
}: ProductHeroSectionProps) => {
  // Filter out duplicate benefits
  const uniqueBenefits = [...new Set(benefits)];
  
  // Default actions if none are provided
  const defaultPrimaryAction = (
    <Button asChild className="btn-primary">
      <Link to="/contact">Request a Demo</Link>
    </Button>
  );
  
  const defaultSecondaryAction = (
    <Button asChild variant="outline">
      <Link to="/products">View Other Product Types</Link>
    </Button>
  );
  
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content area - Must remain on left */}
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-vending-blue-dark">
              {productType}
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              {description}
            </p>
            
            {/* Benefits list - Critical marketing content */}
            <div className="space-y-4 mb-8">
              {uniqueBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-vending-teal mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
            
            {/* CTA buttons - Maintain hierarchy */}
            <div className="flex flex-col sm:flex-row gap-4">
              {primaryAction || defaultPrimaryAction}
              {secondaryAction || defaultSecondaryAction}
            </div>
          </div>
          
          {/* Image area - Must remain on right */}
          <div className="relative">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="aspect-[4/3] w-full flex items-center justify-center">
                <Image 
                  src={image} 
                  alt={`${productType}`} 
                  className="w-full h-full"
                  objectFit="contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHeroSection;
