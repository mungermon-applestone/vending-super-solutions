
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ExternalLink, 
  Check, 
  Clock, 
  AlertTriangle,
  ChevronRight, 
  Database,
  PackageOpen,
  BookOpen
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CONTENT_TYPE_MIGRATION_STATUS, 
  CONTENT_TYPE_IDS,
  MIGRATION_STATUS
} from '@/services/cms/utils/deprecationConstants';
import MigrationStatusBadge from '@/components/admin/MigrationStatusBadge';
import ContentfulButton from '@/components/admin/ContentfulButton';

const ContentfulMigrationGuide = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Contentful Migration Guide</h1>
          <p className="text-muted-foreground mb-8">
            Everything you need to know about the transition to Contentful CMS
          </p>

          <div className="space-y-10">
            {/* Overview Section */}
            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50 border-b border-blue-200">
                <CardTitle>Migration Overview</CardTitle>
                <CardDescription>Why we're moving to Contentful</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">
                  We're transitioning all content management from our custom admin interface to Contentful CMS. 
                  This provides several benefits:
                </p>
                
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Improved content modeling and relationships</li>
                  <li>Better editorial workflows and permissions</li>
                  <li>Superior media management</li>
                  <li>Powerful localization options</li>
                  <li>Robust API with SDKs for multiple platforms</li>
                </ul>
                
                <div className="mt-4 flex gap-3">
                  <Button onClick={() => window.open("https://app.contentful.com/", "_blank")}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Contentful
                  </Button>
                  <Button variant="outline" onClick={() => window.open("https://www.contentful.com/developers/docs/", "_blank")}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Migration Status Section */}
            <div>
              <h2 className="text-xl font-bold mb-4">Content Type Migration Status</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(CONTENT_TYPE_IDS).map(([key, id]) => {
                  const status = CONTENT_TYPE_MIGRATION_STATUS[id];
                  const contentTypeName = key.charAt(0) + key.slice(1).toLowerCase();
                  
                  // Determine action type based on migration status
                  const getActionButton = () => {
                    switch (status) {
                      case MIGRATION_STATUS.COMPLETE:
                        return (
                          <ContentfulButton 
                            contentType={id}
                            variant="outline"
                            size="sm"
                            action="view"
                            customText={`View in Contentful`}
                          />
                        );
                      case MIGRATION_STATUS.IN_PROGRESS:
                        return (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/admin/${id.toLowerCase()}s`}>
                                Legacy Dashboard
                              </Link>
                            </Button>
                            <ContentfulButton 
                              contentType={id}
                              variant="outline"
                              size="sm"
                              action="manage"
                            />
                          </div>
                        );
                      default:
                        return (
                          <Button variant="outline" size="sm" disabled>
                            Migration Pending
                          </Button>
                        );
                    }
                  };
                  
                  return (
                    <Card key={id} className="overflow-hidden">
                      <div className="flex items-center p-4 border-b">
                        <div className="mr-3">
                          {status === MIGRATION_STATUS.COMPLETE ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : status === MIGRATION_STATUS.IN_PROGRESS ? (
                            <Clock className="h-5 w-5 text-blue-500" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{contentTypeName}</h3>
                          <p className="text-sm text-gray-600">{id}</p>
                        </div>
                        <MigrationStatusBadge status={status} />
                      </div>
                      <div className="p-4 bg-gray-50">
                        {getActionButton()}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
            
            {/* Steps Section */}
            <div>
              <h2 className="text-xl font-bold mb-4">Migration Steps</h2>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <div className="flex items-center justify-center bg-green-100 text-green-800 rounded-full h-6 w-6 mr-3 text-sm font-bold">1</div>
                      Configure Contentful Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Set up your Contentful space and configure API keys in our system.
                    </p>
                    <Button variant="outline" asChild>
                      <Link to="/admin/contentful">
                        <Database className="mr-2 h-4 w-4" />
                        Configure Contentful
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <div className="flex items-center justify-center bg-blue-100 text-blue-800 rounded-full h-6 w-6 mr-3 text-sm font-bold">2</div>
                      Explore Content Models
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Familiarize yourself with the content models in Contentful.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => window.open("https://app.contentful.com/spaces/SPACE_ID/content_types", "_blank").replace("SPACE_ID", process.env.CONTENTFUL_SPACE_ID || "demo")}
                    >
                      <PackageOpen className="mr-2 h-4 w-4" />
                      View Content Models
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <div className="flex items-center justify-center bg-amber-100 text-amber-800 rounded-full h-6 w-6 mr-3 text-sm font-bold">3</div>
                      Create and Manage Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Start using Contentful to create and manage your content.
                    </p>
                    <ContentfulButton 
                      variant="outline"
                      action="create"
                      customText="Create New Content"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Resources Section */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Resources</CardTitle>
                <CardDescription>
                  Helpful links and documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="https://www.contentful.com/developers/docs/tutorials/general/get-started/"
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <ChevronRight className="mr-1 h-4 w-4" />
                      Getting Started with Contentful
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/"
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <ChevronRight className="mr-1 h-4 w-4" />
                      Using the JavaScript Content Delivery API
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.contentful.com/developers/docs/concepts/data-model/"
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <ChevronRight className="mr-1 h-4 w-4" />
                      Content Modeling Guide
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContentfulMigrationGuide;
