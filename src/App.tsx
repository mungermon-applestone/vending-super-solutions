import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css';
import Root from './routes/root';
import ErrorPage from './error-page';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import AdminProductsPage from './pages/AdminProducts';
import ProductEditorPage from './pages/ProductEditor';
import Admin from './pages/Admin';
import Settings from './pages/Settings';
import AdminProducts from './pages/admin/AdminProducts';
import MigrateCmsData from './pages/admin/MigrateCmsData';
import Machines from './pages/Machines';
import MachineDetail from './pages/MachineDetail';
import MachineEditor from './pages/MachineEditor';
import Technologies from './pages/Technologies';
import TechnologyDetail from './pages/TechnologyDetail';
import TechnologyEditor from './pages/TechnologyEditor';
import BusinessGoals from './pages/BusinessGoals';
import BusinessGoalDetail from './pages/BusinessGoalDetail';
import BusinessGoalEditor from './pages/BusinessGoalEditor';
import Media from './pages/Media';
import DataPurgePage from './pages/admin/DataPurge';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/products/:slug",
        element: <ProductDetail />,
      },
	  {
        path: "/machines",
        element: <Machines />,
      },
	  {
        path: "/machines/:machineId",
        element: <MachineDetail />,
      },
	  {
        path: "/technologies",
        element: <Technologies />,
      },
	  {
        path: "/technologies/:technologyId",
        element: <TechnologyDetail />,
      },
	  {
        path: "/business-goals",
        element: <BusinessGoals />,
      },
	  {
        path: "/business-goals/:businessGoalId",
        element: <BusinessGoalDetail />,
      },
    ]
  },
  {
    path: "/admin",
    element: <Admin />,
    children: [
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
        path: "/admin/product-types",
        element: <AdminProductsPage />,
      },
	  {
        path: "/admin/product-types/new",
        element: <ProductEditorPage />,
      },
      {
        path: "/admin/product-types/edit/:slug",
        element: <ProductEditorPage />,
      },
	  {
        path: "/admin/machines",
        element: <Machines />,
      },
	  {
        path: "/admin/machines/new",
        element: <MachineEditor />,
      },
	  {
        path: "/admin/machines/edit/:machineId",
        element: <MachineEditor />,
      },
	  {
        path: "/admin/technologies",
        element: <Technologies />,
      },
	  {
        path: "/admin/technologies/new",
        element: <TechnologyEditor />,
      },
	  {
        path: "/admin/technologies/edit/:technologyId",
        element: <TechnologyEditor />,
      },
	  {
        path: "/admin/business-goals",
        element: <BusinessGoals />,
      },
	  {
        path: "/admin/business-goals/new",
        element: <BusinessGoalEditor />,
      },
	  {
        path: "/admin/business-goals/edit/:businessGoalId",
        element: <BusinessGoalEditor />,
      },
      {
        path: "/admin/media",
        element: <Media />,
      },
      {
        path: "/admin/settings",
        element: <Settings />,
      },
      {
        path: "/admin/migrate-cms",
        element: <MigrateCmsData />,
      },
      {
        path: "/admin/data-purge",
        element: <DataPurgePage />,
      },
    ]
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
