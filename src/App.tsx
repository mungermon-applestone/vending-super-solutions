
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import routes from './routes';
import { Toaster } from 'sonner';

const router = createBrowserRouter(routes);

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </HelmetProvider>
  );
};

export default App;
