
import React from 'react';
import { CMSBusinessGoal } from '@/types/cms';
import { Link } from 'react-router-dom';
import BusinessGoalHero from '@/components/businessGoals/BusinessGoalHero';
import BusinessGoalKeyBenefits from '@/components/businessGoals/BusinessGoalKeyBenefits';
import BusinessGoalVideoSection from '@/components/businessGoals/BusinessGoalVideoSection';
import BusinessGoalInquiry from '@/components/businessGoals/BusinessGoalInquiry';
import { ArrowLeft } from 'lucide-react';
import { getAssetUrl, getAssetAlt } from '@/utils/contentful/dataExtractors';
import RecommendedMachines from '@/components/products/sections/RecommendedMachines';

interface BusinessGoalDetailProps {
  businessGoal: CMSBusinessGoal;
}

const BusinessGoalDetail: React.FC<BusinessGoalDetailProps> = ({ businessGoal }) => {
  if (!businessGoal) {
    return <div>No business goal data available</div>;
  }

  console.log('[BusinessGoalDetail] Rendering business goal:', businessGoal);
  console.log('[BusinessGoalDetail] Benefits data:', businessGoal.benefits);

  // Extract image URL and alt text
  const imageUrl = businessGoal.image?.url || businessGoal.image_url || '';
  const imageAlt = businessGoal.image?.alt || businessGoal.image_alt || businessGoal.title;

  // Default icon if none provided
  const iconComponent = businessGoal.icon ? (
    <div 
      className="text-white" 
      dangerouslySetInnerHTML={{ __html: businessGoal.icon }} 
    />
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );

  // Process video data
  const videoData = businessGoal.video;
  
  // Enhanced logging for debugging image issues
  if (businessGoal.recommendedMachines && businessGoal.recommendedMachines.length > 0) {
    console.log('[BusinessGoalDetail] Recommended machines with image data:', 
      businessGoal.recommendedMachines.map(machine => ({
        title: machine.title,
        hasImage: !!machine.image,
        imageUrl: machine.image?.url,
        hasThumbnail: !!machine.thumbnail,
        thumbnailUrl: machine.thumbnail?.url,
        hasMachineThumbnail: !!machine.machineThumbnail,
        machineThumbnailUrl: machine.machineThumbnail?.url
      }))
    );
  }
  
  // Log details about video and machines for debugging
  console.log('[BusinessGoalDetail] Video data:', videoData);
  console.log('[BusinessGoalDetail] Recommended machines:', businessGoal.recommendedMachines);

  return (
    <div>
      {/* Back navigation */}
      <div className="container mx-auto px-4 py-6">
        <Link to="/business-goals" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Business Goals
        </Link>
      </div>

      {/* Hero Section */}
      <BusinessGoalHero 
        title={businessGoal.title}
        description={businessGoal.description}
        icon={iconComponent}
        image={imageUrl}
      />
      
      {/* Benefits Section */}
      {businessGoal.benefits && businessGoal.benefits.length > 0 && (
        <BusinessGoalKeyBenefits 
          benefits={businessGoal.benefits}
          title="Key Benefits"
        />
      )}

      {/* Video Section - only show if there's a video URL */}
      {videoData && videoData.url && (
        <BusinessGoalVideoSection
          video={videoData}
          title="See it in action"
          description="Watch how our solution helps you achieve this goal"
        />
      )}
      
      {/* Recommended Machines Section */}
      {businessGoal.recommendedMachines && businessGoal.recommendedMachines.length > 0 && (
        <RecommendedMachines machines={businessGoal.recommendedMachines} />
      )}

      {/* Call to Action */}
      <BusinessGoalInquiry 
        title="Ready to achieve this business goal?"
        description="Contact us to learn how our vending solutions can help your business."
      />
    </div>
  );
};

export default BusinessGoalDetail;
