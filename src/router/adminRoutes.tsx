
import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load admin pages
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'));
const ProductEditor = lazy(() => import('@/pages/ProductEditor'));
const AdminBusinessGoals = lazy(() => import('@/pages/AdminBusinessGoals'));
const BusinessGoalEditor = lazy(() => import('@/pages/BusinessGoalEditor'));
const AdminMachines = lazy(() => import('@/pages/admin/AdminMachines'));
const MachineEditor = lazy(() => import('@/pages/MachineEditor'));
const AdminTechnology = lazy(() => import('@/pages/AdminTechnology'));
const TechnologyEditor = lazy(() => import('@/pages/TechnologyEditor'));
const AdminBlog = lazy(() => import('@/pages/admin/AdminBlog'));
const AdminCaseStudies = lazy(() => import('@/pages/admin/AdminCaseStudies'));
const AdminMedia = lazy(() => import('@/pages/admin/AdminMedia'));
const ContentfulManagement = lazy(() => import('@/pages/admin/ContentfulManagement'));
const SignInPage = lazy(() => import('@/pages/admin/SignInPage'));

// Admin routes
export const adminRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: <AdminDashboard />,
  },
  // Product routes
  {
    path: 'products',
    element: <AdminProducts />,
  },
  {
    path: 'products/new',
    element: <ProductEditor />,
  },
  {
    path: 'products/edit/:slug',
    element: <ProductEditor />,
  },
  // Business goals routes
  {
    path: 'business-goals',
    element: <AdminBusinessGoals />,
  },
  {
    path: 'business-goals/new',
    element: <BusinessGoalEditor />,
  },
  {
    path: 'business-goals/edit/:slug',
    element: <BusinessGoalEditor />,
  },
  // Machine routes
  {
    path: 'machines',
    element: <AdminMachines />,
  },
  {
    path: 'machines/new',
    element: <MachineEditor />,
  },
  {
    path: 'machines/edit/:machineId',
    element: <MachineEditor />,
  },
  // Technology routes
  {
    path: 'technology',
    element: <AdminTechnology />,
  },
  {
    path: 'technology/new',
    element: <TechnologyEditor />,
  },
  {
    path: 'technology/edit/:technologySlug',
    element: <TechnologyEditor />,
  },
  // Blog routes
  {
    path: 'blog',
    element: <AdminBlog />,
  },
  // Case studies routes
  {
    path: 'case-studies',
    element: <AdminCaseStudies />,
  },
  // Media routes
  {
    path: 'media',
    element: <AdminMedia />,
  },
  // Contentful management
  {
    path: 'contentful',
    element: <ContentfulManagement />,
  },
  // Auth routes
  {
    path: 'sign-in',
    element: <SignInPage />,
  },
];
