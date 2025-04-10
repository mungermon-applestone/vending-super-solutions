
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Partner from "./pages/Partner";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ProductsLanding from "./pages/ProductsLanding";
import ProductDetail from "./pages/ProductDetail";
import MachinesLanding from "./pages/MachinesLanding";
import MachineDetail from "./pages/MachineDetail";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import ProductEditor from "./pages/ProductEditor";
import BusinessGoalsLanding from "./pages/BusinessGoalsLanding";
import BusinessGoalDetail from "./pages/BusinessGoalDetail";
import SimpleTechnologyPage from "./pages/SimpleTechnologyPage";
import TechnologyEditor from "./pages/TechnologyEditor";
import CaseStudies from "./pages/CaseStudies";
import CaseStudyDetail from "./pages/CaseStudyDetail";

// Import specific machine pages
import DiviWP from "./pages/machines/DiviWP";
import DiviSP from "./pages/machines/DiviSP";
import DiviWS from "./pages/machines/DiviWS";
import DiviSS from "./pages/machines/DiviSS";
import Combi3000 from "./pages/machines/Combi3000";
import Option2WallMount from "./pages/machines/Option2WallMount";
import Option2WallMountXL from "./pages/machines/Option2WallMountXL";
import Option4Refrigerated from "./pages/machines/Option4Refrigerated";
import Locker10Cell from "./pages/machines/Locker10Cell";
import Locker21Cell from "./pages/machines/Locker21Cell";

// Admin routes
import AdminBusinessGoals from "./pages/admin/AdminBusinessGoals";
import BusinessGoalEditor from "./pages/admin/BusinessGoalEditor";
import MigrateMachinesData from "./pages/MigrateMachinesData";
import MigrateBusinessGoalData from "./pages/MigrateBusinessGoalData";
import MigrateTechnologyData from "./pages/MigrateTechnologyData";
import AdminMachines from "./pages/admin/AdminMachines";
import MachineEditor from "./pages/MachineEditor";
import AdminTechnology from "./pages/admin/AdminTechnology";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/partner" element={<Partner />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      
      {/* Product routes */}
      <Route path="/products" element={<ProductsLanding />} />
      <Route path="/products/:productSlug" element={<ProductDetail />} />
      
      {/* Machine routes */}
      <Route path="/machines" element={<MachinesLanding />} />
      <Route path="/machines/:machineType/:machineId" element={<MachineDetail />} />
      
      {/* Specific machine routes */}
      <Route path="/machines/divi-wp" element={<DiviWP />} />
      <Route path="/machines/divi-sp" element={<DiviSP />} />
      <Route path="/machines/divi-ws" element={<DiviWS />} />
      <Route path="/machines/divi-ss" element={<DiviSS />} />
      <Route path="/machines/combi-3000" element={<Combi3000 />} />
      <Route path="/machines/option-2-wall-mount" element={<Option2WallMount />} />
      <Route path="/machines/option-2-wall-mount-xl" element={<Option2WallMountXL />} />
      <Route path="/machines/option-4-refrigerated" element={<Option4Refrigerated />} />
      <Route path="/machines/locker-10-cell" element={<Locker10Cell />} />
      <Route path="/machines/locker-21-cell" element={<Locker21Cell />} />
      
      {/* Business Goals routes */}
      <Route path="/goals" element={<BusinessGoalsLanding />} />
      <Route path="/goals/:goalSlug" element={<BusinessGoalDetail />} />
      
      {/* Technology routes - making simple the default route */}
      <Route path="/technology" element={<SimpleTechnologyPage />} />
      <Route path="/technology/simple" element={<SimpleTechnologyPage />} />
      
      {/* Case Studies routes */}
      <Route path="/case-studies" element={<CaseStudies />} />
      <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
      
      {/* Admin routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/products/new" element={<ProductEditor />} />
      <Route path="/admin/products/edit/:slug" element={<ProductEditor />} />
      <Route path="/admin/business-goals" element={<AdminBusinessGoals />} />
      <Route path="/admin/business-goals/new" element={<BusinessGoalEditor />} />
      <Route path="/admin/business-goals/edit/:slug" element={<BusinessGoalEditor />} />
      <Route path="/admin/machines" element={<AdminMachines />} />
      <Route path="/admin/machines/new" element={<MachineEditor />} />
      <Route path="/admin/machines/edit/:id" element={<MachineEditor />} />
      <Route path="/admin/technology" element={<AdminTechnology />} />
      <Route path="/admin/technology/new" element={<TechnologyEditor />} />
      <Route path="/admin/technology/edit/:slug" element={<TechnologyEditor />} />
      
      {/* Migration utilities */}
      <Route path="/utils/migrate-machines" element={<MigrateMachinesData />} />
      <Route path="/utils/migrate-business-goals" element={<MigrateBusinessGoalData />} />
      <Route path="/utils/migrate-technologies" element={<MigrateTechnologyData />} />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
