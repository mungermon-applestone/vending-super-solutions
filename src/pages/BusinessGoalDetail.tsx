
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import BusinessGoalHero from '@/components/businessGoals/BusinessGoalHero';
import BusinessGoalFeatures from '@/components/businessGoals/BusinessGoalFeatures';
import BusinessGoalCaseStudies from '@/components/businessGoals/BusinessGoalCaseStudies';
import BusinessGoalIntegrations from '@/components/businessGoals/BusinessGoalIntegrations';
import CTASection from '@/components/common/CTASection';
import { businessGoalsData } from '@/data/businessGoalsData';

const BusinessGoalDetail = () => {
  const { goalSlug } = useParams<{ goalSlug: string }>();
  
  // Find the goal data based on the URL slug
  const goalData = businessGoalsData.find(goal => goal.slug === goalSlug);
  
  // If no goal data is found, provide a default
  const currentGoal = goalData || businessGoalsData[0];
  
  return (
    <Layout>
      <BusinessGoalHero 
        title={currentGoal.title}
        description={currentGoal.heroDescription}
        icon={currentGoal.icon}
        image={currentGoal.heroImage}
      />
      
      <BusinessGoalFeatures features={currentGoal.features} />
      
      <BusinessGoalCaseStudies caseStudies={currentGoal.caseStudies} />
      
      <BusinessGoalIntegrations integrations={currentGoal.integrations} />
      
      <CTASection />
    </Layout>
  );
};

export default BusinessGoalDetail;
