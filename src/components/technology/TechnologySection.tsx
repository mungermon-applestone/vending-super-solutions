
import React, { useEffect } from 'react';
import { cn } from "@/lib/utils";

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
  
  useEffect(() => {
    if (!title) {
      console.warn(`[TechnologySection ${id}] Missing title for section`);
    }
    
    if (!summary) {
      console.warn(`[TechnologySection ${id}] Missing summary for section "${title}"`);
    }

    if (!image?.url) {
      console.warn(`[TechnologySection ${id}] Missing image URL for section "${title}"`);
    }
  }, [id, title, summary, image]);

  return (
    <section id={id} className={cn("py-16 bg-gradient-to-b from-white to-gray-50", className)}>
      <div className="container max-w-7xl mx-auto px-4">
        <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
          {/* Image Section */}
          <div className="w-full md:w-1/2">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
              <img 
                src={image.url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"} 
                alt={image.alt || title || "Technology section"}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  console.error(`[TechnologySection ${id}] Image failed to load:`, image.url);
                  e.currentTarget.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";
                }}
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full md:w-1/2 space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">{title || "Technology Section"}</h2>
              
              {summary && summary.trim() !== '' && (
                <p className="text-lg text-muted-foreground" data-testid="technology-summary">
                  {summary}
                </p>
              )}
              
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
