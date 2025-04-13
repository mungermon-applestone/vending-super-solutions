
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSettings from './pages/admin/AdminSettings';
import StrapiIntegration from './pages/admin/StrapiIntegration';
import StrapiConfig from './pages/admin/StrapiConfig';
import TechnologyList from './pages/admin/technology/TechnologyList';
import TechnologyLanding from './pages/TechnologyLanding';
import TechnologyDetail from './pages/TechnologyDetail';
import ProductsLanding from './pages/ProductsLanding';

function App() {
  // Check if we are in a development environment
  const isDevelopment = import.meta.env.DEV;
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<TechnologyLanding />} />
      <Route path="/technology" element={<TechnologyLanding />} />
      <Route path="/technology/:slug" element={<TechnologyDetail />} />
      <Route path="/products" element={<ProductsLanding />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/admin/strapi" element={<StrapiIntegration />} />
      <Route path="/admin/strapi-config" element={<StrapiConfig />} />
      
      {/* Technology Admin Routes */}
      <Route path="/admin/technology" element={<TechnologyList />} />
      
      {/* Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
