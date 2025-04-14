
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Public pages
import Home from './pages/Home';
import Homepage from './pages/Homepage';
import Products from './pages/Products';
import Machines from './pages/Machines';
import BusinessGoals from './pages/BusinessGoals';
import MachineDetail from './pages/MachineDetail';
import ProductDetail from './pages/ProductDetail';
import BusinessGoalDetail from './pages/BusinessGoalDetail';
import TechnologyLanding from './pages/TechnologyLanding';
import TechnologyDetail from './pages/TechnologyDetail';
import ProductsLanding from './pages/ProductsLanding';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminMachines from './pages/admin/AdminMachines';
import AdminBusinessGoals from './pages/admin/AdminBusinessGoals';
import AdminLandingPages from './pages/admin/AdminLandingPages';
import LandingPageEditor from './pages/admin/LandingPageEditor';
import ProductEditor from './pages/ProductEditor';
import MachineEditor from './pages/MachineEditor';
import BusinessGoalEditor from './pages/admin/BusinessGoalEditor';
import AdminTechnology from './pages/admin/AdminTechnology';
import TechnologyEditor from './pages/TechnologyEditor';
import AdminMedia from './pages/admin/AdminMedia';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products-landing" element={<ProductsLanding />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productSlug" element={<ProductDetail />} />
        <Route path="/machines" element={<Machines />} />
        <Route path="/machines/:machineType/:machineId" element={<MachineDetail />} />
        <Route path="/goals" element={<BusinessGoals />} />
        <Route path="/goals/:goalSlug" element={<BusinessGoalDetail />} />
        <Route path="/technology" element={<TechnologyLanding />} />
        <Route path="/technology/:slug" element={<TechnologyDetail />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<ProductEditor />} />
        <Route path="/admin/products/edit/:id" element={<ProductEditor />} />
        <Route path="/admin/machines" element={<AdminMachines />} />
        <Route path="/admin/machines/new" element={<MachineEditor />} />
        <Route path="/admin/machines/edit/:id" element={<MachineEditor />} />
        <Route path="/admin/goals" element={<AdminBusinessGoals />} />
        <Route path="/admin/goals/new" element={<BusinessGoalEditor />} />
        <Route path="/admin/goals/edit/:id" element={<BusinessGoalEditor />} />
        <Route path="/admin/landing-pages" element={<AdminLandingPages />} />
        <Route path="/admin/landing-pages/new" element={<LandingPageEditor />} />
        <Route path="/admin/landing-pages/edit/:id" element={<LandingPageEditor />} />
        <Route path="/admin/technology" element={<AdminTechnology />} />
        <Route path="/admin/technology/new" element={<TechnologyEditor />} />
        <Route path="/admin/technology/edit/:id" element={<TechnologyEditor />} />
        <Route path="/admin/media" element={<AdminMedia />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
