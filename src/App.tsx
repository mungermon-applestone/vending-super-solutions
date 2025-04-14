
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
