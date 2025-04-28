
import React from 'react';
import { RouteObject } from 'react-router-dom';
import ErrorPage from '@/components/ErrorPage';
import AdminPage from '@/pages/AdminPage';
import ContentfulConfigurationPage from '@/pages/ContentfulConfigurationPage';
import EnvironmentVariablesPage from '@/pages/admin/EnvironmentVariablesPage';
import AdminLayout from '@/components/AdminLayout';
import { adminRoutes } from '@/router/adminRoutes';

// Define the routes for the application
const routes: RouteObject[] = [
  {
    path: '/',
    element: <div>Home Page</div>, // Simple placeholder
    errorElement: <ErrorPage />
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
