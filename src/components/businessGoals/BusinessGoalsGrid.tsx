import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CMSBusinessGoal } from '@/types/cms';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MachineTypeIcon from '@/components/admin/machines/MachineTypeIcon';
import BusinessGoalsCompact from './BusinessGoalsCompact';

interface BusinessGoalsGridProps {
  title?: string;
  description?: string;
  goals: CMSBusinessGoal[];
  isLoading?: boolean;
  error?: Error | null;
  compactView?: boolean;
  columnCount?: 1 | 2 | 3 | 4;
  ultraCompact?: boolean;
  isHomepage?: boolean;
}

const BusinessGoalsGrid: React.FC<BusinessGoalsGridProps> = ({
  title,
  description,
  goals,
  isLoading = false,
  error = null,
  compactView = false,
  columnCount = 3,
  ultraCompact = false,
  isHomepage = false
}) => {
  const navigate = useNavigate();

  // Sort goals based on order properties
  const sortedGoals = useMemo(() => {
    if (!goals || goals.length === 0) return [];
    
    return [...goals].sort((a, b) => {
      // For homepage, use homepageOrder
      if (isHomepage) {
        const orderA = a.homepageOrder ?? 999;
        const orderB = b.homepageOrder ?? 999;
        if (orderA !== orderB) return orderA - orderB;
      } 
      // Otherwise use displayOrder
      else {
        const orderA = a.displayOrder ?? 999;
        const orderB = b.displayOrder ?? 999;
        if (orderA !== orderB) return orderA - orderB;
      }
      
      // Fall back to title sort if orders are the same
      return a.title.localeCompare(b.title);
    });
  }, [goals, isHomepage]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-6">
            <div className="mb-4">
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
            <Skeleton className="h-8 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Business Goals</h3>
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  if (sortedGoals.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Business Goals Found</h3>
        <p className="text-gray-600">Check back later for information on how our solutions can help your business.</p>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto">
        {(title || description) && (
          <div className="max-w-4xl mx-auto mb-12 text-center">
            {title && <h2 className="text-3xl font-bold text-vending-blue-dark mb-6">{title}</h2>}
            {description && <p className="text-xl text-gray-700">{description}</p>}
          </div>
        )}

        {compactView ? (
          <BusinessGoalsCompact goals={sortedGoals} columnCount={columnCount} ultraCompact={ultraCompact} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedGoals.map((goal) => (
              <div 
                key={goal.id} 
                className="border border-gray-200 rounded-lg p-6 bg-white hover:border-vending-blue transition-colors duration-300 card-hover"
              >
                <div className="mb-4">
                  {goal.icon ? (
                    <div className="bg-vending-blue-light bg-opacity-20 p-3 rounded-full w-12 h-12 flex items-center justify-center text-vending-blue">
                      <MachineTypeIcon type={goal.icon} />
                    </div>
                  ) : (
                    <div className="bg-vending-blue-light bg-opacity-20 p-3 rounded-full w-12 h-12 flex items-center justify-center text-vending-blue">
                      <ArrowRight className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-3">{goal.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{goal.description}</p>
                <Button 
                  variant="ghost" 
                  className="text-vending-blue hover:text-vending-blue-dark font-medium flex items-center p-0"
                  onClick={() => navigate(`/business-goals/${goal.slug}`)}
                >
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BusinessGoalsGrid;
