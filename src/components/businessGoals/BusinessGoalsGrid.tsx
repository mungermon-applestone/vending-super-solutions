
import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowRight } from 'lucide-react';
import { useContentfulBusinessGoals } from '@/hooks/cms/useContentfulBusinessGoals';

interface BusinessGoalsGridProps {
  className?: string;
  businessGoals?: any[];
  goals?: any[];
  isLoading?: boolean;
  error?: any;
  compactView?: boolean;
  columnCount?: number;
  ultraCompact?: boolean;
}

const BusinessGoalsGrid: React.FC<BusinessGoalsGridProps> = ({ 
  className, 
  businessGoals, 
  goals,
  isLoading: isLoadingProp, 
  error,
  compactView = false,
  columnCount = 3,
  ultraCompact = false
}) => {
  const { data: fetchedGoals, isLoading: isLoadingHook } = useContentfulBusinessGoals();
  
  // Determine what data to use
  const isLoading = isLoadingProp !== undefined ? isLoadingProp : isLoadingHook;
  const itemsToDisplay = businessGoals || goals || fetchedGoals || [];

  return (
    <section className={`py-16 bg-white ${className || ''}`}>
      <div className="container-wide">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columnCount} gap-6`}>
            {itemsToDisplay?.map((goal) => (
              <Link 
                key={goal.id} 
                to={`/business-goals/${goal.slug}`}
                className="bg-white border border-gray-200 rounded-lg px-6 py-7 hover:shadow-lg transition-shadow flex items-center justify-between h-20"
              >
                <h3 className="text-xl font-semibold text-vending-blue-dark pr-4">{goal.title}</h3>
                <ArrowRight className="h-5 w-5 flex-shrink-0 text-vending-blue" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BusinessGoalsGrid;
