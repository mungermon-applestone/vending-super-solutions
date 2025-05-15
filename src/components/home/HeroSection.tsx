
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useHeroContent } from '@/hooks/cms/useHeroContent';
import Image from '@/components/common/Image';

/**
 * Hero Section Component
 * 
 * IMPORTANT REGRESSION PREVENTION NOTES:
 * - This is the primary hero component displayed on the homepage
 * - Maintains specific layout: text content on left, image on right
 * - Responsive design includes stacked layout on mobile (col) and side-by-side on desktop (grid)
 * - Contains primary and secondary CTA buttons that must remain prominent
 * - Feature list with checkmarks must have consistent styling and alignment
 * - Background uses a gradient that should be preserved for brand consistency
 * 
 * Design specifications:
 * - Text/Image ratio is approximately 1:1 on desktop (lg:grid-cols-2)
 * - Maintains specific padding/spacing rhythm (py-16 md:py-24)
 * - CTA buttons maintain consistent styling and hierarchy
 * - Feature highlights are displayed in a 2x2 grid on desktop
 * 
 * @returns React component
 */
const HeroSection = () => {
  const { data: heroContent, isLoading } = useHeroContent("home");
  
  console.log("Hero section rendering", { heroContent, isLoading, pageKey: "home" });
  
  // If we're loading, show a skeleton
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
        <div className="container-wide py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Skeleton className="h-10 w-36" />
                <Skeleton className="h-10 w-36" />
              </div>
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
            </div>
            <div className="relative flex justify-center">
              <Skeleton className="w-full h-80 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Use content from Contentful or fallback to default values
  const title = heroContent?.title || "Vend Anything You Sell";
  const subtitle = heroContent?.subtitle || "Seamlessly integrate multiple vending machines with our advanced software solution. Sell any product, track inventory in real-time, and boost your revenue.";
  const primaryButtonText = heroContent?.primaryButtonText || "Request a Demo";
  const primaryButtonUrl = heroContent?.primaryButtonUrl || "/contact";
  const secondaryButtonText = heroContent?.secondaryButtonText || "Explore Solutions";
  const secondaryButtonUrl = heroContent?.secondaryButtonUrl || "/products";
  const imageUrl = heroContent?.image?.url || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81";
  const imageAlt = heroContent?.image?.alt || "Vending Machine Software Interface";
  const backgroundClass = heroContent?.backgroundClass || "bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light";
  
  return (
    <div className={backgroundClass}>
      <div className="container-wide py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content section - Must remain on left on desktop */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-vending-blue-dark">
              {title}
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl">
              {subtitle}
            </p>
            {/* CTA buttons - Maintain hierarchy with primary button first */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button asChild className="btn-primary" size="lg">
                <Link to={primaryButtonUrl}>
                  {primaryButtonText} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to={secondaryButtonUrl}>
                  {secondaryButtonText}
                </Link>
              </Button>
            </div>
            {/* Feature grid - 2x2 on desktop, stacked on mobile */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-vending-teal h-5 w-5" />
                <span className="text-gray-700">Hardware Agnostic</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-vending-teal h-5 w-5" />
                <span className="text-gray-700">Real-time Inventory</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-vending-teal h-5 w-5" />
                <span className="text-gray-700">Multiple Payment Options</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-vending-teal h-5 w-5" />
                <span className="text-gray-700">Advanced Analytics</span>
              </div>
            </div>
          </div>
          
          {/* Image section - Must remain on right on desktop */}
          <div className="relative flex justify-center">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full" style={{ maxHeight: '600px' }}>
              <div className="aspect-[3/4] w-full h-full flex items-center justify-center">
                <Image 
                  src={imageUrl}
                  alt={imageAlt}
                  className="w-full h-full"
                  objectFit="contain"
                  priority={true}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
            </div>
            {/* Badge overlay - Desktop only */}
            <div className="absolute -bottom-6 -right-6 bg-vending-teal text-white p-4 rounded-lg shadow-lg hidden md:block">
              <p className="font-bold">Works with multiple machine models</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
