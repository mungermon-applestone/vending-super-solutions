
import React from 'react';
import { toast } from 'sonner';
import { isContentfulConfigured } from '@/config/cms';

const ContentfulDebug = () => {
  // Log all relevant environment variables
  const envVars = {
    VITE_CONTENTFUL_SPACE_ID: import.meta.env.VITE_CONTENTFUL_SPACE_ID || 'NOT SET',
    VITE_CONTENTFUL_ENVIRONMENT_ID: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'NOT SET',
    VITE_CONTENTFUL_DELIVERY_TOKEN: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN ? 'PRESENT' : 'NOT SET',
    configuredStatus: isContentfulConfigured() ? 'CONFIGURED' : 'NOT CONFIGURED'
  };

  return null; // Return null to prevent rendering anything in production
};

export default ContentfulDebug;
