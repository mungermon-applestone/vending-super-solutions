import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp,
  ShoppingBag,
  Activity,
  BarChart,
  Truck,
  Users,
  Star
} from 'lucide-react';
import { useContentfulBusinessGoals } from '@/hooks/cms/useContentfulBusinessGoals';
import { normalizeSlug } from '@/services/cms/utils/slugMatching';
import MachineTypeIcon from '@/components/admin/machines/MachineTypeIcon';

const fallbackBusinessGoals = [
  {
    icon: <TrendingUp className="h-10 w-10 text-vending-blue" />,
    title: "Expand Footprint",
    description: "Grow your business with scalable vending solutions that adapt to various locations and needs.",
    link: "/goals/expand-footprint"
  },
  {
    icon: <ShoppingBag className="h-10 w-10 text-vending-blue" />,
    title: "Buy Online, Pickup In Store (BOPIS)",
    description: "Enable customers to order ahead and collect purchases from your vending machines.",
    link: "/goals/bopis"
  },
  {
    icon: <Activity className="h-10 w-10 text-vending-blue" />,
    title: "Marketing & Promotions",
    description: "Drive sales with targeted promotions, digital advertising, and customer loyalty programs.",
    link: "/goals/marketing"
  },
  {
    icon: <BarChart className="h-10 w-10 text-vending-blue" />,
    title: "Data & Analytics",
    description: "Leverage powerful insights to optimize your inventory, pricing, and machine placement.",
    link: "/goals/data"
  },
  {
    icon: <Truck className="h-10 w-10 text-vending-blue" />,
    title: "Fleet Management",
    description: "Efficiently manage your entire network of machines with centralized controls and monitoring.",
    link: "/goals/fleet-management"
  },
  {
    icon: <Users className="h-10 w-10 text-vending-blue" />,
    title: "Customer Satisfaction",
    description: "Enhance user experience with intuitive interfaces, reliable service, and modern payment options.",
    link: "/goals/customer-satisfaction"
  }
];

const getIconComponent = (iconName: string | undefined) => {
  if (!iconName) return <Star className="h-10 w-10 text-vending-blue" />;
  
  if (['trending-up', 'shopping-bag', 'activity', 'bar-chart', 'truck', 'users'].includes(iconName.toLowerCase())) {
    switch (iconName.toLowerCase()) {
      case 'trending-up': 
        return <TrendingUp className="h-10 w-10 text-vending-blue" />;
      case 'shopping-bag': 
        return <ShoppingBag className="h-10 w-10 text-vending-blue" />;
      case 'activity': 
        return <Activity className="h-10 w-10 text-vending-blue" />;
      case 'bar-chart': 
        return <BarChart className="h-10 w-10 text-vending-blue" />;
      case 'truck': 
        return <Truck className="h-10 w-10 text-vending-blue" />;
      case 'users': 
        return <Users className="h-10 w-10 text-vending-blue" />;
      default:
        return <Star className="h-10 w-10 text-vending-blue" />;
    }
  }
  
  return (
    <div className="text-vending-blue">
      <MachineTypeIcon type={iconName} className="h-10 w-10" />
    </div>
  );
};

const BusinessGoalsSection = () => {
  const { data: contentfulGoals = [], isLoading, error } = useContentfulBusinessGoals();
  
  console.log('[BusinessGoalsSection] Loading Contentful business goals:', { 
    isLoading, 
    hasError: !!error,
    goalsCount: contentfulGoals.length,
    contentfulGoals
  });
  
  const mappedContentfulGoals = contentfulGoals.map(goal => ({
    icon: goal.icon ? getIconComponent(goal.icon) : <Star className="h-10 w-10 text-vending-blue" />,
    title: goal.title,
    description: goal.description,
    link: `/goals/${normalizeSlug(goal.slug)}`
  }));
  
  const displayGoals = mappedContentfulGoals.length > 0 ? mappedContentfulGoals : fallbackBusinessGoals;
  
  const visibleGoals = displayGoals.slice(0, 6);
  
  return (
    <section className="py-16 md:py-24">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-4">
              Meet Your Business Goals
            </h2>
            <p className="subtitle max-w-2xl">
              Whatever your business objectives, our vending software provides the tools and features to help you succeed.
            </p>
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <Link to="/goals">Explore All Business Goals</Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border rounded-md p-6">
                <Skeleton className="h-10 w-10 mb-4 rounded-full" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleGoals.map((goal, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg p-6 bg-white hover:border-vending-blue transition-colors duration-300 card-hover"
              >
                <div className="mb-4">
                  {goal.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{goal.title}</h3>
                <p className="text-gray-600 mb-4">{goal.description}</p>
                <Link 
                  to={goal.link} 
                  className="text-vending-blue hover:text-vending-blue-dark font-medium inline-flex items-center"
                >
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BusinessGoalsSection;
