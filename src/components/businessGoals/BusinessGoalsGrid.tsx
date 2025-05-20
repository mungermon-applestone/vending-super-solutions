
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { CMSBusinessGoal } from '@/types/cms';
import { Spinner } from '@/components/ui/spinner';
import Image from '@/components/common/Image';

interface BusinessGoalsGridProps {
  goals: CMSBusinessGoal[];
  title?: string;
  description?: string;
  isLoading?: boolean;
  error?: Error | null;
  compactView?: boolean;
  columnCount?: number;
  ultraCompact?: boolean;
}

const BusinessGoalsGrid: React.FC<BusinessGoalsGridProps> = ({ 
  goals, 
  title = "Select Your Business Goal",
  description = "Click on any business goal to learn more about how we can help you achieve it.",
  isLoading = false,
  error = null,
  compactView = false,
  columnCount = 3,
  ultraCompact = false
}) => {
  if (isLoading) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-medium mb-4">{title}</h2>
        <p className="text-gray-500 mb-6">{description}</p>
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
        <p className="mt-4 text-gray-500">Loading business goals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-medium mb-4">{title}</h2>
        <p className="text-red-500 mb-6">Error loading business goals: {error.message}</p>
      </div>
    );
  }

  if (!goals || goals.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-medium mb-4">{title}</h2>
        <p className="text-gray-500 mb-6">{description}</p>
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
        <p className="mt-4 text-gray-500">Loading business goals...</p>
      </div>
    );
  }

  // Define column classes based on columnCount prop
  const columnClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[columnCount] || "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  // Image height classes based on compact view
  let imageHeightClass = "h-48";
  let cardClass = "flex flex-col h-full";
  let contentClass = "p-5 flex-grow";
  
  if (ultraCompact) {
    imageHeightClass = "h-32";
    contentClass = "p-3";
  } else if (compactView) {
    imageHeightClass = "h-40";
    contentClass = "p-4";
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>
      
      <div className={`grid ${columnClasses} gap-6`}>
        {goals.map((goal) => (
          <Link 
            key={goal.id} 
            to={`/business-goals/${goal.slug}`}
            className="block w-full"
          >
            <Card className={`${cardClass} overflow-hidden transition-shadow duration-300 hover:shadow-lg max-w-sm mx-auto w-full`}>
              {/* Image container with fixed height */}
              <div className={`${imageHeightClass} w-full overflow-hidden bg-gray-50`}>
                {goal.image ? (
                  <Image
                    src={goal.image.url}
                    alt={goal.title}
                    className="w-full h-full"
                    objectFit="contain"
                    priority={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">{goal.title}</span>
                  </div>
                )}
              </div>
              <div className={contentClass}>
                <h3 className="text-xl font-semibold mb-2">{goal.title}</h3>
                {!ultraCompact && (
                  <p className="text-gray-600 line-clamp-2">{goal.description}</p>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BusinessGoalsGrid;
