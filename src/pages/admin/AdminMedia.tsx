
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import MediaLibrary from '@/components/admin/media/MediaLibrary';

const AdminMedia = () => {
  const { toast } = useToast();
  
  React.useEffect(() => {
    toast({
      title: "Media Library",
      description: "Manage your media files for use across the CMS",
    });
  }, [toast]);

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground mt-1">
            Upload, manage and use images and files across your site
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <MediaLibrary />
        </div>
      </div>
    </Layout>
  );
};

export default AdminMedia;
