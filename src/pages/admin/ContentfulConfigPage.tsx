
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { logDeprecation } from '@/services/cms/utils/deprecation';

const ContentfulConfigPage = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    logDeprecation(
      "ContentfulConfigPageRedirector",
      "User accessed the old ContentfulConfigPage path"
    );
  }, []);
  
  // Automatically redirect after a short delay
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/admin/contentful-config');
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <Layout>
      <div className="container py-12 max-w-md mx-auto">
        <Alert variant="info" className="mb-4">
          <AlertTitle>Page Moved</AlertTitle>
          <AlertDescription>
            The Contentful configuration page has moved to a new location.
            You'll be redirected automatically.
          </AlertDescription>
        </Alert>
        
        <Button 
          onClick={() => navigate('/admin/contentful-config')}
          className="w-full"
        >
          Go to Contentful Configuration
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Layout>
  );
};

export default ContentfulConfigPage;
