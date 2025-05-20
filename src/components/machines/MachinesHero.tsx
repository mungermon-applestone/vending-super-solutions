
import React from 'react';

export interface MachinesHeroProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  pageContent?: {
    heroTitle?: string;
    heroSubtitle?: string;
    heroImage?: {
      fields?: {
        file?: {
          url?: string;
        };
      };
    };
  };
  isLoading?: boolean;
  error?: unknown;
}

const MachinesHero: React.FC<MachinesHeroProps> = ({
  title,
  subtitle,
  imageUrl,
  pageContent,
  isLoading,
  error
}) => {
  // Use direct props first, then fall back to pageContent
  const displayTitle = title || pageContent?.heroTitle || '';
  const displaySubtitle = subtitle || pageContent?.heroSubtitle || '';
  const displayImageUrl = imageUrl || (pageContent?.heroImage?.fields?.file?.url ? `https:${pageContent.heroImage.fields.file.url}` : undefined);
  
  return (
    <section className="relative bg-gradient-to-br from-vending-blue-light to-vending-teal-light py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-vending-blue-dark">
              {displayTitle}
            </h1>
            {displaySubtitle && (
              <p className="text-xl text-vending-blue">
                {displaySubtitle}
              </p>
            )}
          </div>
          {displayImageUrl && (
            <div className="md:w-1/2 flex justify-center">
              <img 
                src={displayImageUrl} 
                alt={displayTitle}
                className="rounded-lg shadow-xl max-h-80 object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MachinesHero;
