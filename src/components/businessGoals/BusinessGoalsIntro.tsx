
import React from 'react';
import { isContentfulConfigured, isPreviewEnvironment } from '@/config/cms';
import ContentfulConfigWarning from '@/components/machines/ContentfulConfigWarning';
import PreviewEnvironmentDetector from '@/components/contentful/PreviewEnvironmentDetector';
import TechnologyPageHero from '@/components/technology/TechnologyPageHero';

interface BusinessGoalsIntroProps {
  heroContentId: string;
  isConfigured: boolean;
  isPreview: boolean;
}

const BusinessGoalsIntro = ({ heroContentId, isConfigured, isPreview }: BusinessGoalsIntroProps) => {
  return (
    <>
      {/* Show preview environment warning when applicable */}
      <PreviewEnvironmentDetector />
      
      {!isConfigured && !isPreview && (
        <div className="container py-6">
          <ContentfulConfigWarning />
        </div>
      )}
      
      <TechnologyPageHero entryId={heroContentId} />
    </>
  );
};

export default BusinessGoalsIntro;
