import React from 'react';
import { MissingImageReport } from '@/components/admin/MissingImageReport';
import SEO from '@/components/seo/SEO';

const AdminMissingImages: React.FC = () => {
  return (
    <>
      <SEO 
        title="Missing Images Report - Admin"
        description="Scan help desk articles for missing or broken images"
        noindex={true}
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">
                Missing Images Report
              </h1>
              <p className="text-muted-foreground mt-2">
                Scan help desk articles to identify missing or broken images that need attention.
              </p>
            </div>
            
            <MissingImageReport />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminMissingImages;