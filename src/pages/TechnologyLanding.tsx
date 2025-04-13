
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useTechnologySections } from '@/hooks/useTechnologySections';
import PageHero from '@/components/common/PageHero';
import CTASection from '@/components/common/CTASection';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { ArrowRight, AlertCircle, ExternalLink, Wrench, FileQuestion } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import SimpleConnectionTest from '@/components/admin/cms/SimpleConnectionTest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TechnologyLanding = () => {
  const { technologies, isLoading, error } = useTechnologySections();
  console.log('TechnologyLanding rendering with technologies:', technologies);
  
  return (
    <Layout>
      <PageHero 
        pageKey="technology"
        fallbackTitle="Enterprise-Grade Technology"
        fallbackSubtitle="Our platform is built with security, scalability, and flexibility in mind to power your vending operations."
        fallbackImage="https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
        fallbackImageAlt="Technology circuit board and digital interface"
        fallbackPrimaryButtonText="Learn More"
        fallbackPrimaryButtonUrl="/contact"
        fallbackSecondaryButtonText="View Tech Specs"
        fallbackSecondaryButtonUrl="#tech-details"
      />
      
      <div className="container mx-auto py-16" id="tech-details">
        <h2 className="text-3xl font-bold text-center mb-2">Our Technology Solutions</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Discover how our advanced technology solutions can transform your vending operations
        </p>
        
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading technologies</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'An unknown error occurred'}
            </AlertDescription>
          </Alert>
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
        ) : technologies.length === 0 ? (
          <div className="text-center py-12">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <FileQuestion className="h-6 w-6 text-amber-500" />
                  <span>No Technology Solutions Found</span>
                </CardTitle>
                <CardDescription className="text-center">
                  We couldn't retrieve any technology solutions from your Strapi CMS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="setup">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="setup">Setup Issue</TabsTrigger>
                    <TabsTrigger value="test">Test Connection</TabsTrigger>
                    <TabsTrigger value="options">Options</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="setup" className="space-y-4 pt-4">
                    <Alert className="bg-amber-50 border-amber-200">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertTitle className="text-amber-800">Strapi Cloud Limitations</AlertTitle>
                      <AlertDescription className="text-amber-700">
                        Strapi Cloud has two important limitations that are causing this issue:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>Content-Type Builder is <strong>disabled</strong> in production environments</li>
                          <li>Data Transfer functionality is <strong>disabled</strong> on free plans</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                    
                    <div className="p-4 border rounded-md bg-gray-50 space-y-2">
                      <h4 className="font-medium">Why this is happening:</h4>
                      <p className="text-sm">
                        The "Technology" content type doesn't exist in your Strapi cloud instance. Normally, you would 
                        create this using the Content-Type Builder or transfer it from a local instance, but both 
                        options are restricted in Strapi Cloud without a paid plan.
                      </p>
                      <div className="mt-3 space-y-2">
                        <h4 className="font-medium">Required steps to fix:</h4>
                        <ol className="list-decimal pl-5 text-sm space-y-1">
                          <li><strong>Upgrade to a paid plan</strong> (Pro Plan or higher recommended)</li>
                          <li><strong>Contact Strapi support</strong> to request enabling Developer Mode and Data Transfer</li>
                          <li>After approval, transfer content types from a local instance</li>
                        </ol>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="test" className="space-y-4 pt-4">
                    <div className="p-4 border rounded-md bg-gray-50">
                      <p className="text-sm mb-4">Test the connection to your Strapi CMS:</p>
                      <SimpleConnectionTest />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="options" className="space-y-4 pt-4">
                    <div className="p-4 border rounded-md bg-gray-50">
                      <h4 className="font-medium mb-2">Alternative approaches:</h4>
                      <div className="space-y-4 text-sm">
                        <div>
                          <h5 className="font-medium text-indigo-700">Option 1: Create content manually</h5>
                          <p>Create content entries manually using existing content types in Strapi Cloud.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-indigo-700">Option 2: Use a local Strapi instance</h5>
                          <p>For development, use a local Strapi instance with full Content-Type Builder access.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-indigo-700">Option 3: Switch to a different CMS</h5>
                          <p>Consider using Supabase or another CMS that doesn't have these limitations.</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-3">
                <Button 
                  variant="outline"
                  onClick={() => window.open('https://strapi.io/pricing', '_blank')}
                  size="sm"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Strapi Pricing
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.open('https://docs.strapi.io/dev-docs/deployment/cloud', '_blank')}
                  size="sm"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Strapi Cloud Docs
                </Button>
                
                <Link to="/admin/settings">
                  <Button variant="default" size="sm">
                    <Wrench className="mr-2 h-4 w-4" />
                    CMS Settings
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech) => (
              <Card key={tech.id} className="overflow-hidden h-full flex flex-col">
                {tech.image_url && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={tech.image_url} 
                      alt={tech.image_alt || tech.title}
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
      
      <CTASection />
    </Layout>
  );
};

export default TechnologyLanding;
