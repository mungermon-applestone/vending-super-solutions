
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, ServerCog, FileText, Package, Goal, Database, Monitor } from 'lucide-react';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

interface ContentTypeLink {
  name: string;
  contentTypeId: string;
  icon: React.ReactNode;
  description: string;
}

const contentTypes: ContentTypeLink[] = [
  {
    name: "Products",
    contentTypeId: "product",
    icon: <Package className="h-5 w-5 text-blue-600" />,
    description: "Manage product offerings and details"
  },
  {
    name: "Business Goals",
    contentTypeId: "businessGoal",
    icon: <Goal className="h-5 w-5 text-green-600" />,
    description: "Manage business goals and objectives"
  },
  {
    name: "Technologies",
    contentTypeId: "technology",
    icon: <ServerCog className="h-5 w-5 text-purple-600" />,
    description: "Manage technology platforms"
  },
  {
    name: "Machines",
    contentTypeId: "machine",
    icon: <Monitor className="h-5 w-5 text-orange-600" />,
    description: "Manage physical machine details"
  },
  {
    name: "Case Studies",
    contentTypeId: "caseStudy",
    icon: <FileText className="h-5 w-5 text-indigo-600" />,
    description: "Manage customer success stories"
  }
];

interface ContentfulRedirectPanelProps {
  title?: string;
  description?: string;
  spaceId?: string;
  environmentId?: string;
  showAllContentTypes?: boolean;
  contentTypeFilter?: string[];
}

/**
 * Panel component that shows direct links to Contentful content types
 * to help admins transition from the legacy admin interfaces
 */
const ContentfulRedirectPanel: React.FC<ContentfulRedirectPanelProps> = ({
  title = "Manage Content in Contentful",
  description = "All content management is now done directly in Contentful CMS",
  spaceId,
  environmentId = "master",
  showAllContentTypes = true,
  contentTypeFilter = []
}) => {
  // Track usage of this component
  React.useEffect(() => {
    logDeprecationWarning(
      "ContentfulRedirectPanel",
      "Admin using content type links to Contentful",
      "This is the recommended approach"
    );
  }, []);

  // Filter content types if needed
  const visibleContentTypes = showAllContentTypes 
    ? contentTypes 
    : contentTypes.filter(ct => contentTypeFilter.includes(ct.contentTypeId));

  const getContentfulUrl = (contentTypeId: string): string => {
    let url = "https://app.contentful.com/";
    
    if (spaceId) {
      url += `spaces/${spaceId}/`;
      
      if (environmentId) {
        url += `environments/${environmentId}/`;
      }
      
      url += `entries/?contentTypeId=${contentTypeId}`;
    }
    
    return url;
  };

  const handleOpenContentful = (contentTypeId?: string) => {
    const url = contentTypeId 
      ? getContentfulUrl(contentTypeId)
      : "https://app.contentful.com/";
      
    window.open(url, "_blank");
  };

  return (
    <Card className="shadow-sm border-blue-100">
      <CardHeader className="bg-blue-50 border-b border-blue-100">
        <CardTitle className="text-blue-800 flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
        <CardDescription className="text-blue-700">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleContentTypes.map(contentType => (
            <Button
              key={contentType.contentTypeId}
              variant="outline"
              className="h-auto py-4 px-4 flex flex-col items-start gap-2 text-left border border-gray-200 hover:border-blue-200 hover:bg-blue-50"
              onClick={() => handleOpenContentful(contentType.contentTypeId)}
            >
              <div className="flex items-center w-full">
                {contentType.icon}
                <span className="ml-2 font-medium">{contentType.name}</span>
                <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 font-normal">
                {contentType.description}
              </p>
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t">
        <Button 
          variant="default" 
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={() => handleOpenContentful()}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open Contentful Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContentfulRedirectPanel;
