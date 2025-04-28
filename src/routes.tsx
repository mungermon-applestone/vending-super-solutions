
import React from 'react';
import { RouteObject } from 'react-router-dom';
import ErrorPage from '@/components/ErrorPage';
import AdminPage from '@/pages/AdminPage';
import ContentfulConfigurationPage from '@/pages/ContentfulConfigurationPage';
import EnvironmentVariablesPage from '@/pages/admin/EnvironmentVariablesPage';
import AdminLayout from '@/components/AdminLayout';
import { adminRoutes } from '@/router/adminRoutes';
import RootLayout from '@/components/RootLayout';
import Index from '@/pages/Index';
import Products from '@/pages/Products';
import ProductDetailPage from '@/pages/ProductDetailPage';
import Machines from '@/pages/Machines';
import MachineDetailPage from '@/pages/MachineDetailPage';
import BusinessGoalsPage from '@/pages/BusinessGoalsPage';
import NotFound from '@/pages/NotFound';
import TechnologyPage from '@/pages/TechnologyPage';
import About from '@/pages/About';
import BlogPage from '@/pages/BlogPage';
import BlogPostDetail from '@/pages/BlogPostDetail';
import Contact from '@/pages/Contact';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: 'products',
        element: <Products />
      },
      {
        path: 'products/:productId',
        element: <ProductDetailPage />
      },
      {
        path: 'machines',
        element: <Machines />
      },
      {
        path: 'machines/:slug',
        element: <MachineDetailPage />
      },
      {
        path: 'machines/:machineType/:machineId',
        element: <MachineDetailPage />
      },
      {
        path: 'technology',
        element: <TechnologyPage />
      },
      {
        path: 'business-goals',
        element: <BusinessGoalsPage />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'blog',
        element: <BlogPage />
      },
      {
        path: 'blog/:slug',
        element: <BlogPostDetail />
      },
      {
        path: 'contact',
        element: <Contact />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminPage />
      },
      {
        path: 'contentful-config',
        element: <ContentfulConfigurationPage />
      },
      {
        path: 'environment-variables',
        element: <EnvironmentVariablesPage />
      },
      ...adminRoutes
    ]
  }
];

export default routes;
