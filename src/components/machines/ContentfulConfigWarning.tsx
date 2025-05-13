
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ContentfulConfigWarning = () => {
  return (
    <div className="p-6 mb-8 text-left border border-amber-200 rounded-lg bg-amber-50">
      <div className="flex items-start">
        <AlertTriangle className="h-6 w-6 text-amber-500 mr-3 mt-0.5" />
        <div>
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Missing Contentful Configuration</h3>
          <p className="text-amber-700 mb-4">
            The Contentful API access is not properly configured. Please set up the required environment variables or check the admin panel.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/cms">Configure Contentful</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentfulConfigWarning;
