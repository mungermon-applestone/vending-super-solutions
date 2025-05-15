import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useTechnologySections } from '@/hooks/useTechnologySections';
import PageHero from '@/components/common/PageHero';
import CTASection from '@/components/common/CTASection';
import { SimpleContactCTA } from '@/components/common';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { ArrowRight, AlertCircle, ExternalLink, Wrench, FileQuestion, RefreshCcw, Database, BookOpen, Bug } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import ContentfulDebug from '@/components/debug/ContentfulDebug';

const TechnologyLanding = () => {
  const { technologies = [], isLoading, error, refetch } = useTechnologySections({
    enableToasts: true,
    debug: true // Always enable debug for troubleshooting
  });
  
  const hasTechnologies = technologies && technologies.length > 0;
  console.log('TechnologyLanding rendering with technologies:', technologies);
  
  const handleRefresh = async () => {
    toast.loading("Refreshing content...");
    await refetch();
    toast.success("Content refreshed");
  };

  const clearCacheAndRefresh = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vending-cms-env-variables');
      toast.success("Cache cleared, reloading page");
      setTimeout(() => window.location.reload(), 1000);
    }
  };
  
  return (
    <Layout>
      <PageHero 
        pageKey="technology" 
        fallbackTitle="" 
        fallbackSubtitle="" 
        fallbackImage="" 
        fallbackImageAlt="" 
      />
      
      <div className="container mx-auto py-16" id="tech-details">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Our Technology Solutions</h2>
            <p className="text-muted-foreground max-w-2xl">
              Discover how our advanced technology solutions can transform your vending operations
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
            
            {process.env.NODE_ENV === 'development' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearCacheAndRefresh}
                className="flex items-center gap-2"
              >
                <Bug className="h-4 w-4" />
                Clear Cache
              </Button>
            )}
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading technologies</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'An unknown error occurred'}
              <div className="flex gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetch()} 
                >
                  Try again
                </Button>
                {process.env.NODE_ENV === 'development' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearCacheAndRefresh} 
                  >
                    Clear Cache
                  </Button>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8">
            <ContentfulDebug />
          </div>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video w-full">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-5/6 mb-4" />
                  <Skeleton className="h-10 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !hasTechnologies ? (
          <div className="text-center py-12">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <FileQuestion className="h-6 w-6 text-amber-500" />
                  <span>No Technology Solutions Found</span>
                </CardTitle>
                <CardDescription className="text-center">
                  We couldn't retrieve any technology items from the database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="database">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="database">Database</TabsTrigger>
                    <TabsTrigger value="test">Test Connection</TabsTrigger>
                    <TabsTrigger value="docs">Documentation</TabsTrigger>
                  </TabsList>
                  
                  {/* Database Tab */}
                  <TabsContent value="database" className="space-y-4 pt-4">
                    <Alert className="bg-blue-50 border-blue-200">
                      <Database className="h-4 w-4 text-blue-600" />
                      <AlertTitle className="text-blue-800">Using Contentful CMS</AlertTitle>
                      <AlertDescription className="text-blue-700">
                        Your application is currently configured to use the Contentful CMS. Make sure your content model includes the following:
                        <div className="mt-2">
                          <Badge variant="secondary" className="mr-2 mb-2">technology</Badge>
                          <Badge variant="secondary" className="mr-2 mb-2">technologySection</Badge>
                          <Badge variant="secondary" className="mr-2 mb-2">technology_features</Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                    
                    <div className="p-4 border rounded-md bg-gray-50 space-y-2">
                      <h4 className="font-medium">No technology content found because:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>You may not have created any technology entries in Contentful</li>
                        <li>The content model may not exist in your Contentful space</li>
                        <li>There might be configuration issues with your Contentful connection</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-md bg-gray-50 space-y-2 border-l-4 border-l-blue-500">
                      <h4 className="font-medium">Next steps:</h4>
                      <ol className="list-decimal pl-5 text-sm space-y-1">
                        <li>Verify your Contentful configuration in Admin settings</li>
                        <li>Create a test technology entry in Contentful</li>
                        <li>Verify the content model matches our expected structure</li>
                      </ol>
                      <div className="flex gap-2 mt-3">
                        <Link to="/admin/technology">
                          <Button variant="default" size="sm">
                            <Wrench className="mr-2 h-4 w-4" />
                            Manage Technologies
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleRefresh}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Refresh
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Test Tab */}
                  <TabsContent value="test" className="space-y-4 pt-4">
                    <div className="p-4 border rounded-md bg-gray-50">
                      <p className="text-sm mb-4">You can test the Contentful connection by clicking the Refresh button above.</p>
                      <Button onClick={handleRefresh}>Test Connection</Button>
                    </div>
                  </TabsContent>
                  
                  {/* Docs Tab */}
                  <TabsContent value="docs" className="space-y-4 pt-4">
                    <div className="p-4 border rounded-md bg-gray-50">
                      <h4 className="font-medium mb-2">Contentful Documentation</h4>
                      <p className="text-sm mb-3">
                        Your application uses the Contentful CMS. Here's how the technologies content type works:
                      </p>
                      <div className="space-y-4 text-sm">
                        <div className="p-3 bg-white rounded border">
                          <h5 className="font-medium text-blue-700">Data Structure</h5>
                          <p className="mb-2">Technologies consist of:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Basic details (title, slug, description)</li>
                            <li>Sections (grouped content areas)</li>
                            <li>Features (individual capabilities)</li>
                          </ul>
                        </div>
                        
                        <div className="p-3 bg-white rounded border">
                          <h5 className="font-medium text-blue-700">Creating Content</h5>
                          <p className="mb-0">
                            Use the Contentful web interface to create and manage technology content. Each technology can have multiple sections,
                            and each section can have multiple features.
                          </p>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          asChild
                        >
                          <Link to="/admin/settings">
                            <BookOpen className="mr-2 h-4 w-4" />
                            View Full Documentation
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-3">
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleRefresh}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Content
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.open('https://app.contentful.com/login', '_blank')}
                  size="sm"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Contentful Dashboard
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
        
        {/* Technology List */}
        {hasTechnologies && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech) => (
              <Card key={tech.id} className="overflow-hidden h-full flex flex-col">
                {tech.image && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={tech.image.url}
                      alt={tech.image.alt || tech.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                )}
                <CardContent className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{tech.title}</h3>
                  <p className="text-muted-foreground mb-4 flex-grow">{tech.description}</p>
                  <Link 
                    to={`/technology/${tech.slug}`}
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <SimpleContactCTA />
      <CTASection />
    </Layout>
  );
};

export default TechnologyLanding;
