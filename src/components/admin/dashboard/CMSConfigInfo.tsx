
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCMSInfo } from '@/services/cms/utils/cmsInfo';
import { Database, Server, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeprecatedInterfaceWarning from '@/components/admin/DeprecatedInterfaceWarning';

const CMSConfigInfo: React.FC = () => {
  const cmsInfo = getCMSInfo();
  
  const openContentful = () => {
    window.open("https://app.contentful.com/", "_blank");
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Database className="h-5 w-5" />
          Content Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DeprecatedInterfaceWarning 
          title="Legacy CMS Panel" 
          message="This admin panel is being phased out. Please use Contentful directly to manage content."
          showContentfulLink={true}
        />
        
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Active Provider:</span>
            <Badge variant="outline">
              <span className="flex items-center gap-1">
                <Database className="h-3 w-3" /> Contentful
              </span>
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant={cmsInfo.isConfigured ? 'default' : 'destructive'}>
              {cmsInfo.isConfigured ? 'Configured' : 'Not Configured'}
            </Badge>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="mt-2"
            onClick={openContentful}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Contentful
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CMSConfigInfo;
