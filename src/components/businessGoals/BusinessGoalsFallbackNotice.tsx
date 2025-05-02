
import React from 'react';

interface BusinessGoalsFallbackNoticeProps {
  isPreview: boolean;
  isConfigured: boolean;
}

const BusinessGoalsFallbackNotice = ({ isPreview, isConfigured }: BusinessGoalsFallbackNoticeProps) => {
  if (!(isPreview && !isConfigured)) {
    return null;
  }
  
  return (
    <div className="container py-2">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-md text-sm">
        Using fallback business goals data. Configure Contentful to see real content.
      </div>
    </div>
  );
};

export default BusinessGoalsFallbackNotice;
