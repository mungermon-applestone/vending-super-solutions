
import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminMachines from '@/pages/admin/AdminMachines';
import AdminTechnology from '@/pages/admin/AdminTechnology';
import AdminBusinessGoals from '@/pages/admin/AdminBusinessGoals';
import AdminLandingPages from '@/pages/admin/AdminLandingPages';
import AdminBlog from '@/pages/admin/AdminBlog';
import AdminCaseStudies from '@/pages/admin/AdminCaseStudies';
import AdminMedia from '@/pages/admin/AdminMedia';
import SignIn from '@/pages/admin/SignIn';
import ContentfulManagement from '@/pages/admin/ContentfulManagement';
import PerformanceTesting from '@/pages/admin/PerformanceTesting';
import ContentfulRedirector from '@/components/admin/contentful/ContentfulRedirector';

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <Navigate to="/admin/dashboard" replace />
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />
  },
  {
    path: "/admin/products",
    element: <AdminProducts />
  },
  {
    path: "/admin/products/new",
    element: <ContentfulRedirector 
      contentType="Product" 
      title="Create New Product"
      description="Product creation has been moved to Contentful CMS. Please use Contentful to create and manage products."
      backPath="/admin/products"
    />
  },
  {
    path: "/admin/products/edit/:id",
    element: <ContentfulRedirector 
      contentType="Product" 
      title="Edit Product"
      description="Product editing has been moved to Contentful CMS. Please use Contentful to edit products."
      backPath="/admin/products"
    />
  },
  {
    path: "/admin/machines",
    element: <AdminMachines />
  },
  {
    path: "/admin/machines/new",
    element: <ContentfulRedirector 
      contentType="Machine" 
      title="Create New Machine"
      description="Machine creation has been moved to Contentful CMS. Please use Contentful to create and manage machines."
      backPath="/admin/machines"
    />
  },
  {
    path: "/admin/machines/edit/:id",
    element: <ContentfulRedirector 
      contentType="Machine" 
      title="Edit Machine"
      description="Machine editing has been moved to Contentful CMS. Please use Contentful to edit machines."
      backPath="/admin/machines"
    />
  },
  {
    path: "/admin/technology",
    element: <AdminTechnology />
  },
  {
    path: "/admin/technology/new",
    element: <ContentfulRedirector 
      contentType="Technology" 
      title="Create New Technology"
      description="Technology creation has been moved to Contentful CMS. Please use Contentful to create and manage technologies."
      backPath="/admin/technology"
    />
  },
  {
    path: "/admin/technology/edit/:id",
    element: <ContentfulRedirector 
      contentType="Technology" 
      title="Edit Technology"
      description="Technology editing has been moved to Contentful CMS. Please use Contentful to edit technologies."
      backPath="/admin/technology"
    />
  },
  {
    path: "/admin/business-goals",
    element: <AdminBusinessGoals />
  },
  {
    path: "/admin/business-goals/new",
    element: <ContentfulRedirector 
      contentType="Business Goal" 
      title="Create New Business Goal"
      description="Business goal creation has been moved to Contentful CMS. Please use Contentful to create and manage business goals."
      backPath="/admin/business-goals"
    />
  },
  {
    path: "/admin/business-goals/edit/:id",
    element: <ContentfulRedirector 
      contentType="Business Goal" 
      title="Edit Business Goal"
      description="Business goal editing has been moved to Contentful CMS. Please use Contentful to edit business goals."
      backPath="/admin/business-goals"
    />
  },
  {
    path: "/admin/landing-pages",
    element: <AdminLandingPages />
  },
  {
    path: "/admin/landing-pages/new",
    element: <ContentfulRedirector
      contentType="Landing Page"
      title="Create New Landing Page"
      description="Landing page creation has been moved to Contentful CMS. Please use Contentful to create and manage landing pages."
      backPath="/admin/landing-pages"
    />
  },
  {
    path: "/admin/landing-pages/edit/:id",
    element: <ContentfulRedirector 
      contentType="Landing Page"
      title="Edit Landing Page"
      description="Landing page editing has been moved to Contentful CMS. Please use Contentful to edit landing pages."
      backPath="/admin/landing-pages"
    />
  },
  {
    path: "/admin/blog",
    element: <AdminBlog />
  },
  {
    path: "/admin/blog/new",
    element: <ContentfulRedirector
      contentType="Blog Post"
      title="Create New Blog Post"
      description="Blog post creation has been moved to Contentful CMS. Please use Contentful to create and manage blog posts."
      backPath="/admin/blog"
    />
  },
  {
    path: "/admin/blog/edit/:id",
    element: <ContentfulRedirector
      contentType="Blog Post"
      title="Edit Blog Post"
      description="Blog post editing has been moved to Contentful CMS. Please use Contentful to edit blog posts."
      backPath="/admin/blog"
    />
  },
  {
    path: "/admin/case-studies",
    element: <AdminCaseStudies />
  },
  {
    path: "/admin/case-studies/new",
    element: <ContentfulRedirector
      contentType="Case Study"
      title="Create New Case Study"
      description="Case study creation has been moved to Contentful CMS. Please use Contentful to create and manage case studies."
      backPath="/admin/case-studies"
    />
  },
  {
    path: "/admin/case-studies/edit/:id",
    element: <ContentfulRedirector
      contentType="Case Study"
      title="Edit Case Study"
      description="Case study editing has been moved to Contentful CMS. Please use Contentful to edit case studies."
      backPath="/admin/case-studies"
    />
  },
  {
    path: "/admin/media",
    element: <AdminMedia />
  },
  {
    path: "/admin/sign-in",
    element: <SignIn />
  },
  {
    path: "/admin/contentful",
    element: <ContentfulManagement />
  },
  {
    path: "/admin/performance-testing",
    element: <PerformanceTesting />
  }
];

export default adminRoutes;
