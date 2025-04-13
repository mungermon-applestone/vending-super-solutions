
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { adminRoutes } from './router/adminRoutes';

// Create a simple LoadingSpinner component since it's missing
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
  </div>
);

// Lazy load pages with correct relative imports
const HomePage = lazy(() => import('./pages/Index'));
const AboutPage = lazy(() => import('./pages/AboutUs'));
const TechnologyLanding = lazy(() => import('./pages/TechnologyLanding'));
const TechnologyDetail = lazy(() => import('./pages/TechnologyDetail'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const StrapiConfig = lazy(() => import('./pages/admin/StrapiConfig'));
const StrapiConnectionDebug = lazy(() => import('./pages/admin/StrapiConnectionDebug'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/technology" element={<TechnologyLanding />} />
        <Route path="/technology/:slug" element={<TechnologyDetail />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/strapi-config" element={<StrapiConfig />} />
        <Route path="/admin/strapi-debug" element={<StrapiConnectionDebug />} />
        
        {/* Include all admin routes from adminRoutes.tsx */}
        {adminRoutes}
      </Routes>
    </Suspense>
  );
}

export default App;
