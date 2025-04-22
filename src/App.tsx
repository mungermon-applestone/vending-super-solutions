
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
      path: '/contact',
      element: <Contact />,
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
