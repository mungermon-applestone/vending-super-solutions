import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CMSProvider } from "@/context/CMSContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductsLanding from "./pages/ProductsLanding";
import ProductDetail from "./pages/ProductDetail";
import ProductEditor from "./pages/ProductEditor";
import MachinesLanding from "./pages/MachinesLanding";
import MachineDetail from "./pages/MachineDetail";
import MachineEditor from "./pages/MachineEditor";
import MigrateMachinesData from "./pages/MigrateMachinesData";
import MigrateTechnologyData from "./pages/MigrateTechnologyData";
import AdminMachines from "./pages/AdminMachines";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTechnology from "./pages/AdminTechnology";
import TechnologyLanding from "./pages/TechnologyLanding";
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import CaseStudies from "./pages/CaseStudies";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import Contact from "./pages/Contact";
import Partner from "./pages/Partner";
import BusinessGoalsLanding from "./pages/BusinessGoalsLanding";
import BusinessGoalDetail from "./pages/BusinessGoalDetail";
import AdminProducts from "./pages/AdminProducts";
import AdminBusinessGoals from "./pages/AdminBusinessGoals";
import BusinessGoalEditor from "./pages/BusinessGoalEditor";

// Import individual machine pages
import Option4Refrigerated from "./pages/machines/Option4Refrigerated";
import Option2WallMountXL from "./pages/machines/Option2WallMountXL";
import Option2WallMount from "./pages/machines/Option2WallMount";
import DiviSS from "./pages/machines/DiviSS";
import DiviWP from "./pages/machines/DiviWP";
import DiviWS from "./pages/machines/DiviWS";
import DiviSP from "./pages/machines/DiviSP";
import Combi3000 from "./pages/machines/Combi3000";
import Locker10Cell from "./pages/machines/Locker10Cell";
import Locker21Cell from "./pages/machines/Locker21Cell";

// Create a route logger component
const RouteLogger = () => {
  const location = useLocation();
  
  React.useEffect(() => {
    console.log(`Route changed to: ${location.pathname}`);
    console.log(`Route params:`, location);
  }, [location]);
  
  return null;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1, // Only retry once
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CMSProvider>
        <BrowserRouter>
          <RouteLogger />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<ProductsLanding />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products/new" element={<ProductEditor />} />
            <Route path="/admin/products/edit/:productSlug" element={<ProductEditor />} />
            <Route path="/admin/business-goals" element={<AdminBusinessGoals />} />
            <Route path="/admin/business-goals/new" element={<BusinessGoalEditor />} />
            <Route path="/admin/business-goals/edit/:goalSlug" element={<BusinessGoalEditor />} />
            <Route path="/admin/machines" element={<AdminMachines />} />
            <Route path="/admin/machines/new" element={<MachineEditor />} />
            <Route path="/admin/machines/edit/:machineId" element={<MachineEditor />} />
            <Route path="/admin/machines/migrate" element={<MigrateMachinesData />} />
            <Route path="/admin/technology" element={<AdminTechnology />} />
            <Route path="/admin/technology/migrate" element={<MigrateTechnologyData />} />
            
            {/* Specific product type routes */}
            <Route path="/products/grocery" element={<ProductDetail />} />
            <Route path="/products/vape" element={<ProductDetail />} />
            <Route path="/products/cannabis" element={<ProductDetail />} />
            <Route path="/products/fresh-food" element={<ProductDetail />} />
            <Route path="/products/cosmetics" element={<ProductDetail />} />
            <Route path="/products/collectibles" element={<ProductDetail />} />
            <Route path="/products/otc" element={<ProductDetail />} />
            <Route path="/products/swag" element={<ProductDetail />} />
            
            {/* Keep the dynamic route as fallback for any other product types */}
            <Route path="/products/:productType" element={<ProductDetail />} />
            
            <Route path="/machines" element={<MachinesLanding />} />
            
            {/* General machine detail page (falling back to CMS data) */}
            <Route path="/machines/:machineType/:machineId" element={<MachineDetail />} />
            
            {/* Individual machine pages with specific content */}
            <Route path="/machines/vending/option-4-refrigerated" element={<Option4Refrigerated />} />
            <Route path="/machines/vending/option-2-wall-mount-xl" element={<Option2WallMountXL />} />
            <Route path="/machines/vending/option-2-wall-mount" element={<Option2WallMount />} />
            <Route path="/machines/vending/divi-ss" element={<DiviSS />} />
            <Route path="/machines/vending/divi-wp" element={<DiviWP />} />
            <Route path="/machines/vending/divi-ws" element={<DiviWS />} />
            <Route path="/machines/vending/divi-sp" element={<DiviSP />} />
            <Route path="/machines/vending/combi-3000" element={<Combi3000 />} />
            <Route path="/machines/locker/10-cell-temperature-controlled" element={<Locker10Cell />} />
            <Route path="/machines/locker/21-cell-temperature-controlled" element={<Locker21Cell />} />
            
            <Route path="/technology" element={<TechnologyLanding />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/goals" element={<BusinessGoalsLanding />} />
            <Route path="/goals/:goalSlug" element={<BusinessGoalDetail />} />
            
            {/* Create a dedicated 404 route and a catch-all */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CMSProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
