
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/providers/theme-provider';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Products from './pages/Products';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import ProductDetail from './pages/ProductDetail';
import Machines from './pages/Machines';
import MachineDetail from './pages/MachineDetail';
import { MachineProvider } from '@/context/MachineContext';
import ContentfulMachineDetail from './pages/ContentfulMachineDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import adminRoutes from './router/adminRoutes';
import MigrateBusinessGoalData from './pages/admin/MigrateBusinessGoalData';
import MigrateTechnologyData from './pages/admin/MigrateTechnologyData';
import MigrateMachinesData from './pages/admin/MigrateMachinesData';
import { useMediaQuery } from 'react-responsive';
import BusinessGoalDetailPage from './pages/BusinessGoalDetailPage';
import BusinessGoalsPage from './pages/BusinessGoalsPage';
import BusinessGoalDetail from './pages/BusinessGoalDetail';
import BusinessGoalsLanding from './pages/BusinessGoalsLanding';
import ContentfulTechnologyPage from './pages/ContentfulTechnologyPage';
import TechnologyDetailPage from './pages/TechnologyDetailPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Define the router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/products/:productSlug",
    element: <ProductDetail />,
  },
  {
    path: "/machines",
    element: <Machines />,
  },
  {
    path: "/machines/:machineSlug",
    element: <MachineDetail />,
  },
  {
    path: "/machine/:machineSlug",
    element: <ContentfulMachineDetail />,
  },
  {
    path: "/goals",
    element: <BusinessGoalsLanding />,
  },
  {
    path: "/goals/:goalSlug",
    element: <BusinessGoalDetail />,
  },
  {
    path: "/business-goals",
    element: <BusinessGoalsPage />,
  },
  {
    path: "/business-goals/:goalSlug",
    element: <BusinessGoalDetailPage />,
  },
  {
    path: "/technology",
    element: <ContentfulTechnologyPage />,
  },
  {
    path: "/technology/:technologySlug",
    element: <TechnologyDetailPage />,
  },
  {
    path: "/about",
    element: <AboutUs />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/data/migrate-business-goals",
    element: <MigrateBusinessGoalData />,
  },
  {
    path: "/admin/data/migrate-technologies",
    element: <MigrateTechnologyData />,
  },
  {
    path: "/admin/data/migrate-machines",
    element: <MigrateMachinesData />,
  },
  ...adminRoutes,
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  const isMobile = useMediaQuery({ maxWidth: 640 });

  useEffect(() => {
    // Set a CSS variable to track viewport height for mobile browsers
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set initial value
    setVh();

    // Update on resize
    window.addEventListener('resize', setVh);

    // Clean up
    return () => window.removeEventListener('resize', setVh);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vending-theme">
        <MachineProvider>
          <RouterProvider router={router} />
          <Toaster position={isMobile ? "bottom-center" : "top-right"} />
        </MachineProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
