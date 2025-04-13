import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Partner from './pages/Partner';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProductsLanding from './pages/ProductsLanding';
import ProductDetail from './pages/ProductDetail';
import MachinesLanding from './pages/MachinesLanding';
import MachineDetail from './pages/MachineDetail';
import BusinessGoalsLanding from './pages/BusinessGoalsLanding';
import BusinessGoalDetail from './pages/BusinessGoalDetail';
import TechnologyLanding from './pages/TechnologyLanding';
import TechnologyDetail from './pages/TechnologyDetail';
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetail from './pages/CaseStudyDetail';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import BlogPostDetail from './pages/BlogPostDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import ProductEditor from './pages/ProductEditor';
import AdminMachines from './pages/admin/AdminMachines';
import MachineEditor from './pages/MachineEditor';
import AdminBusinessGoals from './pages/admin/AdminBusinessGoals';
import BusinessGoalEditor from './pages/BusinessGoalEditor';
import AdminTechnology from './pages/admin/AdminTechnology';
import TechnologyEditor from './pages/TechnologyEditor';
import AdminCaseStudies from './pages/admin/AdminCaseStudies';
import CaseStudyEditor from './pages/CaseStudyEditor';
import AdminBlog from './pages/admin/AdminBlog';
import BlogEditor from './pages/BlogEditor';
import AdminLandingPages from './pages/admin/AdminLandingPages';
import LandingPageEditor from './pages/LandingPageEditor';
import AdminUsers from './pages/admin/AdminUsers';
import AdminMedia from './pages/admin/AdminMedia';
import SignIn from './pages/admin/SignIn';
import NotFound from './pages/NotFound';
import DiviSP from './pages/machines/DiviSP';
import DiviSS from './pages/machines/DiviSS';
import DiviWP from './pages/machines/DiviWP';
import DiviWS from './pages/machines/DiviWS';
import Combi3000 from './pages/machines/Combi3000';
import Option2WallMount from './pages/machines/Option2WallMount';
import Option2WallMountXL from './pages/machines/Option2WallMountXL';
import Option4Refrigerated from './pages/machines/Option4Refrigerated';
import Locker10Cell from './pages/machines/Locker10Cell';
import Locker21Cell from './pages/machines/Locker21Cell';
import MigrateMachinesData from './pages/admin/MigrateMachinesData';
import MigrateBusinessGoalData from './pages/admin/MigrateBusinessGoalData';
import MigrateTechnologyData from './pages/admin/MigrateTechnologyData';
import SimpleTechnologyPage from './pages/SimpleTechnologyPage';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/partner" element={<Partner />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/products" element={<ProductsLanding />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/machines" element={<MachinesLanding />} />
        <Route path="/machines/:slug" element={<MachineDetail />} />
        <Route path="/business-goals" element={<BusinessGoalsLanding />} />
        <Route path="/business-goals/:slug" element={<BusinessGoalDetail />} />
        <Route path="/technology" element={<TechnologyLanding />} />
        <Route path="/technology/:slug" element={<TechnologyDetail />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/blogs/:slug" element={<BlogPostDetail />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/:productSlug" element={<ProductEditor />} />
        <Route path="/admin/machines" element={<AdminMachines />} />
        <Route path="/admin/machines/:machineId" element={<MachineEditor />} />
        <Route path="/admin/business-goals" element={<AdminBusinessGoals />} />
        <Route path="/admin/business-goals/:businessGoalSlug" element={<BusinessGoalEditor />} />
        <Route path="/admin/technology" element={<AdminTechnology />} />
        <Route path="/admin/technology/edit/:technologySlug" element={<TechnologyEditor />} />
        <Route path="/admin/technology/new" element={<TechnologyEditor />} />
        <Route path="/admin/case-studies" element={<AdminCaseStudies />} />
        <Route path="/admin/case-studies/:caseStudyId" element={<CaseStudyEditor />} />
        <Route path="/admin/case-studies/new" element={<CaseStudyEditor />} />
        <Route path="/admin/blog" element={<AdminBlog />} />
        <Route path="/admin/blog/:blogId" element={<BlogEditor />} />
        <Route path="/admin/blog/new" element={<BlogEditor />} />
        <Route path="/admin/landing-pages" element={<AdminLandingPages />} />
        <Route path="/admin/landing-pages/:pageId" element={<LandingPageEditor />} />
        <Route path="/admin/landing-pages/new" element={<LandingPageEditor />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/media" element={<AdminMedia />} />
        <Route path="/admin/settings" element={<AdminSettings />} />  {/* Add this line */}
        <Route path="/admin/signin" element={<SignIn />} />
        
        {/* Individual Machine Routes */}
        <Route path="/machines/divi-sp" element={<DiviSP />} />
        <Route path="/machines/divi-ss" element={<DiviSS />} />
        <Route path="/machines/divi-wp" element={<DiviWP />} />
        <Route path="/machines/divi-ws" element={<DiviWS />} />
        <Route path="/machines/combi-3000" element={<Combi3000 />} />
        <Route path="/machines/option2-wall-mount" element={<Option2WallMount />} />
        <Route path="/machines/option2-wall-mount-xl" element={<Option2WallMountXL />} />
        <Route path="/machines/option4-refrigerated" element={<Option4Refrigerated />} />
        <Route path="/machines/locker-10-cell" element={<Locker10Cell />} />
        <Route path="/machines/locker-21-cell" element={<Locker21Cell />} />

        {/* Utility pages for data migration */}
        <Route path="/migrate-machines-data" element={<MigrateMachinesData />} />
        <Route path="/migrate-business-goal-data" element={<MigrateBusinessGoalData />} />
        <Route path="/migrate-technology-data" element={<MigrateTechnologyData />} />

        {/* Technology Pages */}
        <Route path="/simple-technology" element={<SimpleTechnologyPage />} />

        {/* Not found route must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
