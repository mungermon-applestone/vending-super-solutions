
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CMSBusinessGoal } from '@/types/cms';
import MachineTypeIcon from '@/components/admin/machines/MachineTypeIcon';

interface BusinessGoalsCompactProps {
  goals: CMSBusinessGoal[];
  columnCount?: 1 | 2 | 3;
}

const BusinessGoalsCompact: React.FC<BusinessGoalsCompactProps> = ({ 
  goals,
  columnCount = 2
}) => {
  if (!goals?.length) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No business goals available.</p>
      </div>
    );
  }
  
  // Get column class based on requested column count
  const getColumnClass = () => {
    switch(columnCount) {
      case 1: return 'grid-cols-1';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 2:
      default: return 'grid-cols-1 md:grid-cols-2';
    }
  };

  return (
    <div className={`grid ${getColumnClass()} gap-6`}>
      {goals.map((goal) => (
        <div 
          key={goal.id}
          className="border border-gray-200 rounded-lg p-4 hover:border-vending-blue hover:shadow-sm transition-all duration-200"
        >
          <Link to={`/business-goals/${goal.slug}`} className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="bg-vending-blue-light bg-opacity-20 p-3 rounded-full h-12 w-12 flex items-center justify-center text-vending-blue">
                {goal.icon ? (
                  <MachineTypeIcon type={goal.icon} />
                ) : (
                  <ArrowRight className="h-6 w-6" />
                )}
              </div>
            </div>
            
            <div className="flex-grow">
              <h3 className="text-lg font-medium text-vending-blue-dark mb-1">{goal.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{goal.description}</p>
            </div>
            
            <div className="flex-shrink-0 text-vending-blue">
              <ArrowRight className="h-5 w-5" />
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BusinessGoalsCompact;
