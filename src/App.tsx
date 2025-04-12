
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import NotFound from './pages/NotFound';
import { Toaster } from "@/components/ui/toaster";

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
import AdminCaseStudies from './pages/admin/AdminCaseStudies';
import AdminLandingPages from './pages/admin/AdminLandingPages';
import ProductEditor from './pages/ProductEditor';
import MachineEditor from './pages/MachineEditor';
import TechnologyEditor from './pages/TechnologyEditor';
import CaseStudyEditor from './pages/admin/CaseStudyEditor';
import LandingPageEditor from './pages/admin/LandingPageEditor';

// Public pages
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetail from './pages/CaseStudyDetail';
import MachinesLanding from './pages/MachinesLanding';
import MachineDetail from './pages/MachineDetail';
import BlogPostDetail from './pages/BlogPostDetail';
import Blog from './pages/Blog';
import BusinessGoalEditor from './pages/admin/BusinessGoalEditor';
import BlogEditor from './pages/admin/BlogEditor';
import TechnologyDetail from './pages/TechnologyDetail';
import TechnologyLanding from './pages/TechnologyLanding';
import SimpleTechnologyPage from './pages/SimpleTechnologyPage';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import BusinessGoalsLanding from './pages/BusinessGoalsLanding';
import BusinessGoalDetail from './pages/BusinessGoalDetail';
import ProductDetail from './pages/ProductDetail'; // Import the ProductDetail component
import ProductsLanding from './pages/ProductsLanding'; // Import the ProductsLanding component

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/products" element={<ProductsLanding />} />
          <Route path="/products/:productSlug" element={<ProductDetail />} />
          <Route path="/machines" element={<MachinesLanding />} />
          <Route path="/machines/:machineType/:machineId" element={<MachineDetail />} />
          <Route path="/business-goals" element={<BusinessGoalsLanding />} />
          <Route path="/goals" element={<BusinessGoalsLanding />} />
          <Route path="/goals/:goalSlug" element={<BusinessGoalDetail />} />
          <Route path="/technology" element={<TechnologyLanding />} />
          <Route path="/technology/simple" element={<SimpleTechnologyPage />} />
          <Route path="/technology/:slug" element={<TechnologyDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPostDetail />} />
          
          {/* Case Studies routes */}
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
          
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
          <Route path="/admin/business-goals/new" element={<BusinessGoalEditor />} />
          <Route path="/admin/business-goals/edit/:goalSlug" element={<BusinessGoalEditor />} />
          <Route path="/admin/technology" element={<AdminTechnology />} />
          <Route path="/admin/technology/new" element={<TechnologyEditor />} />
          <Route path="/admin/technology/edit/:technologySlug" element={<TechnologyEditor />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/blog/new" element={<BlogEditor />} />
          <Route path="/admin/blog/edit/:postId" element={<BlogEditor />} />
          <Route path="/admin/media" element={<AdminMedia />} />
          <Route path="/admin/case-studies" element={<AdminCaseStudies />} />
          <Route path="/admin/case-studies/new" element={<CaseStudyEditor />} />
          <Route path="/admin/case-studies/edit/:caseStudySlug" element={<CaseStudyEditor />} />
          <Route path="/admin/landing-pages" element={<AdminLandingPages />} />
          <Route path="/admin/landing-pages/new" element={<LandingPageEditor />} />
          <Route path="/admin/landing-pages/edit/:id" element={<LandingPageEditor />} />
          
          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;
