
import React from 'react';
import { RouteObject } from 'react-router-dom';
import AdminPage from '@/pages/AdminPage';

// Simplified admin routes - just the main redirect page
export const adminRoutes: RouteObject[] = [
  {
    path: "/admin/*",
    element: <AdminPage />
  }
];

export default adminRoutes;
