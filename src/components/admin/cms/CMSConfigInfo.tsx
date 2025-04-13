
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCMSInfo } from '@/services/cms/utils/cmsInfo';
import { Database, Server, Key, AlertCircle } from 'lucide-react';

const CMSConfigInfo: React.FC = () => {
  const cmsInfo = getCMSInfo();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          CMS Configuration
        </CardTitle>
        <CardDescription>
          Current content management system configuration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Provider:</span>
            <Badge variant={cmsInfo.provider === 'Strapi' ? 'outline' : 'default'}>
              {cmsInfo.provider}
            </Badge>
          </div>
          
          {cmsInfo.provider === 'Strapi' && (
            <>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Server className="h-4 w-4" />
                  <span className="font-medium">API URL:</span>
                </span>
                {cmsInfo.apiUrl ? (
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {cmsInfo.apiUrl}
                  </span>
                ) : (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Not Configured
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Key className="h-4 w-4" />
                  <span className="font-medium">API Key:</span>
                </span>
                {cmsInfo.apiKeyConfigured ? (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Configured
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-amber-600 border-amber-600">
                    Not Set
                  </Badge>
                )}
              </div>
            </>
          )}
          
          {cmsInfo.provider === 'Supabase' && (
            <p className="text-sm text-muted-foreground">
              Using Supabase as the CMS provider. No additional configuration needed.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CMSConfigInfo;
