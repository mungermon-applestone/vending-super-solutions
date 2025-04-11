
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/providers/theme-provider';
import Index from './pages/Index';
import AboutUs from './pages/AboutUs';
import ProductsLanding from './pages/ProductsLanding';
import ProductDetail from './pages/ProductDetail';
import MachinesLanding from './pages/MachinesLanding';
import MachineDetail from './pages/MachineDetail';
import BusinessGoalsLanding from './pages/BusinessGoalsLanding';
import BusinessGoalDetail from './pages/BusinessGoalDetail';
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetail from './pages/CaseStudyDetail';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import TechnologyLanding from './pages/TechnologyLanding';
import SimpleTechnologyPage from './pages/SimpleTechnologyPage';
import Partner from './pages/Partner';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Admin Routes
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import ProductEditor from './pages/ProductEditor';
import AdminMachines from './pages/admin/AdminMachines';
import MachineEditor from './pages/MachineEditor';
import AdminBusinessGoals from './pages/admin/AdminBusinessGoals';
import BusinessGoalEditor from './pages/admin/BusinessGoalEditor';
import AdminTechnology from './pages/admin/AdminTechnology';
import TechnologyEditor from './pages/TechnologyEditor';
import AdminBlog from './pages/admin/AdminBlog';
import BlogEditor from './pages/admin/BlogEditor';
import AdminMedia from './pages/admin/AdminMedia';

// Migration routes
import MigrateTechnologyData from './pages/MigrateTechnologyData';
import MigrateMachinesData from './pages/MigrateMachinesData';
import MigrateBusinessGoalData from './pages/MigrateBusinessGoalData';

// Machine pages
import Option2WallMount from './pages/machines/Option2WallMount';
import Option2WallMountXL from './pages/machines/Option2WallMountXL';
import Locker10Cell from './pages/machines/Locker10Cell';
import Locker21Cell from './pages/machines/Locker21Cell';
import Option4Refrigerated from './pages/machines/Option4Refrigerated';
import DiviSS from './pages/machines/DiviSS';
import DiviSP from './pages/machines/DiviSP';
import DiviWS from './pages/machines/DiviWS';
import DiviWP from './pages/machines/DiviWP';
import Combi3000 from './pages/machines/Combi3000';

// UI Components
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/products" element={<ProductsLanding />} />
        <Route path="/products/:productSlug" element={<ProductDetail />} />
        <Route path="/machines" element={<MachinesLanding />} />
        <Route path="/machines/:machineSlug" element={<MachineDetail />} />
        <Route path="/business-goals" element={<BusinessGoalsLanding />} />
        <Route path="/business-goals/:businessGoalSlug" element={<BusinessGoalDetail />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/case-studies/:caseStudySlug" element={<CaseStudyDetail />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:postSlug" element={<BlogPost />} />
        <Route path="/technology" element={<TechnologyLanding />} />
        <Route path="/technology/:technologySlug" element={<SimpleTechnologyPage />} />
        <Route path="/partner" element={<Partner />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/:productSlug" element={<ProductEditor />} />
        <Route path="/admin/machines" element={<AdminMachines />} />
        <Route path="/admin/machines/:machineId" element={<MachineEditor />} />
        <Route path="/admin/business-goals" element={<AdminBusinessGoals />} />
        <Route path="/admin/business-goals/:goalSlug" element={<BusinessGoalEditor />} />
        <Route path="/admin/technology" element={<AdminTechnology />} />
        <Route path="/admin/technology/:technologySlug" element={<TechnologyEditor />} />
        <Route path="/admin/blog" element={<AdminBlog />} />
        <Route path="/admin/blog/:postId" element={<BlogEditor />} />
        <Route path="/admin/media" element={<AdminMedia />} />
        
        {/* Migration Routes */}
        <Route path="/admin/migrate/technologies" element={<MigrateTechnologyData />} />
        <Route path="/admin/migrate/machines" element={<MigrateMachinesData />} />
        <Route path="/admin/migrate/business-goals" element={<MigrateBusinessGoalData />} />

        {/* Static Machine Pages */}
        <Route path="/machines/option-2-wall-mount" element={<Option2WallMount />} />
        <Route path="/machines/option-2-wall-mount-xl" element={<Option2WallMountXL />} />
        <Route path="/machines/locker-10-cell" element={<Locker10Cell />} />
        <Route path="/machines/locker-21-cell" element={<Locker21Cell />} />
        <Route path="/machines/option-4-refrigerated" element={<Option4Refrigerated />} />
        <Route path="/machines/divi-ss" element={<DiviSS />} />
        <Route path="/machines/divi-sp" element={<DiviSP />} />
        <Route path="/machines/divi-ws" element={<DiviWS />} />
        <Route path="/machines/divi-wp" element={<DiviWP />} />
        <Route path="/machines/combi-3000" element={<Combi3000 />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-center" richColors />
      <ShadcnToaster />
    </ThemeProvider>
  );
}

export default App;
