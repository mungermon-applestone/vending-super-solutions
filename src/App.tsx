
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css';
import AdminProducts from './pages/admin/AdminProducts';
import MigrateCmsData from './pages/admin/MigrateCmsData';
import DataPurgePage from './pages/admin/DataPurge';
import ErrorPage from './components/ErrorPage';
import RootLayout from './components/RootLayout';
import AdminLayout from './components/AdminLayout';
import ProductEditorPage from './pages/ProductEditor';
import NotFound from './pages/NotFound';
import AdminSettings from './pages/admin/AdminSettings';

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
    ]
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <div className="p-10"><h1 className="text-3xl font-bold">Admin Dashboard</h1></div>,
      },
      {
        path: "/admin/products",
        element: <AdminProducts />,
      },
      {
        path: "/admin/products/new",
        element: <ProductEditorPage />,
      },
      {
        path: "/admin/products/edit/:slug",
        element: <ProductEditorPage />,
      },
      {
        path: "/admin/migrate-cms",
        element: <MigrateCmsData />,
      },
      {
        path: "/admin/data-purge",
        element: <DataPurgePage />,
      },
      {
        path: "/admin/settings",
        element: <AdminSettings />,
      },
    ]
  },
  {
    path: "*",
    element: <NotFound />,
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
