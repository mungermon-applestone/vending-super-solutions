
import React from 'react';

const ContentfulDebug = () => {
  // Log all relevant environment variables
  const envVars = {
    VITE_CONTENTFUL_SPACE_ID: import.meta.env.VITE_CONTENTFUL_SPACE_ID || 'NOT SET',
    VITE_CONTENTFUL_ENVIRONMENT_ID: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'NOT SET',
    hasDeliveryToken: !!import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN,
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg text-sm z-50">
      <h3 className="font-bold mb-2">Contentful Debug</h3>
      <pre className="text-xs">
        {JSON.stringify(envVars, null, 2)}
      </pre>
    </div>
  );
};

export default ContentfulDebug;
