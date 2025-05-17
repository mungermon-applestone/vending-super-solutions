
import React from 'react';
import { useParams } from 'react-router-dom';
import { useBusinessGoal } from '@/hooks/cms/useBusinessGoal';
import { PageHero, ContentfulFallbackMessage } from '@/components/common';
import { Loader2, RefreshCcw } from 'lucide-react';
import { TrendingUp, PieChart, Map } from '@/components/ui/icons';
import BusinessGoalHero from '@/components/businessGoals/BusinessGoalHero';
import BusinessGoalFeatures from '@/components/businessGoals/BusinessGoalFeatures';
import BusinessGoalInquiry from '@/components/businessGoals/BusinessGoalInquiry';
import MachineTypeIcon from '@/components/common/MachineTypeIcon';
import BusinessGoalIntegrations from '@/components/businessGoals/BusinessGoalIntegrations';

const BusinessGoalDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: businessGoal, isLoading, error, refetch } = useBusinessGoal(slug || '');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !businessGoal) {
    return (
      <ContentfulFallbackMessage 
        title="Failed to Load Business Goal"
        message="There was an error loading the business goal from the content management system."
        onRetry={refetch}
      />
    );
  }

  const features = [
    {
      title: "Real-Time Data Tracking",
      description: "Monitor your vending operations with up-to-the-minute data on sales, inventory, and machine performance.",
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      title: "Automated Inventory Management",
      description: "Reduce stockouts and optimize product selection with our intelligent inventory management system.",
      icon: <RefreshCcw className="h-6 w-6" />
    },
    {
      title: "Comprehensive Analytics",
      description: "Gain insights into customer behavior and sales trends with detailed analytics and reporting tools.",
      icon: <PieChart className="h-6 w-6" />
    }
  ];

  const integrations = [
    {
      name: "Google Analytics",
      description: "Track website traffic and user behavior to optimize your online presence.",
      icon: <MachineTypeIcon type="google" className="h-6 w-6" />,
      link: "https://analytics.google.com/"
    },
    {
      name: "Salesforce",
      description: "Manage customer relationships and sales processes with the leading CRM platform.",
      icon: <MachineTypeIcon type="salesforce" className="h-6 w-6" />,
      link: "https://www.salesforce.com/"
    },
    {
      name: "QuickBooks",
      description: "Streamline your accounting and financial management with QuickBooks integration.",
      icon: <MachineTypeIcon type="quickbooks" className="h-6 w-6" />,
      link: "https://quickbooks.intuit.com/"
    },
    {
      name: "Microsoft Teams",
      description: "Improve team collaboration and communication with Microsoft Teams integration.",
      icon: <MachineTypeIcon type="teams" className="h-6 w-6" />,
      link: "https://www.microsoft.com/en-us/microsoft-teams/group-chat-software"
    }
  ];

  // Process image to handle both string and object formats
  const imageUrl = typeof businessGoal.image === 'string' 
    ? businessGoal.image 
    : businessGoal.image?.url || '';

  return (
    <>
      <BusinessGoalHero 
        title={businessGoal.title}
        description={businessGoal.description}
        icon={<MachineTypeIcon type={businessGoal.icon} className="h-6 w-6" />}
        image={imageUrl}
      />
      
      <BusinessGoalFeatures features={features} />
      
      <BusinessGoalIntegrations integrations={integrations} />

      <BusinessGoalInquiry />
    </>
  );
};

export default BusinessGoalDetailPage;
