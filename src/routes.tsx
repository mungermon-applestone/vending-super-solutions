
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import BusinessGoals from "./pages/BusinessGoals";
import BusinessGoalDetail from "./pages/BusinessGoalDetail";
import Machines from "./pages/Machines";
import TechnologyPage from "./pages/TechnologyPage";
import TechnologyDetail from "./pages/TechnologyDetail";
import MachineDetail from "./pages/MachineDetail";
import Contact from "./pages/Contact";
import ErrorPage from "./components/ErrorPage";
import Layout from "./components/layout/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/products/:slug",
        element: <ProductDetail />,
      },
      {
        path: "/business-goals",
        element: <BusinessGoals />,
      },
      {
        path: "/business-goals/:slug",
        element: <BusinessGoalDetail />,
      },
      {
        path: "/machines",
        element: <Machines />,
      },
      {
        path: "/machines/:type/:slug",
        element: <MachineDetail />,
      },
      {
        path: "/technology",
        element: <TechnologyPage />,
      },
      {
        path: "/technology/:slug",
        element: <TechnologyDetail />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
    ],
  },
]);
