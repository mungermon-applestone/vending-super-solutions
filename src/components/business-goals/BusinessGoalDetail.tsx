
import React from 'react';
import { useContentfulBusinessGoalBySlug } from '@/hooks/cms/useContentfulBusinessGoals';
import { Loader } from '@/components/ui/loader';
import { Alert } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface BusinessGoalDetailProps {
  slug: string;
}

const BusinessGoalDetail = ({ slug }: BusinessGoalDetailProps) => {
  const { data: businessGoal, isLoading, isError } = useContentfulBusinessGoalBySlug(slug);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader size="large" />
      </div>
    );
  }
  
  if (isError || !businessGoal) {
    return (
      <Alert variant="destructive">
        <Info className="h-4 w-4" />
        <div>
          <h4 className="font-medium">Error</h4>
          <p className="text-sm">
            Failed to load business goal data. Please try again later.
          </p>
        </div>
      </Alert>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{businessGoal.title}</h1>
      
      {businessGoal.imageUrl && (
        <div className="mb-6">
          <img 
            src={businessGoal.imageUrl} 
            alt={businessGoal.title} 
            className="w-full rounded-lg shadow-md max-h-96 object-cover"
          />
        </div>
      )}
      
      <div className="prose max-w-none mt-6">
        <p className="text-lg">{businessGoal.description}</p>
        
        {businessGoal.benefits && businessGoal.benefits.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Key Benefits</h2>
            <ul className="list-disc list-inside space-y-2">
              {businessGoal.benefits.map((benefit, index) => (
                <li key={index} className="text-gray-700">{benefit}</li>
              ))}
            </ul>
          </div>
        )}
        
        {businessGoal.features && businessGoal.features.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {businessGoal.features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessGoalDetail;
