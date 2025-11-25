import React from 'react';
import { ContentfulMigration } from '@/components/admin/ContentfulMigration';
import { ContentfulExportButton } from '@/components/admin/ContentfulExportButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
                Contentful Admin Tools
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage Contentful content migrations and exports.
              </p>
            </div>
            
            <div className="space-y-8">
              <ContentfulMigration />
              
              <Card>
                <CardHeader>
                  <CardTitle>Export Content</CardTitle>
                  <CardDescription>
                    Export all Contentful content to a structured XML file for backup or migration purposes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentfulExportButton />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminContentfulMigration;
