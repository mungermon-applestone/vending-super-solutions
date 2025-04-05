import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CMSProvider } from "@/context/CMSContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductsLanding from "./pages/ProductsLanding";
import ProductDetail from "./pages/ProductDetail";
import MachinesLanding from "./pages/MachinesLanding";
import MachineDetail from "./pages/MachineDetail";
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
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<ProductsLanding />} />
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
            
            {/* Handle 404 routes - as catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CMSProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
