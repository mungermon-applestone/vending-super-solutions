import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MachineTypeIcon from '@/components/common/MachineTypeIcon';

interface BusinessGoalItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  benefits: string[];
  image: string;
  imageAlt: string;
}

interface BusinessGoalsCompactProps {
  businessGoals: BusinessGoalItem[];
}

const BusinessGoalsCompact: React.FC<BusinessGoalsCompactProps> = ({ businessGoals }) => {
  if (!businessGoals || businessGoals.length === 0) {
    return <p>No business goals available.</p>;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Explore Our Business Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessGoals.map((goal) => (
            <div key={goal.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img className="w-full h-48 object-cover" src={goal.image} alt={goal.imageAlt} />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{goal.title}</h3>
                <p className="text-gray-600 text-sm">{goal.description}</p>
                <Link to={`/business-goals/${goal.slug}`} className="text-blue-500 hover:underline mt-3 block">
                  Learn More <ArrowRight className="inline-block ml-1 align-text-top" size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalsCompact;
