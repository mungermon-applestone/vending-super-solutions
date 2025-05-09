
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
import ProductEditor from '@/pages/ProductEditor';
import MachineEditor from '@/pages/MachineEditor';
import TechnologyEditor from '@/pages/TechnologyEditor';
import BusinessGoalEditor from '@/pages/admin/BusinessGoalEditor';
import BlogEditor from '@/pages/admin/BlogEditor';
import LandingPageEditor from '@/pages/admin/LandingPageEditor';
import CaseStudyEditor from '@/pages/admin/CaseStudyEditor';
import StrapiSetupPage from '@/pages/admin/StrapiSetupPage';
import StrapiConnectionDebug from '@/pages/admin/StrapiConnectionDebug';

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
    element: <ProductEditor />
  },
  {
    path: "/admin/products/edit/:id",
    element: <ProductEditor />
  },
  {
    path: "/admin/machines",
    element: <AdminMachines />
  },
  {
    path: "/admin/machines/new",
    element: <MachineEditor />
  },
  {
    path: "/admin/machines/edit/:id",
    element: <MachineEditor />
  },
  {
    path: "/admin/technology",
    element: <AdminTechnology />
  },
  {
    path: "/admin/technology/new",
    element: <TechnologyEditor />
  },
  {
    path: "/admin/technology/edit/:id",
    element: <TechnologyEditor />
  },
  {
    path: "/admin/business-goals",
    element: <AdminBusinessGoals />
  },
  {
    path: "/admin/business-goals/new",
    element: <BusinessGoalEditor />
  },
  {
    path: "/admin/business-goals/edit/:id",
    element: <BusinessGoalEditor />
  },
  {
    path: "/admin/landing-pages",
    element: <AdminLandingPages />
  },
  {
    path: "/admin/landing-pages/new",
    element: <LandingPageEditor />
  },
  {
    path: "/admin/landing-pages/edit/:id",
    element: <LandingPageEditor />
  },
  {
    path: "/admin/blog",
    element: <AdminBlog />
  },
  {
    path: "/admin/blog/new",
    element: <BlogEditor />
  },
  {
    path: "/admin/blog/edit/:id",
    element: <BlogEditor />
  },
  {
    path: "/admin/case-studies",
    element: <AdminCaseStudies />
  },
  {
    path: "/admin/case-studies/new",
    element: <CaseStudyEditor />
  },
  {
    path: "/admin/case-studies/edit/:id",
    element: <CaseStudyEditor />
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
  },
  {
    path: "/admin/strapi-setup",
    element: <StrapiSetupPage />
  },
  {
    path: "/admin/strapi-debug",
    element: <StrapiConnectionDebug />
  }
];

export default adminRoutes;
