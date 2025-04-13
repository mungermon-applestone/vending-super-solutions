
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const TechnologyLanding = lazy(() => import('@/pages/TechnologyLanding'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
const StrapiConfig = lazy(() => import('@/pages/admin/StrapiConfig'));
const StrapiConnectionDebug = lazy(() => import('@/pages/admin/StrapiConnectionDebug'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/technology" element={<TechnologyLanding />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/strapi-config" element={<StrapiConfig />} />
        <Route path="/admin/strapi-debug" element={<StrapiConnectionDebug />} />
      </Routes>
    </Suspense>
  );
}

export default App;
