
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { HeroSlide as HeroSlideType } from '@/hooks/cms/useHeroSlides';
import Image from '@/components/common/Image';
import { useTranslatedHeroSlide } from '@/hooks/useTranslatedCMSContent';
import TranslatableText from '@/components/translation/TranslatableText';

interface HeroSlideProps {
  slide: HeroSlideType;
}

const DEFAULT_FEATURES = [
  "Hardware Agnostic",
  "Real-time Inventory",
  "Multiple Payment Options",
  "Advanced Analytics"
];

const DEFAULT_BADGE_TEXT = "Works with multiple machine models";

const HeroSlide: React.FC<HeroSlideProps> = ({ slide }) => {
  const { translatedContent: translatedSlide } = useTranslatedHeroSlide(slide);
  
  const {
    title,
    subtitle,
    image,
    primaryButtonText,
    primaryButtonUrl,
    secondaryButtonText,
    secondaryButtonUrl,
    backgroundClass = "bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light",
    featureItems,
    badgeText
  } = translatedSlide || slide;

  const features = featureItems?.length ? featureItems : DEFAULT_FEATURES;
  const badge = badgeText ?? DEFAULT_BADGE_TEXT;

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
              {primaryButtonText && primaryButtonUrl && (
                <Button asChild className="btn-primary" size="lg">
                  <Link to={primaryButtonUrl}>
                    {primaryButtonText} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
              {secondaryButtonText && secondaryButtonUrl && (
                <Button asChild variant="outline" size="lg">
                  <Link to={secondaryButtonUrl}>
                    {secondaryButtonText}
                  </Link>
                </Button>
              )}
            </div>
            {/* Feature grid - 2x2 on desktop, stacked on mobile */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="text-vending-teal h-5 w-5" />
                  <span className="text-gray-700">
                    <TranslatableText context="hero-features">{feature}</TranslatableText>
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Image section - Must remain on right on desktop */}
          <div className="relative flex justify-center">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full" style={{ maxHeight: '600px' }}>
              <div className="aspect-[3/4] w-full h-full flex items-center justify-center">
                <Image 
                  src={image.url || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"}
                  alt={image.alt || title}
                  className="w-full h-full"
                  objectFit="contain"
                  priority={true}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
            </div>
            {/* Badge overlay - Desktop only */}
            {badge && (
              <div className="absolute -bottom-6 -right-6 bg-vending-teal text-white p-4 rounded-lg shadow-lg hidden md:block">
                <p className="font-bold">
                  <TranslatableText context="hero-badge">{badge}</TranslatableText>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlide;
