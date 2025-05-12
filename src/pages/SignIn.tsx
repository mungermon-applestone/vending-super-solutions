
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { ExternalLink } from 'lucide-react';
import { logDeprecation } from '@/services/cms/utils/deprecation';
import { showRedirectToContentfulNotice } from '@/services/cms/utils/deprecationNotices';

const SignIn = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    logDeprecation(
      "SignInPage",
      "The Sign In interface is deprecated and will be removed in a future version."
    );
    
    showRedirectToContentfulNotice();
  }, []);

  const handleOpenContentful = () => {
    window.open('https://app.contentful.com/', '_blank');
  };

  return (
    <Layout>
      <div className="container py-12 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Admin Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center mb-6">
              Admin authentication is now handled directly through Contentful.
              Please sign in to Contentful to manage your content.
            </p>
            
            <div className="flex flex-col gap-4">
              <Button 
                onClick={handleOpenContentful}
                className="w-full"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Sign in to Contentful
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/admin/dashboard')}
                className="w-full"
              >
                Back to Admin Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SignIn;
