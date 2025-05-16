
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, ImageIcon } from 'lucide-react';
import DeprecatedAdminLayout from '@/components/admin/layout/DeprecatedAdminLayout';

const AdminMedia = () => {
  const openContentful = () => {
    window.open('https://app.contentful.com/', '_blank');
  };

  return (
    <DeprecatedAdminLayout
      title="Media Library"
      description="Media management functionality is now available in Contentful"
      contentType="Media"
      backPath="/admin/dashboard"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Media Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Media management functionality has been fully migrated to Contentful.
            Use Contentful's built-in Assets management to upload, organize, and manage all media files.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="bg-gray-50 border border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Media Library</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Access the complete media library in Contentful to view and manage all uploaded assets.
                </p>
                <Button 
                  variant="outline"
                  onClick={openContentful}
                  className="w-full"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Media Library
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 border border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Upload New Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Upload and organize new images, documents and other media assets directly in Contentful.
                </p>
                <Button 
                  variant="outline"
                  onClick={openContentful}
                  className="w-full"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Upload Media
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </DeprecatedAdminLayout>
  );
};

export default AdminMedia;
