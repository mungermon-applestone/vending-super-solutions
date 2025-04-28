
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ContentfulConfigWarning: React.FC = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-8">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Contentful is not configured</p>
          <p className="text-sm text-amber-700 mt-1">
            Please set up your Contentful Space ID and Delivery Token in Admin &gt; Environment Variables.
          </p>
          <p className="text-sm text-amber-700 mt-1">
            Using fallback data for preview purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContentfulConfigWarning;
