
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css';
import ErrorPage from './components/ErrorPage';
import RootLayout from './components/RootLayout';
import AdminLayout from './components/AdminLayout';
import NotFound from './pages/NotFound';
import { Toaster } from "./components/ui/toaster";
import { adminRoutes } from './router/adminRoutes';
import ContentfulMachines from './pages/ContentfulMachines';
import ContentfulMachineDetail from './pages/ContentfulMachineDetail';
import TechnologyPage from './pages/TechnologyPage';
import TechnologyDetailPage from './pages/TechnologyDetailPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import BusinessGoalsPage from './pages/BusinessGoalsPage';
import BusinessGoalDetailPage from './pages/BusinessGoalDetailPage';
import MachinesPage from './pages/MachinesPage';
import MachineDetailPage from './pages/MachineDetailPage';

// Create a simpler router structure to fix the build issues
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      // Public routes
      {
        index: true,
        element: <div className="p-10 text-center"><h1 className="text-3xl font-bold">Welcome to the Application</h1></div>,
      },
      // Main site routes
      {
        path: "technology",
        element: <TechnologyPage />,
      },
      {
        path: "technology/:slug",
        element: <TechnologyDetailPage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "products/:slug",
        element: <ProductDetailPage />,
      },
      {
        path: "business",
        element: <BusinessGoalsPage />,
      },
      {
        path: "business/:slug",
        element: <BusinessGoalDetailPage />,
      },
      {
        path: "machines",
        element: <MachinesPage />,
      },
      {
        path: "machines/:slug",
        element: <MachineDetailPage />,
      },
      // Legacy Contentful routes
      {
        path: "contentful/machines",
        element: <ContentfulMachines />,
      },
      {
        path: "contentful/machines/:slug",
        element: <ContentfulMachineDetail />,
      },
    ]
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: adminRoutes,
  },
  {
    path: "*",
    element: <NotFound />,
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
