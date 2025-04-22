
import React from 'react';

interface TechnologySectionItemProps {
  title: string;
  summary: string;
  bulletPoints: string[];
  imageUrl: string;
  imageAlt: string;
  index: number;
}

const TechnologySectionItem: React.FC<TechnologySectionItemProps> = ({
  title,
  summary,
  bulletPoints,
  imageUrl,
  imageAlt,
  index
}) => {
  const isEven = index % 2 === 0;
  
  return (
    <section className={`py-16 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12`}>
          <div className="w-full md:w-1/2">
            <div className="overflow-hidden rounded-lg shadow-lg">
              <img 
                src={imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl}
                alt={imageAlt} 
                className="w-full h-auto object-cover"
                onError={(e) => {
                  console.error("Image failed to load:", imageUrl);
                  e.currentTarget.src = "https://via.placeholder.com/800x600?text=Technology+Image";
                }}
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/2 space-y-4">
            <h2 className="text-3xl font-bold">{title}</h2>
            <p className="text-lg text-gray-700">{summary}</p>
            
            {bulletPoints && bulletPoints.length > 0 && (
              <ul className="space-y-3 mt-4">
                {bulletPoints.map((point, i) => (
                  <li key={i} className="flex items-start">
                    <div className="mr-3 mt-1">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySectionItem;
