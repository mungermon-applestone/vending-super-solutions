
import React from 'react';
import { Bug, Database, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useContentfulProductType } from '@/hooks/cms/useContentfulProductType';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CONTENTFUL_CONFIG } from '@/config/cms';

interface DiagnosticInfoProps {
  slug: string;
  compact?: boolean;
}

const DiagnosticInfo = ({ slug, compact = false }: DiagnosticInfoProps) => {
  const [showFullDiagnostics, setShowFullDiagnostics] = React.useState(false);
  const { isLoading, error, diagnosticInfo } = useContentfulProductType(slug);
  
  const testContentfulConnection = async () => {
    try {
      const response = await fetch(`https://cdn.contentful.com/spaces/${CONTENTFUL_CONFIG.SPACE_ID}/environments/${CONTENTFUL_CONFIG.ENVIRONMENT_ID}/entries?access_token=${CONTENTFUL_CONFIG.DELIVERY_TOKEN}&content_type=productType&fields.slug=${slug}`);
      const data = await response.json();
      console.log('[DiagnosticInfo] Direct Contentful API test result:', data);
      toast.success(`Contentful API test complete. Found ${data.total} entries.`);
      return data;
    } catch (error) {
      console.error('[DiagnosticInfo] Direct Contentful API test failed:', error);
      toast.error('Contentful API test failed');
      return null;
    }
  };

  if (compact && !showFullDiagnostics) {
    return (
      <div className="mt-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowFullDiagnostics(true)}
          className="text-xs flex items-center text-gray-600"
        >
          <Bug className="mr-1 h-3 w-3" />
          Show Diagnostics
        </Button>
      </div>
    );
  }

  return (
    <Card className="bg-blue-50 border-blue-200 p-4 my-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-medium text-blue-800 flex items-center">
          <Bug className="mr-2 h-5 w-5" />
          Contentful Diagnostic Information
        </h3>
        {compact && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowFullDiagnostics(false)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Hide
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <p className="text-blue-600 text-sm animate-pulse">Loading diagnostics...</p>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="request-info">
            <AccordionTrigger className="text-blue-700 text-sm py-2">
              Request Information
            </AccordionTrigger>
            <AccordionContent className="bg-white p-3 rounded border border-blue-100 text-sm">
              <div className="space-y-2">
                <div><strong>Requested Slug:</strong> {slug || 'None'}</div>
                <div><strong>Content Type:</strong> {diagnosticInfo?.contentType || 'productType'}</div>
                <div>
                  <strong>Query:</strong>
                  <pre className="bg-gray-50 p-2 rounded text-xs mt-1 overflow-auto max-h-32">
                    {JSON.stringify(diagnosticInfo?.query || {}, null, 2)}
                  </pre>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="contentful-config">
            <AccordionTrigger className="text-blue-700 text-sm py-2">
              Contentful Configuration
            </AccordionTrigger>
            <AccordionContent className="bg-white p-3 rounded border border-blue-100 text-sm">
              <div className="space-y-2">
                <div><strong>Space ID:</strong> {diagnosticInfo?.contentfulConfig?.spaceId || 'Not available'}</div>
                <div><strong>Environment:</strong> {diagnosticInfo?.contentfulConfig?.environment || 'Not available'}</div>
                <div><strong>Has Valid Token:</strong> {diagnosticInfo?.contentfulConfig?.hasToken ? 'Yes' : 'No'}</div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2" 
                  onClick={testContentfulConnection}
                >
                  <Database className="mr-2 h-4 w-4" />
                  Test Direct API Connection
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {error && (
            <AccordionItem value="error-details">
              <AccordionTrigger className="text-red-700 text-sm py-2">
                <span className="flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Error Details
                </span>
              </AccordionTrigger>
              <AccordionContent className="bg-white p-3 rounded border border-red-100 text-sm">
                <div className="text-red-600 font-medium mb-2">{error.message}</div>
                <pre className="bg-red-50 p-2 rounded text-xs overflow-auto max-h-64">
                  {diagnosticInfo?.errorDetails || 'No detailed error information available'}
                </pre>
              </div>
            </AccordionContent>
          </AccordionItem>
          )}
        </Accordion>
      )}
    </Card>
  );
};

export default DiagnosticInfo;
