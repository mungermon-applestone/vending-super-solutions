
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Goal, Database, Server, Monitor, FileText, Image, BookOpen, Layout as LayoutIcon, AlertTriangle } from 'lucide-react';
import ContentTypeCard from '@/components/admin/dashboard/ContentTypeCard';
import QuickNavigation from '@/components/admin/dashboard/QuickNavigation';
import ContentManagementList from '@/components/admin/dashboard/ContentManagementList';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';

const contentTypes = [
  {
    title: "Products",
    description: "Manage product types displayed on the site",
    icon: <Package className="h-8 w-8 text-blue-500" />,
    path: "/admin/products",
    createPath: "/admin/products/new",
    colorClass: "bg-blue-50 border-blue-200",
    deprecated: true
  },
  {
    title: "Business Goals",
    description: "Manage business goals and solutions",
    icon: <Goal className="h-8 w-8 text-purple-500" />,
    path: "/admin/business-goals",
    createPath: "/admin/business-goals/new",
    colorClass: "bg-purple-50 border-purple-200",
    deprecated: true
  },
  {
    title: "Machines",
    description: "Manage vending machines and lockers",
    icon: <Server className="h-8 w-8 text-emerald-500" />,
    path: "/admin/machines",
    createPath: "/admin/machines/new",
    colorClass: "bg-emerald-50 border-emerald-200",
    deprecated: true
  },
  {
    title: "Technology",
    description: "Manage technology platform features",
    icon: <Monitor className="h-8 w-8 text-indigo-500" />,
    path: "/admin/technology",
    createPath: "/admin/technology/new",
    colorClass: "bg-indigo-50 border-indigo-200",
    deprecated: true
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
        title: "Admin Dashboard",
        description: "Welcome to the CMS admin dashboard",
      });
    }
  }, [isAdmin, toast]);

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
          <h1 className="text-3xl font-bold mb-2">CMS Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage all content types from a single interface
          </p>
        </div>

        <Alert variant="warning" className="mb-8 border-amber-300 bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800 font-medium">CMS Migration in Progress</AlertTitle>
          <AlertDescription className="text-amber-700">
            <p>We are migrating our content management to Contentful. Some admin features are being deprecated and will be removed in future updates.</p>
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
