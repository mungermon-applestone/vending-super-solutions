
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MachineTypeIcon from '@/components/common/MachineTypeIcon';
import { CMSBusinessGoal, CMSImage } from '@/types/cms';
import TranslatableText from '@/components/translation/TranslatableText';

interface BusinessGoalItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon?: string;
  benefits?: string[];
  image?: string | CMSImage;  // Updated to accept both string and CMSImage
  imageAlt?: string;
}

interface BusinessGoalsCompactProps {
  businessGoals?: BusinessGoalItem[];
  goals?: BusinessGoalItem[] | CMSBusinessGoal[];
  columnCount?: number;
}

const BusinessGoalsCompact: React.FC<BusinessGoalsCompactProps> = ({ 
  businessGoals, 
  goals,
  columnCount = 3
}) => {
  // Use either businessGoals or goals prop
  const itemsToDisplay = businessGoals || goals || [];
  
  if (itemsToDisplay.length === 0) {
    return (
      <p>
        <TranslatableText context="business-goals">No business goals available.</TranslatableText>
      </p>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          <TranslatableText context="business-goals">Explore Our Business Goals</TranslatableText>
        </h2>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columnCount} gap-6`}>
          {itemsToDisplay.map((goal) => {
            // Get the image URL correctly whether it's a string or CMSImage
            const imageUrl = typeof goal.image === 'string' 
              ? goal.image 
              : goal.image?.url || '';
              
            return (
              <div key={goal.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {goal.image && (
                  <img 
                    className="w-full h-48 object-cover" 
                    src={imageUrl} 
                    alt={goal.imageAlt || goal.title} 
                  />
                )}
                <div className="p-4">
                  {goal.icon && <MachineTypeIcon icon={goal.icon} className="mb-2 text-blue-500" />}
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    <TranslatableText context="business-goals">{goal.title}</TranslatableText>
                  </h3>
                  <p className="text-gray-600 text-sm">
                    <TranslatableText context="business-goals">{goal.description}</TranslatableText>
                  </p>
                  <Link to={`/business-goals/${goal.slug}`} className="text-blue-500 hover:underline mt-3 block">
                    <TranslatableText context="business-goals">Learn More</TranslatableText> <ArrowRight className="inline-block ml-1 align-text-top" size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalsCompact;
