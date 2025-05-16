
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MachineTypeIcon from '@/components/admin/machines/MachineTypeIcon';
import { CMSBusinessGoal } from '@/types/cms';
import { resolveSlug } from '@/services/cms/utils/slugMatching';

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
  
  // Function to safely get a goal's slug, handling potential missing data
  const getGoalSlug = (goal: CMSBusinessGoal): string => {
    // If slug is missing or empty, create a safe fallback from the title
    if (!goal.slug || goal.slug.trim() === '') {
      console.warn(`[BusinessGoalsCompact] Missing slug for goal: ${goal.title}. Using title as fallback.`);
      return goal.title 
        ? goal.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') 
        : 'unknown-goal';
    }
    return goal.slug;
  };
  
  // Function to handle goal navigation with proper slug resolution
  const handleGoalClick = (goal: CMSBusinessGoal) => {
    try {
      // Make sure the goal has a slug we can use
      const goalSlug = getGoalSlug(goal);
      
      // Make sure we're using the resolved canonical slug
      const canonicalSlug = resolveSlug(goalSlug);
      console.log(`[BusinessGoalsCompact] Navigating to goal: ${goal.title} with slug: ${canonicalSlug}`);
      
      navigate(`/business-goals/${canonicalSlug}`);
    } catch (error) {
      console.error('[BusinessGoalsCompact] Error navigating to goal:', error);
      // Fallback to home page or business goals page
      navigate('/business-goals');
    }
  };
  
  // Filter out any invalid goals (missing required data)
  const validGoals = goals.filter(goal => goal && goal.title);
  
  if (!validGoals || validGoals.length === 0) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg text-center">
        <p className="text-gray-600">No business goals available at this time.</p>
      </div>
    );
  }
  
  return (
    <div className={`grid ${gridColumnClass} gap-6`}>
      {validGoals.map((goal) => (
        <div 
          key={goal.id || `goal-${Math.random().toString(36).substring(7)}`}
          onClick={() => handleGoalClick(goal)}
          className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-grow">
              {goal.icon ? (
                <div className="bg-vending-blue-light bg-opacity-20 p-3 rounded-full w-12 h-12 flex items-center justify-center text-vending-blue mr-4 flex-shrink-0">
                  <MachineTypeIcon type={goal.icon} />
                </div>
              ) : null}
              <h3 className="text-xl md:text-2xl font-semibold text-vending-blue-dark my-auto">
                {goal.title}
              </h3>
            </div>
            <ArrowRight className="h-5 w-5 text-vending-blue ml-4 flex-shrink-0" />
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
