
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCMSInfo } from '@/services/cms/utils/cmsInfo';
import { Database, Server, Key, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
            <Badge variant="default">
              Contentful
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Server className="h-4 w-4" />
              <span className="font-medium">Space ID:</span>
            </span>
            <Badge variant="outline">
              {cmsInfo.spaceId ? 'Configured' : 'Not Configured'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Key className="h-4 w-4" />
              <span className="font-medium">Delivery Token:</span>
            </span>
            <Badge 
              variant="outline" 
              className={cmsInfo.deliveryTokenConfigured 
                ? "text-green-600 border-green-600 flex items-center gap-1"
                : "text-red-600 border-red-600 flex items-center gap-1"
              }
            >
              {cmsInfo.deliveryTokenConfigured ? (
                <>
                  <CheckCircle className="h-3 w-3" /> 
                  Configured
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3" />
                  Not Configured
                </>
              )}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Key className="h-4 w-4" />
              <span className="font-medium">Management Token:</span>
            </span>
            <Badge 
              variant="outline" 
              className={cmsInfo.managementTokenConfigured 
                ? "text-green-600 border-green-600 flex items-center gap-1"
                : "text-amber-600 border-amber-600 flex items-center gap-1"
              }
            >
              {cmsInfo.managementTokenConfigured ? (
                <>
                  <CheckCircle className="h-3 w-3" /> 
                  Configured
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3" />
                  Optional
                </>
              )}
            </Badge>
          </div>

          {!cmsInfo.isConfigured && (
            <Alert className="mt-2 bg-red-50 border-red-100">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Configuration Required</AlertTitle>
              <AlertDescription className="text-red-700">
                Please configure your Contentful credentials in environment variables.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CMSConfigInfo;
