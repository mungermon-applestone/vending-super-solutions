import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Goal, Database, Server, Monitor, FileText, Image, BookOpen, Layout as LayoutIcon, AlertTriangle, ExternalLink } from 'lucide-react';
import ContentTypeCard from '@/components/admin/dashboard/ContentTypeCard';
import QuickNavigation from '@/components/admin/dashboard/QuickNavigation';
import ContentManagementList from '@/components/admin/dashboard/ContentManagementList';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const contentTypes = [
  {
    title: "Products",
    description: "Manage product types displayed on the site",
    icon: <Package className="h-8 w-8 text-blue-500" />,
    path: "/admin/products",
    createPath: "/admin/products/new",
    colorClass: "bg-blue-50 border-blue-200",
    deprecated: true,
    contentfulSection: "products"
  },
  {
    title: "Business Goals",
    description: "Manage business goals and solutions",
    icon: <Goal className="h-8 w-8 text-purple-500" />,
    path: "/admin/business-goals",
    createPath: "/admin/business-goals/new",
    colorClass: "bg-purple-50 border-purple-200",
    deprecated: true,
    contentfulSection: "business-goals"
  },
  {
    title: "Machines",
    description: "Manage vending machines and lockers",
    icon: <Server className="h-8 w-8 text-emerald-500" />,
    path: "/admin/machines",
    createPath: "/admin/machines/new",
    colorClass: "bg-emerald-50 border-emerald-200",
    deprecated: true,
    contentfulSection: "machines"
  },
  {
    title: "Technology",
    description: "Manage technology platform features",
    icon: <Monitor className="h-8 w-8 text-indigo-500" />,
    path: "/admin/technology",
    createPath: "/admin/technology/new",
    colorClass: "bg-indigo-50 border-indigo-200",
    deprecated: true,
    contentfulSection: "technology"
  },
  {
    title: "Blog",
    description: "Manage blog posts and updates",
    icon: <BookOpen className="h-8 w-8 text-amber-500" />,
    path: "/admin/blog",
    createPath: "/admin/blog/new",
    colorClass: "bg-amber-50 border-amber-200",
    deprecated: false
  },
  {
    title: "Case Studies",
    description: "Manage success stories and case studies",
    icon: <FileText className="h-8 w-8 text-teal-500" />,
    path: "/admin/case-studies",
    createPath: "/admin/case-studies/new",
    colorClass: "bg-teal-50 border-teal-200",
    deprecated: false
  },
  {
    title: "Landing Pages",
    description: "Manage hero content on landing pages",
    icon: <LayoutIcon className="h-8 w-8 text-pink-500" />,
    path: "/admin/landing-pages",
    createPath: "/admin/landing-pages/new",
    colorClass: "bg-pink-50 border-pink-200",
    deprecated: false
  },
  {
    title: "Media",
    description: "Manage images and media files",
    icon: <Image className="h-8 w-8 text-rose-500" />,
    path: "/admin/media",
    createPath: "/admin/media", // Media doesn't have a separate create page
    colorClass: "bg-rose-50 border-rose-200",
    deprecated: false
  }
];

const navItems = contentTypes.map(type => ({
  title: type.title,
  description: type.description,
  href: type.path,
  deprecated: type.deprecated
}));

const AdminDashboard = () => {
  const { toast } = useToast();
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to sign-in if not an admin
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/admin/sign-in');
    }
  }, [isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      toast({
        title: "Content Management Migration",
        description: "All content management has moved to Contentful CMS. This admin interface is being phased out.",
        variant: "warning",
      });
    }
  }, [isAdmin, toast]);

  const handleOpenContentful = () => {
    window.open("https://app.contentful.com/", "_blank");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <div className="flex items-center justify-center h-64">
            <p>Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Content Management</h1>
          <p className="text-muted-foreground">
            Manage content through Contentful CMS
          </p>
        </div>

        <Card className="bg-blue-50 border-blue-200 mb-8 shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Database className="h-5 w-5" />
              Contentful CMS Migration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-md border border-blue-200">
                <p className="text-blue-800 font-medium mb-2">Content Management has Moved</p>
                <p className="text-blue-700 mb-4">
                  All content creation and editing has been migrated to Contentful CMS. The legacy admin interface 
                  is being phased out and will be removed in future updates. Please use Contentful for all content management.
                </p>
                
                <Button 
                  onClick={handleOpenContentful}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Contentful CMS
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert variant="warning" className="mb-8 border-amber-300 bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800 font-medium">Legacy Admin Interface</AlertTitle>
          <AlertDescription className="text-amber-700">
            <p>The sections below are part of the legacy admin interface and are being deprecated.</p>
            <p className="mt-2">Content types marked with the "Deprecated" badge should now be managed directly in Contentful.</p>
          </AlertDescription>
        </Alert>

        <div className="mb-8">
          <QuickNavigation items={navItems} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {contentTypes.map((type) => (
            <ContentTypeCard
              key={type.title}
              title={type.title}
              description={type.description}
              icon={type.icon}
              path={type.path}
              createPath={type.createPath}
              colorClass={type.colorClass}
              deprecated={type.deprecated}
            />
          ))}
        </div>

        <div id="database-section" className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <Database className="h-6 w-6 text-gray-700" />
            <h2 className="text-2xl font-bold">Database Content Overview</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContentManagementList contentTypes={contentTypes} />
            <QuickActions />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
