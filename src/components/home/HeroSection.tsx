
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useHeroContent } from '@/hooks/cms/useHeroContent';
import Image from '@/components/common/Image';

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
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-vending-blue-dark">
              {title}
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl">
              {subtitle}
            </p>
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
          <div className="relative flex justify-center">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full" style={{ maxHeight: '500px' }}>
              <div className="aspect-[16/9] w-full">
                <Image 
                  src={imageUrl}
                  alt={imageAlt}
                  className="w-full h-full"
                  objectFit="contain"
                  aspectRatio="16/9"
                  priority={true}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
            </div>
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
