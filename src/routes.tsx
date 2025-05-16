
import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import ProductsPage from "./pages/ProductsPage";
import BusinessGoalsPage from "./pages/BusinessGoalsPage";
import BusinessGoalPage from "./pages/BusinessGoalPage";
import MachinesPage from "./pages/MachinesPage";
import TechnologyPage from "./pages/TechnologyPage";
import TechnologiesPage from "./pages/TechnologiesPage";
import MachinePage from "./pages/MachinePage";
import ContactPage from "./pages/ContactPage";
import ErrorPage from "./pages/ErrorPage";
import RootLayout from "./components/layout/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/products",
        element: <ProductsPage />,
      },
      {
        path: "/products/:slug",
        element: <ProductPage />,
      },
      {
        path: "/business-goals",
        element: <BusinessGoalsPage />,
      },
      {
        path: "/business-goals/:slug",
        element: <BusinessGoalPage />,
      },
      {
        path: "/machines",
        element: <MachinesPage />,
      },
      {
        path: "/machines/:type/:slug",
        element: <MachinePage />,
      },
      {
        path: "/technology",
        element: <TechnologiesPage />,
      },
      {
        path: "/technology/:slug",
        element: <TechnologyPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
    ],
  },
]);
