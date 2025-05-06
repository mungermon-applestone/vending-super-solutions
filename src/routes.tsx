import { lazy } from 'react';
import MachinesPage from './pages/MachinesPage';
import Partner from './pages/Partner';
import ContactTest from './pages/ContactTest';

// Define the application routes
const routes = [
  {
    path: "/",
    element: <MachinesPage />,
  },
  {
    path: "/machines",
    element: <MachinesPage />,
  },
  {
    path: "/partner",
    element: <Partner />,
  },
  {
    path: "/contact-test",
    element: <ContactTest />,
  },
  // Other routes can be added here
];

export default routes;
