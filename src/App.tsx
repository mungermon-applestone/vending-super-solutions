import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Public pages
import Home from './pages/Home';
import Products from './pages/Products';
import Machines from './pages/Machines';
import BusinessGoals from './pages/BusinessGoals';
import MachineDetail from './pages/MachineDetail';
import ProductDetail from './pages/ProductDetail';
import BusinessGoalDetail from './pages/BusinessGoalDetail';

// Admin pages
import AdminProducts from './pages/admin/AdminProducts';
import AdminMachines from './pages/admin/AdminMachines';
import AdminBusinessGoals from './pages/admin/AdminBusinessGoals';
import AdminProductsPage from './pages/AdminProducts';
import AdminMachinesPage from './pages/AdminMachines';
import AdminBusinessGoalsPage from './pages/AdminBusinessGoals';
import AdminTechnologies from './pages/admin/AdminTechnologies';
import AdminCaseStudies from './pages/admin/AdminCaseStudies';
import AdminLandingPages from './pages/admin/AdminLandingPages';

// Product Editor
import ProductEditor from './pages/admin/product-editor/ProductEditor';
import NewProduct from './pages/admin/product-editor/NewProduct';

// Machine Editor
import MachineEditor from './pages/admin/machine-editor/MachineEditor';
import NewMachine from './pages/admin/machine-editor/NewMachine';
import MachineMigration from './pages/admin/machine-editor/MachineMigration';

// Business Goal Editor
import BusinessGoalEditor from './pages/admin/business-goal-editor/BusinessGoalEditor';
import NewBusinessGoal from './pages/admin/business-goal-editor/NewBusinessGoal';

// Technology Editor
import TechnologyEditor from './pages/admin/technology-editor/TechnologyEditor';
import NewTechnology from './pages/admin/technology-editor/NewTechnology';

// Case Study Editor
import CaseStudyEditor from './pages/admin/case-study-editor/CaseStudyEditor';
import NewCaseStudy from './pages/admin/case-study-editor/NewCaseStudy';

// Landing Page Editor
import LandingPageEditor from './pages/admin/landing-page-editor/LandingPageEditor';
import NewLandingPage from './pages/admin/landing-page-editor/NewLandingPage';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// CMS
import Technologies from './pages/Technologies';
import TechnologyDetail from './pages/TechnologyDetail';
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetail from './pages/CaseStudyDetail';
import LandingPages from './pages/LandingPages';
import LandingPageDetail from './pages/LandingPageDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productSlug" element={<ProductDetail />} />
        <Route path="/machines" element={<Machines />} />
        <Route path="/machines/:machineType/:machineId" element={<MachineDetail />} />
        <Route path="/goals" element={<BusinessGoals />} />
        <Route path="/goals/:goalSlug" element={<BusinessGoalDetail />} />

        {/* Admin Routes */}
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/machines" element={<AdminMachines />} />
        <Route path="/admin/business-goals" element={<AdminBusinessGoals />} />
        <Route path="/admin/technologies" element={<AdminTechnologies />} />
        <Route path="/admin/case-studies" element={<AdminCaseStudies />} />
        <Route path="/admin/landing-pages" element={<AdminLandingPages />} />

        {/* Product Editor Routes */}
        <Route path="/admin/products/edit/:productSlug" element={<ProductEditor />} />
        <Route path="/admin/products/new" element={<NewProduct />} />

        {/* Machine Editor Routes */}
        <Route path="/admin/machines/edit/:machineId" element={<MachineEditor />} />
        <Route path="/admin/machines/new" element={<NewMachine />} />
        <Route path="/admin/machines/migrate" element={<MachineMigration />} />

        {/* Business Goal Editor Routes */}
        <Route path="/admin/business-goals/edit/:goalSlug" element={<BusinessGoalEditor />} />
        <Route path="/admin/business-goals/new" element={<NewBusinessGoal />} />

        {/* Technology Editor Routes */}
        <Route path="/admin/technologies/edit/:technologySlug" element={<TechnologyEditor />} />
        <Route path="/admin/technologies/new" element={<NewTechnology />} />

        {/* Case Study Editor Routes */}
        <Route path="/admin/case-studies/edit/:caseStudySlug" element={<CaseStudyEditor />} />
        <Route path="/admin/case-studies/new" element={<NewCaseStudy />} />

        {/* Landing Page Editor Routes */}
        <Route path="/admin/landing-pages/edit/:landingPageKey" element={<LandingPageEditor />} />
        <Route path="/admin/landing-pages/new" element={<NewLandingPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* CMS Routes */}
        <Route path="/technologies" element={<Technologies />} />
        <Route path="/technologies/:technologySlug" element={<TechnologyDetail />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/case-studies/:caseStudySlug" element={<CaseStudyDetail />} />
        <Route path="/landing-pages" element={<LandingPages />} />
        <Route path="/landing-pages/:landingPageKey" element={<LandingPageDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
