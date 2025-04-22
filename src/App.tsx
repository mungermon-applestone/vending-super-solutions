
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import Products from '@/pages/Products';
import Machines from '@/pages/Machines';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
import Home from '@/pages/Home';
import TechnologyLanding from '@/pages/TechnologyLanding';
import ContentfulTechnologyPage from '@/pages/ContentfulTechnologyPage';
import TechnologyPage from './pages/TechnologyPage';
import BusinessGoalsLanding from '@/pages/BusinessGoalsLanding';
import ProductDetail from '@/pages/ProductDetail';
import BusinessGoalDetailPage from '@/pages/BusinessGoalDetailPage';
import MachineDetailPage from '@/pages/MachineDetailPage';
import MachinesPage from '@/pages/MachinesPage';

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
      path: '/products/:productSlug',
      element: <ProductDetail />,
    },
    {
      path: '/machines',
      element: <MachinesPage />,
    },
    {
      // Place the explicit route first so it takes precedence
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
      element: <Contact />,
    },
    {
      path: '/business-goals',
      element: <BusinessGoalsLanding />,
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
