
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { CMSBusinessGoal } from '@/types/cms';
import { Spinner } from '@/components/ui/spinner';

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

  return (
    <div className="py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <Link key={goal.id} to={`/business-goals/${goal.slug}`}>
            <Card className="h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg">
              {goal.image && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={goal.image.url}
                    alt={goal.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">{goal.title}</h3>
                <p className="text-gray-600 line-clamp-3">{goal.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BusinessGoalsGrid;
