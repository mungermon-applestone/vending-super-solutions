
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CMSConnectionTest from '@/components/admin/cms/CMSConnectionTest';
import ContentfulTypeCreator from '@/components/admin/cms/ContentfulTypeCreator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ContentfulButton from '@/components/admin/ContentfulButton';
import { Button } from '@/components/ui/button';

interface ContentTypeMigrationStatus {
  name: string;
  status: 'complete' | 'in-progress' | 'not-started';
  contentfulType: string;
}

const ContentfulManagement: React.FC = () => {
  const migrationStatuses: ContentTypeMigrationStatus[] = [
    { name: "Products", status: "complete", contentfulType: "product" },
    { name: "Business Goals", status: "complete", contentfulType: "businessGoal" },
    { name: "Technologies", status: "complete", contentfulType: "technology" },
    { name: "Machines", status: "complete", contentfulType: "machine" },
    { name: "Blog Posts", status: "complete", contentfulType: "blogPost" },
    { name: "Case Studies", status: "complete", contentfulType: "caseStudy" },
    { name: "Landing Pages", status: "complete", contentfulType: "landingPage" },
    { name: "Testimonials", status: "complete", contentfulType: "testimonial" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "not-started":
        return <Info className="h-5 w-5 text-gray-400" />;
      default:
        return <Info className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <Layout>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contentful Management</h1>
            <p className="text-muted-foreground">
              Create and manage Contentful content types and entries
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => window.open("https://app.contentful.com/", "_blank")}
            className="flex items-center gap-2"
          >
            Open Contentful <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contentful Migration Status</CardTitle>
            <CardDescription>
              All content types have been migrated to Contentful. Legacy admin interfaces will be removed in future updates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {migrationStatuses.map((item) => (
                <Card key={item.name} className="overflow-hidden">
                  <div className={`px-4 py-2 flex justify-between items-center border-b ${
                    item.status === 'complete' ? 'bg-green-50 border-green-100' : 
                    item.status === 'in-progress' ? 'bg-amber-50 border-amber-100' : 
                    'bg-gray-50 border-gray-100'
                  }`}>
                    <h3 className="font-medium">{item.name}</h3>
                    {getStatusIcon(item.status)}
                  </div>
                  <CardContent className="p-4">
                    <p className={`text-sm mb-3 ${
                      item.status === 'complete' ? 'text-green-700' : 
                      item.status === 'in-progress' ? 'text-amber-700' : 
                      'text-gray-500'
                    }`}>
                      {item.status === 'complete' ? 'Migration Complete' : 
                       item.status === 'in-progress' ? 'Migration In Progress' : 
                       'Migration Not Started'}
                    </p>
                    <ContentfulButton 
                      contentType={item.contentfulType}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>About Content Type Management</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              This tool currently supports creating predefined content types in your Contentful space. 
              To modify existing content types, you'll need to:
            </p>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Delete the existing content type from Contentful</li>
              <li>Create a new content type with the updated definition</li>
            </ol>
            <p className="mt-2">
              Note: Deleting a content type will also delete any entries of that type in Contentful.
              Make sure to back up your content before deleting content types.
            </p>
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="connection">
          <TabsList className="mb-8">
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="content-types">Content Types</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connection">
            <div className="grid gap-6">
              <CMSConnectionTest />
            </div>
          </TabsContent>
          
          <TabsContent value="content-types">
            <div className="grid gap-6">
              <ContentfulTypeCreator />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ContentfulManagement;
