import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';
import ProductsPage from '@/pages/ProductsPage';
import TechnologyPage from '@/pages/TechnologyPage';
import ContactPage from '@/pages/ContactPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import BusinessGoalsPage from '@/pages/BusinessGoalsPage';
import MachinesPage from '@/pages/MachinesPage';
import MachineDetail from '@/pages/MachineDetail';
import TechnologyDetail from '@/pages/TechnologyDetail';
import BusinessGoalDetail from '@/pages/BusinessGoalDetail';
import NotFoundPage from '@/pages/NotFoundPage';
import BlogPage from '@/pages/BlogPage';
import BlogPostDetail from '@/pages/BlogPostDetail';
import AboutUsPage from '@/pages/AboutUsPage';
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/technology" element={<TechnologyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/business-goals" element={<BusinessGoalsPage />} />
          <Route path="/machines" element={<MachinesPage />} />
          <Route path="/machines/:machineType/:machineId" element={<MachineDetail />} />
          <Route path="/technology/:slug" element={<TechnologyDetail />} />
          <Route path="/business-goals/:slug" element={<BusinessGoalDetail />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostDetail />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
