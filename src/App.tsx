import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Technologies from './pages/Technologies';
import CaseStudies from './pages/CaseStudies';
import Blog from './pages/Blog';
import Careers from './pages/Careers';
import MachinePage from './pages/MachinePage';
import TechnologyPage from './pages/TechnologyPage';
import NotFound from './pages/NotFound';
import ProductTypePage from './pages/ProductTypePage';
import BusinessGoalPage from './pages/BusinessGoalPage';
import TestimonialPage from './pages/TestimonialPage';
import CaseStudyPage from './pages/CaseStudyPage';
import BlogPostPage from './pages/BlogPostPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSettings from './pages/admin/AdminSettings';
import StrapiIntegration from './pages/admin/StrapiIntegration';
import StrapiConfig from './pages/admin/StrapiConfig';
import TechnologyList from './pages/admin/technology/TechnologyList';
import TechnologyEdit from './pages/admin/technology/TechnologyEdit';
import TechnologyCreate from './pages/admin/technology/TechnologyCreate';

// We need to modify the routes to add our Strapi configuration page
function App() {
  // Check if we are in a development environment
  const isDevelopment = import.meta.env.DEV;
  
  return (
    <Router>
      <Routes>
        {/* Standard Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/technologies" element={<Technologies />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/careers" element={<Careers />} />
        
        {/* Dynamic Content Pages */}
        <Route path="/machines/:slug" element={<MachinePage />} />
        <Route path="/technologies/:slug" element={<TechnologyPage />} />
        <Route path="/product-types/:slug" element={<ProductTypePage />} />
        <Route path="/business-goals/:slug" element={<BusinessGoalPage />} />
        <Route path="/testimonials/:slug" element={<TestimonialPage />} />
        <Route path="/case-studies/:slug" element={<CaseStudyPage />} />
        <Route path="/blog-posts/:slug" element={<BlogPostPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/strapi" element={<StrapiIntegration />} />
        <Route path="/admin/strapi-config" element={<StrapiConfig />} />
        
        {/* Technology Admin Routes */}
        <Route path="/admin/technology" element={<TechnologyList />} />
        <Route path="/admin/technology/new" element={<TechnologyCreate />} />
        <Route path="/admin/technology/:id/edit" element={<TechnologyEdit />} />
        
        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
