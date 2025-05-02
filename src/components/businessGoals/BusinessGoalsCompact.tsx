
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MachineTypeIcon from '@/components/admin/machines/MachineTypeIcon';
import { CMSBusinessGoal } from '@/types/cms';

interface BusinessGoalsCompactProps {
  goals: CMSBusinessGoal[];
  columnCount?: 1 | 2 | 3 | 4;
  ultraCompact?: boolean;
}

const BusinessGoalsCompact: React.FC<BusinessGoalsCompactProps> = ({ 
  goals,
  columnCount = 3,
  ultraCompact = false
}) => {
  const navigate = useNavigate();
  
  // Calculate grid column classes based on columnCount parameter
  const gridColumnClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }[columnCount];
  
  return (
    <div className={`grid ${gridColumnClass} gap-6`}>
      {goals.map((goal) => (
        <div 
          key={goal.id}
          onClick={() => navigate(`/business-goals/${goal.slug}`)}
          className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center">
            <div className="flex-grow flex items-center">
              {goal.icon ? (
                <div className="bg-vending-blue-light bg-opacity-20 p-3 rounded-full w-12 h-12 flex items-center justify-center text-vending-blue mr-4">
                  <MachineTypeIcon type={goal.icon} />
                </div>
              ) : null}
              <h3 className="text-xl md:text-2xl font-semibold text-vending-blue-dark">
                {goal.title}
              </h3>
            </div>
            <ArrowRight className="h-5 w-5 text-vending-blue ml-2 flex-shrink-0" />
          </div>
          {!ultraCompact && goal.description && (
            <p className="text-sm text-gray-600 mt-3 line-clamp-2">{goal.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default BusinessGoalsCompact;
