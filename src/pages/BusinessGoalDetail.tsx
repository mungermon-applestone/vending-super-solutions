
import React from 'react';
import { CMSBusinessGoal } from '@/types/cms';
import { Link } from 'react-router-dom';
import BusinessGoalHero from '@/components/businessGoals/BusinessGoalHero';
import BusinessGoalKeyBenefits from '@/components/businessGoals/BusinessGoalKeyBenefits';
import BusinessGoalVideoSection from '@/components/businessGoals/BusinessGoalVideoSection';
import BusinessGoalInquiry from '@/components/businessGoals/BusinessGoalInquiry';
import { ArrowLeft } from 'lucide-react';
import { getAssetUrl, getAssetAlt } from '@/utils/contentful/dataExtractors';

interface BusinessGoalDetailProps {
  businessGoal: CMSBusinessGoal;
}

const BusinessGoalDetail: React.FC<BusinessGoalDetailProps> = ({ businessGoal }) => {
  if (!businessGoal) {
    return <div>No business goal data available</div>;
  }

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
  const videoData = businessGoal.video ? {
    url: businessGoal.video.url,
    title: businessGoal.video.title || businessGoal.title,
    id: businessGoal.video.id
  } : null;

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
          description="How this business goal can transform your operations"
        />
      )}

      {/* Video Section - only show if there's a video URL */}
      {businessGoal.video && businessGoal.video.url && (
        <BusinessGoalVideoSection
          video={videoData}
          title="See it in action"
          description="Watch how our solution helps you achieve this goal"
        />
      )}
      
      {/* Recommended Machines Section */}
      {businessGoal.recommendedMachines && businessGoal.recommendedMachines.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Recommended Machines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {businessGoal.recommendedMachines.map((machine) => (
                <Link 
                  key={machine.id} 
                  to={`/machines/${machine.slug}`}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  {machine.image && (
                    <img 
                      src={machine.image.url} 
                      alt={machine.image.alt || machine.title} 
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{machine.title}</h3>
                    <p className="text-gray-600">{machine.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
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
