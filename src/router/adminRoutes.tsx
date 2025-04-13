
import React from 'react';
import { Route } from 'react-router-dom';
import AdminHome from '@/pages/admin/AdminHome';
import AdminMachines from '@/pages/admin/AdminMachines';
import AdminTechnologies from '@/pages/admin/AdminTechnologies';
import AdminBusinessGoals from '@/pages/admin/AdminBusinessGoals';
import AdminProductTypes from '@/pages/admin/AdminProductTypes';
import AdminSettings from '@/pages/admin/AdminSettings';
import StrapiIntegration from '@/pages/admin/StrapiIntegration';

// Import other admin pages as needed

/**
 * Admin routes configuration
 */
export const adminRoutes = (
  <Route path="/admin">
    <Route index element={<AdminHome />} />
    <Route path="machines" element={<AdminMachines />} />
    <Route path="technologies" element={<AdminTechnologies />} />
    <Route path="business-goals" element={<AdminBusinessGoals />} />
    <Route path="product-types" element={<AdminProductTypes />} />
    <Route path="settings" element={<AdminSettings />} />
    <Route path="strapi" element={<StrapiIntegration />} />
    {/* Add other admin routes as needed */}
  </Route>
);
