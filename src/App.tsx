import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import Products from '@/pages/Products';
import Machines from '@/pages/Machines';
import MachineDetails from '@/pages/MachineDetails';
import Contact from '@/pages/Contact';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';
import Home from '@/pages/Home';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Services from '@/pages/Services';
import Solutions from '@/pages/Solutions';
import LegacyMachines from '@/pages/LegacyMachines';
import LegacyMachineDetails from '@/pages/LegacyMachineDetails';
import TechnologyLanding from '@/pages/TechnologyLanding';
import ContentfulTechnologyPage from '@/pages/ContentfulTechnologyPage';

// Import the new TechnologyPage component
import TechnologyPage from './pages/TechnologyPage';

const App: React.FC = () => {
  // Define routes
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
      path: '/machines',
      element: <Machines />,
    },
    {
      path: '/machines/:machineId',
      element: <MachineDetails />,
    },
    {
      path: '/contact',
      element: <Contact />,
    },
    {
      path: '/about',
      element: <About />,
    },
    {
      path: '/terms',
      element: <Terms />,
    },
    {
      path: '/privacy',
      element: <Privacy />,
    },
    {
      path: '/services',
      element: <Services />,
    },
    {
      path: '/solutions',
      element: <Solutions />,
    },
    {
      path: '/legacy-machines',
      element: <LegacyMachines />,
    },
    {
      path: '/legacy-machines/:machineId',
      element: <LegacyMachineDetails />,
    },
    {
      path: '/technology-landing',
      element: <TechnologyLanding />,
    },
    {
      path: '/technology',
      element: <ContentfulTechnologyPage />,
    },
    {
      path: '/technology/detailed',
      element: <TechnologyLanding />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
    {
      path: '/technology',
      element: <TechnologyPage />,
    },
  ]

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
