
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminPage from './pages/AdminPage';
import ProductsPage from './pages/ProductsPage';
import ProductEditorPage from './pages/ProductEditor';
import BusinessGoalsPage from './pages/BusinessGoalsPage';
import BusinessGoalEditor from './pages/admin/BusinessGoalEditor';
import AdminDashboard from './pages/AdminDashboard';
import AdminMedia from './pages/admin/AdminMedia';
import DeprecationStatsPage from './pages/admin/DeprecationStatsPage';
import ContentfulMigrationGuide from './pages/admin/ContentfulMigrationGuide';
import ContentfulConfigurationPage from './pages/ContentfulConfigurationPage';

function App() {
  return (
    <Routes>
      {/* Root Route - Redirect to admin */}
      <Route path="/" element={<Navigate to="/admin" />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<ProductsPage />} />
      <Route path="/admin/products/:slug" element={<ProductEditorPage />} />
      <Route path="/admin/business-goals" element={<BusinessGoalsPage />} />
      <Route path="/admin/business-goals/:slug" element={<BusinessGoalEditor />} />
      <Route path="/admin/contentful" element={<ContentfulConfigurationPage />} />
      <Route path="/admin/media" element={<AdminMedia />} />
      <Route path="/admin/deprecation-stats" element={<DeprecationStatsPage />} />
      <Route path="/admin/contentful-migration-guide" element={<ContentfulMigrationGuide />} />
    </Routes>
  );
}

export default App;
