
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import BusinessGoalsPage from "./pages/BusinessGoalsPage";
import BusinessGoalDetail from "./pages/BusinessGoalDetail";
import MachinesPage from "./pages/MachinesPage";
import TechnologyPage from "./pages/TechnologyPage";
import TechnologyDetail from "./pages/TechnologyDetail";
import MachineDetail from "./pages/MachineDetail";
import Contact from "./pages/Contact";
import ErrorPage from "./components/ErrorPage";
import Layout from "./components/layout/Layout";
import About from "./pages/About";
import BlogPage from "./pages/BlogPage";
import ContentfulBlogPostDetail from "./pages/ContentfulBlogPostDetail";

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
        element: <BusinessGoalsPage />,
      },
      {
        path: "/business-goals/:slug",
        element: <BusinessGoalDetail />,
      },
      {
        path: "/machines",
        element: <MachinesPage />,
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
    ],
  },
]);
