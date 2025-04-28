
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
import Machines from '@/pages/Machines';
import BusinessGoalsPage from '@/pages/BusinessGoalsPage';
import NotFound from '@/pages/NotFound';
import TechnologyPage from '@/pages/TechnologyPage';

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
        path: 'machines',
        element: <Machines />
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
