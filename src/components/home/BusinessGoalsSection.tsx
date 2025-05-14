
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useContentfulBusinessGoals } from '@/hooks/cms/useContentfulBusinessGoals';
import { useHomePageContent } from '@/hooks/useHomePageContent';

// Separated error component to fix TypeScript props issues
const BusinessGoalsError = ({ showDetails = false, onRetry }: { showDetails?: boolean, onRetry: () => Promise<void> }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
    <h3 className="text-lg font-medium text-red-800 mb-2">Unable to load business goals</h3>
    <p className="text-red-600 mb-4">There was an error loading content from Contentful.</p>
    
    {showDetails && (
      <div className="bg-white p-4 rounded border border-red-100 mb-4 text-left">
        <p className="text-sm text-gray-700 mb-2">Possible reasons:</p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Contentful API is not accessible</li>
          <li>Contentful space ID or access token is invalid</li>
          <li>Content model is missing or has changed</li>
          <li>Network connectivity issues</li>
        </ul>
      </div>
    )}
    
    <div className="flex justify-center gap-4">
      <Button variant="outline" onClick={() => onRetry()} className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Retry
      </Button>
      <Button asChild variant="secondary">
        <Link to="/admin/contentful">Configure Contentful</Link>
      </Button>
    </div>
  </div>
);

const BusinessGoalsSection: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);
  const { data: homeContent } = useHomePageContent();
  const { 
    data: businessGoals = [], 
    isLoading, 
    isError, 
    refetch 
  } = useContentfulBusinessGoals({ showOnHomepage: true });

  // Filter to show only visible goals (if any)
  const visibleGoals = businessGoals.filter(goal => goal.visible !== false).slice(0, 3);

  const handleRetry = async () => {
    setShowDetails(true);
    await refetch();
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container">
        {isError ? (
          <BusinessGoalsError showDetails={showDetails} onRetry={handleRetry} />
        ) : (
          <>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-4">
                {homeContent?.businessGoalsTitle || "Business Goals We Help You Achieve"}
              </h2>
              <p className="subtitle max-w-3xl mx-auto">
                {homeContent?.businessGoalsDescription || "Our vending solutions help you meet these common business goals. Select one to learn more about how we can help."}
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-lg p-6 shadow-md animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-4/6 mb-6"></div>
                    <div className="h-10 bg-slate-200 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : visibleGoals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {visibleGoals.map(goal => (
                  <div key={goal.id} className="bg-white rounded-lg p-6 shadow-md transition hover:shadow-lg">
                    <h3 className="text-xl font-semibold mb-3">{goal.title}</h3>
                    <p className="text-gray-600 mb-5">
                      {goal.description ? 
                        (goal.description.length > 120 ? 
                          goal.description.substring(0, 120) + '...' : 
                          goal.description) : 
                        'Learn how our solution can help you achieve this business goal.'}
                    </p>
                    <Button asChild variant="link" className="pl-0 font-medium text-vending-blue flex items-center gap-1">
                      <Link to={`/business-goals/${goal.slug}`}>
                        Learn more <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No business goals available. Please add some in Contentful.</p>
                <Button asChild variant="outline" className="mt-4">
                  <Link to="/business-goals">View All Business Goals</Link>
                </Button>
              </div>
            )}

            <div className="text-center mt-10">
              <Button asChild variant="outline">
                <Link to="/business-goals">View All Business Goals</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default BusinessGoalsSection;
