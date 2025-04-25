
import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';

import Products from '@/pages/Products';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
import Home from '@/pages/Home';
import TechnologyLanding from '@/pages/TechnologyLanding';
import ContentfulTechnologyPage from '@/pages/ContentfulTechnologyPage';
import TechnologyPage from './pages/TechnologyPage';
import BusinessGoalsPage from '@/pages/BusinessGoalsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import BusinessGoalDetailPage from '@/pages/BusinessGoalDetailPage';
import MachineDetailPage from '@/pages/MachineDetailPage';
import MachinesPage from '@/pages/MachinesPage';
import About from '@/pages/About';
import ContactContentful from '@/pages/ContactContentful';
import BlogContentTest from './pages/BlogContentTest';
import ZhilaiApplestoneAnnouncement from './pages/ZhilaiApplestoneAnnouncement';
import BlogPage from './pages/BlogPage';

const ContentfulBlogPostDetail = lazy(() => import('./pages/ContentfulBlogPostDetail'));

const App: React.FC = () => {
  const routes = [
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/home',
      element: <Navigate to="/" />,
    },
    {
      path: '/products',
      element: <Products />,
    },
    {
      path: '/products/:slug',
      element: <ProductDetailPage />,
    },
    {
      path: '/machines',
      element: <MachinesPage />,
    },
    {
      path: '/machines/divi-wp',
      element: <MachineDetailPage />,
    },
    {
      path: '/machines/:slug',
      element: <MachineDetailPage />,
    },
    {
      path: '/machine/:machineId',
      element: <MachineDetailPage />,
    },
    {
      path: '/contact',
      element: <ContactContentful />,
    },
    {
      path: '/business-goals',
      element: <BusinessGoalsPage />,
    },
    {
      path: '/business/:slug',
      element: <BusinessGoalDetailPage />,
    },
    {
      path: '/goals',
      element: <Navigate to="/business-goals" />,
    },
    {
      path: '/technology-landing',
      element: <TechnologyLanding />,
    },
    {
      path: '/technology',
      element: <TechnologyPage />,
    },
    {
      path: '/technology/detailed',
      element: <TechnologyLanding />,
    },
    {
      path: '/about',
      element: <About />,
    },
    {
      path: '/blog',
      element: <BlogPage />,
    },
    {
      path: '/blog/:slug',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <ContentfulBlogPostDetail />
        </Suspense>
      ),
    },
    {
      path: '/blog-content-test',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <BlogContentTest />
        </Suspense>
      ),
    },
    {
      path: '/zhilai-applestone-announcement',
      element: <ZhilaiApplestoneAnnouncement />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ];

  return (
    <Router>
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
    </Router>
  );
};

export default App;
