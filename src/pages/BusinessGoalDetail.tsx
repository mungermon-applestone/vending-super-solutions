import React from 'react';
import { CMSBusinessGoal } from '@/types/cms';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import BusinessGoalHero from '@/components/businessGoals/BusinessGoalHero';
import BusinessGoalKeyBenefits from '@/components/businessGoals/BusinessGoalKeyBenefits';
import BusinessGoalFeatures from '@/components/businessGoals/BusinessGoalFeatures';
import BusinessGoalVideoSection from '@/components/businessGoals/BusinessGoalVideoSection';
import BusinessGoalInquiry from '@/components/businessGoals/BusinessGoalInquiry';
import { ArrowLeft } from 'lucide-react';
import { getAssetUrl, getAssetAlt } from '@/utils/contentful/dataExtractors';
import RecommendedMachines from '@/components/products/sections/RecommendedMachines';
import { useTranslatedBusinessGoal } from '@/hooks/useTranslatedBusinessGoal';
import TranslatableText from '@/components/translation/TranslatableText';

interface BusinessGoalDetailProps {
  businessGoal: CMSBusinessGoal;
}

const BusinessGoalDetail: React.FC<BusinessGoalDetailProps> = ({ businessGoal }) => {
  const { translatedContent: translatedBusinessGoal, isLoading: isTranslating } = useTranslatedBusinessGoal(businessGoal);
  
  if (!businessGoal) {
    return <div>No business goal data available</div>;
  }

  // Use translated content if available, fallback to original
  const displayBusinessGoal = translatedBusinessGoal || businessGoal;

  console.log('[BusinessGoalDetail] Rendering business goal:', displayBusinessGoal);
  console.log('[BusinessGoalDetail] Benefits data:', displayBusinessGoal.benefits);
  console.log('[BusinessGoalDetail] Features data:', displayBusinessGoal.features);

  // Extract image URL and alt text
  const imageUrl = displayBusinessGoal.image?.url || displayBusinessGoal.image_url || '';
  const imageAlt = displayBusinessGoal.image?.alt || displayBusinessGoal.image_alt || displayBusinessGoal.title;

  // Default icon if none provided
  const iconComponent = displayBusinessGoal.icon ? (
    <div 
      className="text-white" 
      dangerouslySetInnerHTML={{ 
        __html: DOMPurify.sanitize(displayBusinessGoal.icon, {
          ALLOWED_TAGS: ['svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse', 'g', 'defs', 'clipPath', 'use'],
          ALLOWED_ATTR: ['viewBox', 'd', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'width', 'height', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'points', 'transform', 'class', 'id', 'clip-path', 'href'],
          ALLOW_DATA_ATTR: false
        })
      }} 
    />
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );

  // Process video data
  const videoData = displayBusinessGoal.video;
  
  // Enhanced logging for debugging image issues
  if (displayBusinessGoal.recommendedMachines && displayBusinessGoal.recommendedMachines.length > 0) {
    console.log('[BusinessGoalDetail] Recommended machines with image data:', 
      displayBusinessGoal.recommendedMachines.map(machine => ({
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
  console.log('[BusinessGoalDetail] Recommended machines:', displayBusinessGoal.recommendedMachines);

  return (
    <div>
      {/* Back navigation */}
      <div className="container mx-auto px-4 py-6">
        <Link to="/business-goals" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <TranslatableText context="business-goal-detail">Back to Business Goals</TranslatableText>
        </Link>
      </div>

      {/* Hero Section */}
      <BusinessGoalHero 
        title={displayBusinessGoal.title}
        description={displayBusinessGoal.description}
        heroDescription2={displayBusinessGoal.heroDescription2}
        icon={iconComponent}
        image={imageUrl}
      />
      
      {/* Benefits Section */}
      {displayBusinessGoal.benefits && displayBusinessGoal.benefits.length > 0 && (
        <BusinessGoalKeyBenefits 
          benefits={displayBusinessGoal.benefits}
          title="Key Benefits"
        />
      )}

      {/* Features Section */}
      {displayBusinessGoal.features && displayBusinessGoal.features.length > 0 && (
        <BusinessGoalFeatures 
          features={displayBusinessGoal.features}
          sectionTitle="Key Features"
          sectionDescription="Our platform provides specialized features to help you achieve this business goal effectively."
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
      {displayBusinessGoal.recommendedMachines && displayBusinessGoal.recommendedMachines.length > 0 && (
        <RecommendedMachines machines={displayBusinessGoal.recommendedMachines} />
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