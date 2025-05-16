import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useContentfulBusinessGoals } from '@/hooks/cms/useContentfulBusinessGoals';
import MachineTypeIcon from '@/components/common/MachineTypeIcon';

interface BusinessGoalsGridProps {
  className?: string;
}

const BusinessGoalsGrid: React.FC<BusinessGoalsGridProps> = ({ className }) => {
  const { data: businessGoals, isLoading } = useContentfulBusinessGoals();

  return (
    <section className={`py-16 bg-white ${className || ''}`}>
      <div className="container-wide">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessGoals?.map((goal) => (
              <Link 
                key={goal.id} 
                to={`/business-goals/${goal.slug}`}
                className="bg-vending-gray rounded-lg p-6 hover:shadow-lg transition-shadow flex flex-col h-full"
              >
                <div className="flex items-center mb-4">
                  <MachineTypeIcon icon={goal.icon} className="mr-4" />
                  <h3 className="text-xl font-semibold text-vending-blue-dark">{goal.title}</h3>
                </div>
                <p className="text-gray-600 flex-grow">{goal.description}</p>
                <div className="mt-4">
                  <span className="text-vending-blue hover:underline flex items-center">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BusinessGoalsGrid;

import { ArrowRight } from 'lucide-react';
