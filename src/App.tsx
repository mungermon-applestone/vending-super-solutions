
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import NotFound from './pages/NotFound';

// Import the homepage component
import Homepage from './pages/Homepage';

// Import auth components
import SignIn from './pages/admin/SignIn';
import AdminUsers from './pages/admin/AdminUsers';
import { AuthProvider } from './context/AuthContext';

// We'll need a placeholder component for routes we don't have yet
const PlaceholderPage = () => (
  <div className="container py-10">
    <h1 className="text-2xl font-bold">Page Not Implemented Yet</h1>
    <p className="mt-4">This page is under development.</p>
  </div>
);

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminMachines from './pages/admin/AdminMachines';
import AdminBusinessGoals from './pages/admin/AdminBusinessGoals';
import AdminTechnology from './pages/admin/AdminTechnology';
import AdminBlog from './pages/admin/AdminBlog';
import AdminMedia from './pages/admin/AdminMedia';
import ProductEditor from './pages/ProductEditor';
import MachineEditor from './pages/MachineEditor';
import TechnologyEditor from './pages/TechnologyEditor';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/products" element={<PlaceholderPage />} />
          <Route path="/machines" element={<PlaceholderPage />} />
          <Route path="/business-goals" element={<PlaceholderPage />} />
          <Route path="/technology" element={<PlaceholderPage />} />
          <Route path="/contact" element={<PlaceholderPage />} />
          <Route path="/blog" element={<PlaceholderPage />} />
          <Route path="/blog/:postSlug" element={<PlaceholderPage />} />
          
          {/* Auth routes */}
          <Route path="/admin/sign-in" element={<SignIn />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/new" element={<ProductEditor />} />
          <Route path="/admin/products/edit/:productSlug" element={<ProductEditor />} />
          <Route path="/admin/machines" element={<AdminMachines />} />
          <Route path="/admin/machines/new" element={<MachineEditor />} />
          <Route path="/admin/machines/edit/:machineId" element={<MachineEditor />} />
          <Route path="/admin/business-goals" element={<AdminBusinessGoals />} />
          <Route path="/admin/business-goals/new" element={<PlaceholderPage />} />
          <Route path="/admin/business-goals/edit/:goalSlug" element={<PlaceholderPage />} />
          <Route path="/admin/technology" element={<AdminTechnology />} />
          <Route path="/admin/technology/new" element={<TechnologyEditor />} />
          <Route path="/admin/technology/edit/:technologySlug" element={<TechnologyEditor />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/blog/new" element={<PlaceholderPage />} />
          <Route path="/admin/blog/edit/:postSlug" element={<PlaceholderPage />} />
          <Route path="/admin/media" element={<AdminMedia />} />
          
          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
