import React from 'react';
import { ContentfulMigration } from '@/components/admin/ContentfulMigration';
import SEO from '@/components/seo/SEO';

const AdminContentfulMigration: React.FC = () => {
  return (
    <>
      <SEO 
        title="Contentful Migration - Admin"
        description="Migrate Contentful hero description to RichText format"
        noindex={true}
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">
                Contentful Migration Tool
              </h1>
              <p className="text-muted-foreground mt-2">
                Migrate Business Goals hero description from plain text to RichText format.
              </p>
            </div>
            
            <ContentfulMigration />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminContentfulMigration;
