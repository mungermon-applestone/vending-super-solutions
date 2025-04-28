
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="p-6 h-auto flex flex-col items-center gap-2 border-dashed"
            onClick={() => navigate('/admin/contentful-config')}
          >
            <Settings className="h-6 w-6" />
            <span className="font-medium">Contentful Configuration</span>
            <span className="text-xs text-muted-foreground text-center">
              Set up environment variables for Contentful CMS
            </span>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
