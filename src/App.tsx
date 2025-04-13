
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import BusinessPage from './pages/BusinessPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import MachineDetailsPage from './pages/MachineDetailsPage';
import ContactPage from './pages/ContactPage';
import MachinesPage from './pages/MachinesPage';
import CasesPage from './pages/CasesPage';
import SimpleProductPage from './pages/SimpleProductPage';
import SimpleMachinePage from './pages/SimpleMachinePage';
import SimpleTechnologyPage from './pages/SimpleTechnologyPage';
import AdminSettings from './pages/admin/AdminSettings';
import StrapiConfig from './pages/admin/StrapiConfig';
import { initCMS } from './services/cms/cmsInit';

// Initialize the CMS configuration
initCMS();

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:slug" element={<ProductDetailsPage />} />
      <Route path="/machines" element={<MachinesPage />} />
      <Route path="/machines/:slug" element={<MachineDetailsPage />} />
      <Route path="/business" element={<BusinessPage />} />
      <Route path="/cases" element={<CasesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/simple-product" element={<SimpleProductPage />} />
      <Route path="/simple-machine" element={<SimpleMachinePage />} />
      <Route path="/technology" element={<SimpleTechnologyPage />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/admin/strapi" element={<StrapiConfig />} />
    </Routes>
  );
};

export default App;
