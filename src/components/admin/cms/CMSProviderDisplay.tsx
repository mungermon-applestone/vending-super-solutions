
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getCMSInfo } from '@/services/cms/utils/cmsInfo';
import CMSConfigInfo from './CMSConfigInfo';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const CMSProviderDisplay: React.FC = () => {
  const cmsInfo = getCMSInfo();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          Current CMS Provider
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xl">{cmsInfo.provider}</span>
          <Badge 
            variant={cmsInfo.isConfigured ? "success" : "warning"}
            className={cmsInfo.isConfigured ? "bg-green-500" : "bg-yellow-500"}
          >
            {cmsInfo.status === 'configured' 
              ? 'Fully Configured' 
              : cmsInfo.status === 'partial' 
                ? 'Partially Configured' 
                : 'Not Configured'}
          </Badge>
        </div>
        
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span>Configuration status</span>
            <span>
              {cmsInfo.status === 'configured' 
                ? '100%' 
                : cmsInfo.status === 'partial' 
                  ? '50%' 
                  : '0%'}
            </span>
          </div>
          <Progress 
            value={
              cmsInfo.status === 'configured' 
                ? 100 
                : cmsInfo.status === 'partial' 
                  ? 50 
                  : 0
            } 
            className={
              cmsInfo.status === 'configured' 
                ? 'bg-green-500' 
                : cmsInfo.status === 'partial' 
                  ? 'bg-yellow-500' 
                  : 'bg-gray-200'
            }
          />
        </div>
        
        <CMSConfigInfo />
        
        {cmsInfo.adminUrl && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => window.open(cmsInfo.adminUrl, '_blank')}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open {cmsInfo.provider} Admin
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CMSProviderDisplay;
