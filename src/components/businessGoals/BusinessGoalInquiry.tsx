
import React from 'react';
import { SimpleContactCTA } from '@/components/common';

interface BusinessGoalInquiryProps {
  title?: string;
  description?: string;
}

const BusinessGoalInquiry: React.FC<BusinessGoalInquiryProps> = ({
  title,
  description,
}) => {
  return (
    <SimpleContactCTA
      title={title || "Ready to Get Started?"}
      description={description || "Fill out the form and we'll start you on your vending journey."}
    />
  );
};

export default BusinessGoalInquiry;
