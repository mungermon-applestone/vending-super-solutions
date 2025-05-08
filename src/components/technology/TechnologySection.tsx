
import React, { useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * TechnologySection Component
 * 
 * IMPORTANT REGRESSION PREVENTION NOTES:
 * - This component displays technology information with an alternating layout pattern
 * - The layout alternates between image-left/text-right and text-left/image-right 
 *   based on the index prop (even indices have image on left, odd indices have image on right)
 * - Maintains consistent spacing, typography, and image handling
 * - Includes proper fallback handling for missing images and loading states
 * 
 * Layout specifications:
 * - Uses flex-row/flex-row-reverse based on index for desktop layout
 * - Uses 50/50 width split between image and text (md:w-1/2)
 * - Stacked layout on mobile (flex-col)
 * - Image container has consistent aspect ratio and shadow styling
 * 
 * @param props Component properties
 * @returns React component
 */
interface TechnologySectionProps {
  id: string;
  title: string;
  summary: string;
  bulletPoints?: string[];
  image: {
    url: string;
    alt?: string;
  };
  index: number;
  className?: string;
}

const TechnologySection = ({ 
  id, 
  title, 
  summary, 
  bulletPoints = [], 
  image, 
  index,
  className 
}: TechnologySectionProps) => {
  const isEven = index % 2 === 0;
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const fallbackImage = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";
  
  useEffect(() => {
    // Reset state when image changes
    setImageLoaded(false);
    setImageError(false);
    
    // Enhanced logging to help debug image rendering issues
    console.log(`[TechnologySection ${id}] Rendering section with image:`, {
      title,
      summaryProvided: !!summary,
      summaryLength: summary?.length || 0,
      imageProvided: !!image,
      imageUrl: image?.url || 'No URL',
      bulletPointsCount: bulletPoints?.length || 0
    });
    
    if (!title) {
      console.warn(`[TechnologySection ${id}] Missing title for section`);
    }
    
    if (!summary) {
      console.warn(`[TechnologySection ${id}] Missing summary for section "${title}"`);
    }

    if (!image?.url) {
      console.warn(`[TechnologySection ${id}] Missing image URL for section "${title}"`);
    }
  }, [id, title, summary, image, bulletPoints]);

  // Preload image
  React.useEffect(() => {
    if (image?.url) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => {
        console.error(`[TechnologySection ${id}] Failed to load image:`, image.url);
        setImageError(true);
      };
      img.src = image.url;
    }
  }, [id, image]);

  return (
    <section id={id} className={cn("py-16 bg-gradient-to-b from-white to-gray-50", className)}>
      <div className="container max-w-7xl mx-auto px-4">
        {/* Alternating layout based on index - critical for design consistency */}
        <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
          {/* Image Section - width and styling must be maintained */}
          <div className="w-full md:w-1/2">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
              {!imageLoaded && !imageError && (
                <Skeleton className="absolute inset-0 w-full h-full" />
              )}
              
              <img 
                src={imageError ? fallbackImage : (image?.url || fallbackImage)} 
                alt={image?.alt || title || "Technology section"}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover",
                  !imageLoaded && !imageError && "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  console.error(`[TechnologySection ${id}] Image failed to load:`, image?.url);
                  setImageError(true);
                  e.currentTarget.src = fallbackImage;
                }}
              />
            </div>
          </div>

          {/* Content Section - typography and spacing must be maintained */}
          <div className="w-full md:w-1/2 space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">{title || "Technology Section"}</h2>
              
              {summary && summary.trim() !== '' && (
                <p className="text-lg text-muted-foreground" data-testid="technology-summary">
                  {summary}
                </p>
              )}
              
              {/* Bullet points with consistent styling */}
              {bulletPoints && bulletPoints.length > 0 && (
                <ul className="space-y-3 mt-6">
                  {bulletPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1 flex-shrink-0">
                        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-base text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
