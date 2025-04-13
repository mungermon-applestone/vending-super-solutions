
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSettings from './pages/admin/AdminSettings';
import StrapiIntegration from './pages/admin/StrapiIntegration';
import StrapiConfig from './pages/admin/StrapiConfig';
import TechnologyList from './pages/admin/technology/TechnologyList';

// We need to modify the routes to add our Strapi configuration page
function App() {
  // Check if we are in a development environment
  const isDevelopment = import.meta.env.DEV;
  
  return (
    <Router>
      <Routes>
        {/* Only include routes for pages that actually exist */}
        
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
    </Router>
  );
}

export default App;
