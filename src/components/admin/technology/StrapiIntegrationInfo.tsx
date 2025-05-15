
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ExternalLink, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCMSInfo } from '@/services/cms/utils/cmsInfo';
import SimpleConnectionTest from '@/components/admin/cms/SimpleConnectionTest';

const StrapiIntegrationInfo: React.FC = () => {
  const cmsInfo = getCMSInfo();
  const isStrapi = cmsInfo.provider === 'Strapi';
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Strapi CMS Integration
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isStrapi ? (
          <div className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <div className="flex flex-wrap gap-4 items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                    <p className={`font-medium ${cmsInfo.isConfigured ? 'text-green-600' : 'text-amber-600'}`}>
                      {cmsInfo.isConfigured ? 'Connected' : 'Not Fully Configured'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">API URL</p>
                    <p className="font-mono text-sm">{cmsInfo.apiUrl || 'Not configured'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">API Key</p>
                    <p>{cmsInfo.apiKeyConfigured ? '••••••••••••••••••' : 'Not configured'}</p>
                  </div>
                </div>
                
                {!cmsInfo.isConfigured && (
                  <Alert className="mt-4 bg-amber-50 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">Configuration Needed</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      Your Strapi CMS integration requires additional configuration.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Connection Test</p>
                <SimpleConnectionTest />
              </div>
            </div>
          </div>
        ) : (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Currently Using Supabase</AlertTitle>
            <AlertDescription className="text-blue-700">
              You are currently using Supabase as your CMS provider.
              You can switch to Strapi in the settings.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline" 
          asChild
          className="w-full sm:w-auto"
        >
          <Link to="/admin/strapi-config">
            Configure Strapi
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          asChild
          className="w-full sm:w-auto"
        >
          <Link to="/admin/strapi">
            Manage Integration
          </Link>
        </Button>
        
        {isStrapi && cmsInfo.adminUrl && (
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={() => window.open(cmsInfo.adminUrl, '_blank')}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Strapi Admin
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StrapiIntegrationInfo;
