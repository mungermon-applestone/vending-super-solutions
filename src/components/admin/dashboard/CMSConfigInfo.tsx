
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCMSInfo } from '@/services/cms/utils/cmsInfo';
import { Database, Server } from 'lucide-react';

const CMSConfigInfo: React.FC = () => {
  const cmsInfo = getCMSInfo();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Server className="h-5 w-5" />
          CMS Provider
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Active Provider:</span>
            <Badge variant={cmsInfo.provider === 'Strapi' ? 'default' : 'outline'}>
              {cmsInfo.provider === 'Strapi' ? (
                <span className="flex items-center gap-1">
                  <Server className="h-3 w-3" /> Strapi
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Database className="h-3 w-3" /> Supabase
                </span>
              )}
            </Badge>
          </div>
          
          {cmsInfo.provider === 'Strapi' && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">API URL:</span>
                <span className="text-sm font-mono truncate max-w-[200px]">
                  {cmsInfo.apiUrl || 'Not configured'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={cmsInfo.isConfigured ? 'success' : 'destructive'}>
                  {cmsInfo.isConfigured ? 'Configured' : 'Not Configured'}
                </Badge>
              </div>
            </>
          )}
          
          <p className="text-xs text-muted-foreground mt-2">
            CMS provider is configured via environment variables in .env file.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CMSConfigInfo;
