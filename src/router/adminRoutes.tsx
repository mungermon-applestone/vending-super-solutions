
import React from 'react';
import { Route } from 'react-router-dom';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminMachines from '@/pages/admin/AdminMachines';
import AdminTechnology from '@/pages/admin/AdminTechnology';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminBusinessGoals from '@/pages/admin/AdminBusinessGoals';
import AdminSettings from '@/pages/admin/AdminSettings';
import StrapiIntegration from '@/pages/admin/StrapiIntegration';

// Import other admin pages as needed

/**
 * Admin routes configuration
 */
export const adminRoutes = (
  <Route path="/admin">
    <Route index element={<AdminDashboard />} />
    <Route path="machines" element={<AdminMachines />} />
    <Route path="technology" element={<AdminTechnology />} />
    <Route path="products" element={<AdminProducts />} />
    <Route path="business-goals" element={<AdminBusinessGoals />} />
    <Route path="settings" element={<AdminSettings />} />
    <Route path="strapi" element={<StrapiIntegration />} />
    {/* Add other admin routes as needed */}
  </Route>
);
