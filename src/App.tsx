
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';
import ProductsPage from '@/pages/ProductsPage';
import TechnologyPage from '@/pages/TechnologyPage';
import Contact from '@/pages/Contact';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import BusinessGoalsPage from '@/pages/BusinessGoalsPage';
import MachinesPage from '@/pages/MachinesPage';
import MachineDetail from '@/pages/MachineDetail';
import TechnologyDetail from '@/pages/TechnologyDetail';
import BusinessGoalDetail from '@/pages/BusinessGoalDetail';
import NotFound from '@/pages/NotFound';
import BlogPage from '@/pages/BlogPage';
import BlogPostDetail from '@/pages/BlogPostDetail';
import AboutUs from '@/pages/AboutUs';
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/technology" element={<TechnologyPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/business-goals" element={<BusinessGoalsPage />} />
          <Route path="/machines" element={<MachinesPage />} />
          <Route path="/machines/:machineType/:machineId" element={<MachineDetail />} />
          <Route path="/technology/:slug" element={<TechnologyDetail />} />
          <Route path="/business-goals/:slug" element={<BusinessGoalDetail />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostDetail />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
