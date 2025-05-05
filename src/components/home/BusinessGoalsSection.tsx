
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useHomePageContent } from '@/hooks/useHomePageContent';
import BusinessGoalsCompact from '../businessGoals/BusinessGoalsCompact';
import ContentfulConfigWarning from '../machines/ContentfulConfigWarning';
import { isContentfulConfigured } from '@/config/cms';
import { validateContentfulClient, refreshContentfulClient } from '@/services/cms/utils/contentfulClient';

const BusinessGoalsSection = () => {
  const { data: homeContent, error, refetch } = useHomePageContent();
  const isConfigured = isContentfulConfigured();
  
  // Using consistent URL format for all business goals with canonical slugs
  const businessGoals = [
    {
      icon: "vending",
      title: "Expand Footprint",
      description: "Grow your business with scalable vending solutions that adapt to various locations and needs.",
      id: "expand-footprint",
      slug: "expand-footprint"
    },
    {
      icon: "vending",
      title: "Buy Online, Pickup In Store (BOPIS)",
      description: "Enable customers to order ahead and collect purchases from your vending machines.",
      id: "bopis",
      slug: "bopis"
    },
    {
      icon: "vending",
      title: "Marketing & Promotions",
      description: "Drive sales with targeted promotions, digital advertising, and customer loyalty programs.",
      id: "marketing-and-promotions", 
      slug: "marketing-and-promotions"
    },
    {
      icon: "vending",
      title: "Data & Analytics",
      description: "Leverage powerful insights to optimize your inventory, pricing, and machine placement.",
      id: "data-analytics",
      slug: "data-analytics"
    },
    {
      icon: "vending",
      title: "Fleet Management",
      description: "Efficiently manage your entire network of machines with centralized controls and monitoring.",
      id: "fleet-management",
      slug: "fleet-management"
    },
    {
      icon: "vending",
      title: "Customer Satisfaction",
      description: "Enhance user experience with intuitive interfaces, reliable service, and modern payment options.",
      id: "customer-satisfaction",
      slug: "customer-satisfaction"
    }
  ];
  
  // Handler for retrying connection and refetching data
  const handleRetry = useCallback(async () => {
    console.log('[BusinessGoalsSection] Retrying content fetch');
    
    // Validate client first, refresh if needed
    const isValid = await validateContentfulClient();
    if (!isValid) {
      await refreshContentfulClient();
    }
    
    refetch();
  }, [refetch]);
  
  // Show the warning if there's an error but continue showing the fallback data
  const showWarning = error || !isConfigured;
  
  return (
    <section className="py-16 md:py-24">
      <div className="container-wide">
        {showWarning && (
          <ContentfulConfigWarning 
            showDetails={false} 
            onRetry={handleRetry}
          />
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-4">
              {homeContent?.businessGoalsTitle || "Business Goals We Help You Achieve"}
            </h2>
            <p className="subtitle max-w-2xl">
              {homeContent?.businessGoalsDescription || "Tailored solutions to meet your specific business objectives."}
            </p>
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <Link to="/business-goals">Explore All Business Goals</Link>
          </Button>
        </div>
        
        <BusinessGoalsCompact goals={businessGoals} columnCount={3} />
      </div>
    </section>
  );
};

export default BusinessGoalsSection;
