
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import ProductsPage from "./pages/ProductsPage";
import BusinessGoalsPage from "./pages/BusinessGoalsPage";
import BusinessGoalDetailPage from "./pages/BusinessGoalDetailPage";
import MachinesPage from "./pages/MachinesPage";
import TechnologyPage from "./pages/TechnologyPage";
import TechnologyDetailPage from "./pages/TechnologyDetailPage";
import MachineDetail from "./pages/MachineDetail";
import Contact from "./pages/Contact";
import ErrorPage from "./components/ErrorPage";
import Layout from "./components/layout/Layout";
import About from "./pages/About";
import BlogPage from "./pages/BlogPage";
import ContentfulBlogPostDetail from "./pages/ContentfulBlogPostDetail";
import { Navigate } from "react-router-dom";

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
        element: <ProductsPage />,
      },
      {
        path: "/products/:slug",
        element: <ProductDetail />,
      },
      {
        path: "/business-goals",
        element: <BusinessGoalsPage />,
      },
      {
        path: "/business-goals/:slug",
        element: <BusinessGoalDetailPage />,
      },
      {
        path: "/machines",
        element: <MachinesPage />,
      },
      {
        path: "/machines/:machineId",
        element: <MachineDetail />,
      },
      {
        path: "/technology",
        element: <TechnologyPage />,
      },
      {
        path: "/technology/:slug",
        element: <TechnologyDetailPage />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/blog",
        element: <BlogPage />,
      },
      {
        path: "/blog/:slug",
        element: <ContentfulBlogPostDetail />,
      },
      // Redirect all admin routes to Contentful
      {
        path: "/admin",
        element: <Navigate to="https://app.contentful.com" replace />,
      },
      {
        path: "/admin/*",
        element: <Navigate to="https://app.contentful.com" replace />,
      },
    ],
  },
]);
