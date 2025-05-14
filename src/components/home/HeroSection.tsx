
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useHomePageContent } from '@/hooks/useHomePageContent';

const HeroSection: React.FC = () => {
  const { data: homeContent, isLoading } = useHomePageContent();
  
  const defaultHero = {
    headline: 'Smart Vending Management Platform',
    subheading: 'A complete solution for modern, data-driven vending operations',
    ctaText: 'Get Started',
    ctaLink: '/contact',
    secondaryCTAText: 'Learn More',
    secondaryCTALink: '/about',
    backgroundImage: '/images/hero-background.jpg',
    backgroundImageAlt: 'Smart vending machines'
  };

  const hero = homeContent || { 
    heroHeadline: defaultHero.headline,
    heroSubheading: defaultHero.subheading,
    heroCTAText: defaultHero.ctaText,
    heroCTALink: defaultHero.ctaLink,
    ctaSecondaryButtonText: defaultHero.secondaryCTAText,
    ctaSecondaryButtonUrl: defaultHero.secondaryCTALink
  };

  // Helper function to safely get text content with fallbacks
  const getTextContent = (primaryKey: string, fallbackKeys: string[], defaultValue: string): string => {
    if (hero && primaryKey in hero && hero[primaryKey as keyof typeof hero]) {
      return hero[primaryKey as keyof typeof hero] as string;
    }
    
    // Try fallback keys
    for (const key of fallbackKeys) {
      if (hero && key in hero && hero[key as keyof typeof hero]) {
        return hero[key as keyof typeof hero] as string;
      }
    }
    
    return defaultValue;
  };

  // Determine the background style
  const backgroundStyle = homeContent?.heroImage
    ? { backgroundImage: `url(${homeContent.heroImage})` }
    : { backgroundImage: 'linear-gradient(to right, #1e3a8a, #3b82f6)' };

  if (isLoading) {
    return (
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="w-full md:w-2/3 lg:w-1/2">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-6 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  // Use the helper function to get content with fallbacks
  const headlineText = getTextContent('heroHeadline', ['headline', 'title'], defaultHero.headline);
  const subheadingText = getTextContent('heroSubheading', ['subheading', 'subtitle'], defaultHero.subheading);
  const primaryButtonText = getTextContent('heroCTAText', ['ctaText', 'primaryButtonText'], defaultHero.ctaText);
  const primaryButtonUrl = getTextContent('heroCTALink', ['ctaLink', 'primaryButtonUrl'], defaultHero.ctaLink);
  const secondaryButtonText = getTextContent('ctaSecondaryButtonText', ['secondaryButtonText', 'secondaryCTAText'], defaultHero.secondaryCTAText);
  const secondaryButtonUrl = getTextContent('ctaSecondaryButtonUrl', ['secondaryButtonUrl', 'secondaryCTALink'], defaultHero.secondaryCTALink);

  return (
    <section className="relative min-h-[600px] flex items-center py-20">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={backgroundStyle}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {headlineText}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            {subheadingText}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to={primaryButtonUrl}>
                {primaryButtonText}
              </Link>
            </Button>
            
            {secondaryButtonText && (
              <Button asChild variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Link to={secondaryButtonUrl}>
                  {secondaryButtonText}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
