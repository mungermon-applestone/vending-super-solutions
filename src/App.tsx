
import { Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import AdminSettings from './pages/admin/AdminSettings';
import StrapiConfig from './pages/admin/StrapiConfig';
import { initCMS } from './services/cms/cmsInit';
import SimpleTechnologyPage from './pages/SimpleTechnologyPage';

// Initialize the CMS configuration
initCMS();

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/technology" element={<SimpleTechnologyPage />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/admin/strapi" element={<StrapiConfig />} />
    </Routes>
  );
};

export default App;
