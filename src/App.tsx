import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Public Pages
import Homepage from './pages/Homepage';
import Products from './pages/Products';
import Machines from './pages/Machines';
import BusinessGoals from './pages/BusinessGoals';
import Technology from './pages/Technology';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import ProductEditor from './pages/ProductEditor';
import AdminMachines from './pages/admin/AdminMachines';
import MachineForm from './pages/MachineForm';
import AdminBusinessGoals from './pages/admin/AdminBusinessGoals';
import BusinessGoalEditor from './pages/BusinessGoalEditor';
import AdminTechnology from './pages/admin/AdminTechnology';
import TechnologyEditor from './pages/TechnologyEditor';
import AdminBlog from './pages/admin/AdminBlog';
import BlogPostEditor from './pages/admin/BlogPostEditor';
import AdminMedia from './pages/admin/AdminMedia';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/machines" element={<Machines />} />
        <Route path="/business-goals" element={<BusinessGoals />} />
        <Route path="/technology" element={<Technology />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:postSlug" element={<BlogPost />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<ProductEditor />} />
        <Route path="/admin/products/edit/:productSlug" element={<ProductEditor />} />
        <Route path="/admin/machines" element={<AdminMachines />} />
        <Route path="/admin/machines/new" element={<MachineForm />} />
        <Route path="/admin/machines/edit/:machineId" element={<MachineForm />} />
        <Route path="/admin/business-goals" element={<AdminBusinessGoals />} />
        <Route path="/admin/business-goals/new" element={<BusinessGoalEditor />} />
        <Route path="/admin/business-goals/edit/:goalSlug" element={<BusinessGoalEditor />} />
        <Route path="/admin/technology" element={<AdminTechnology />} />
        <Route path="/admin/technology/new" element={<TechnologyEditor />} />
        <Route path="/admin/technology/edit/:technologySlug" element={<TechnologyEditor />} />
        <Route path="/admin/blog" element={<AdminBlog />} />
        <Route path="/admin/blog/new" element={<BlogPostEditor />} />
        <Route path="/admin/blog/edit/:postSlug" element={<BlogPostEditor />} />
        <Route path="/admin/media" element={<AdminMedia />} />
        
        {/* 404 fallback */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;
