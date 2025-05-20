
import React from 'react';

interface PageHeroProps {
  title?: string;
  heading?: string;  // Alternative to title
  subtitle?: string;
  subheading?: string;  // Alternative to subtitle
  className?: string;
  children?: React.ReactNode;
  pageKey?: string; // Added for components using pageKey
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  fallbackImage?: string;
  fallbackImageAlt?: string;
  fallbackPrimaryButtonText?: string;
  fallbackPrimaryButtonUrl?: string;
  fallbackSecondaryButtonText?: string;
  fallbackSecondaryButtonUrl?: string;
}

const PageHero: React.FC<PageHeroProps> = ({ 
  title, 
  heading,
  subtitle, 
  subheading,
  className = '', 
  children,
  // Optional props below, not used directly
  pageKey,
  fallbackTitle,
  fallbackSubtitle,
  fallbackImage,
  fallbackImageAlt,
  fallbackPrimaryButtonText,
  fallbackPrimaryButtonUrl,
  fallbackSecondaryButtonText,
  fallbackSecondaryButtonUrl
}) => {
  // Use title or heading, with title taking precedence if both are provided
  const displayTitle = title || heading || fallbackTitle || '';
  // Use subtitle or subheading, with subtitle taking precedence if both are provided
  const displaySubtitle = subtitle || subheading || fallbackSubtitle || '';
  
  return (
    <div className={`py-16 md:py-24 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {displayTitle}
          </h1>
          {displaySubtitle && (
            <p className="text-xl text-gray-700">
              {displaySubtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageHero;
