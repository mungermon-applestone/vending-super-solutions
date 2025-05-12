
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { ExternalLink } from 'lucide-react';
import { logDeprecation } from '@/services/cms/utils/deprecation';
import { showRedirectToContentfulNotice } from '@/services/cms/utils/deprecationNotices';

const SignUp = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    logDeprecation(
      "SignUpPage",
      "The Sign Up interface is deprecated and will be removed in a future version."
    );
    
    showRedirectToContentfulNotice();
  }, []);

  const handleOpenContentful = () => {
    window.open('https://www.contentful.com/sign-up/', '_blank');
  };

  return (
    <Layout>
      <div className="container py-12 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Admin Sign Up</CardTitle>
            <CardDescription className="text-center">
              Create a Contentful account to manage content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center mb-6">
              User registration is now handled directly through Contentful.
              Please create a Contentful account to manage your content.
            </p>
            
            <div className="flex flex-col gap-4">
              <Button 
                onClick={handleOpenContentful}
                className="w-full"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Create Contentful Account
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/admin/dashboard')}
                className="w-full"
              >
                Back to Admin Dashboard
              </Button>
              
              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => navigate('/sign-in')}
                >
                  Already have an account? Sign In
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SignUp;
