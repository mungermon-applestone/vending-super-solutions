
import React from 'react';
import { RouteObject } from 'react-router-dom';
import ErrorPage from '@/components/ErrorPage';
import AdminPage from '@/pages/AdminPage';
import ContentfulConfigurationPage from '@/pages/ContentfulConfigurationPage';
import EnvironmentVariablesPage from '@/pages/admin/EnvironmentVariablesPage';

// Define the routes for the application
const routes: RouteObject[] = [
  {
    path: '/',
    element: <div>Home Page</div>, // Simple placeholder
    errorElement: <ErrorPage />
  },
  {
    path: '/admin',
    element: <AdminPage />
  },
  {
    path: '/admin/contentful-config',
    element: <ContentfulConfigurationPage />
  },
  {
    path: '/admin/environment-variables',
    element: <EnvironmentVariablesPage />
  }
];

export default routes;
