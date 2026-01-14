
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import ProductsPage from "./pages/ProductsPage";
import BusinessGoalsPage from "./pages/BusinessGoalsPage";
import BusinessGoalDetailPage from "./pages/BusinessGoalDetailPage";
import MachinesPage from "./pages/MachinesPage";
import MachinesPresentationPage from "./pages/MachinesPresentationPage";
import TechnologyPage from "./pages/TechnologyPage";
import TechnologyDetailPage from "./pages/TechnologyDetailPage";
import MachineDetail from "./pages/MachineDetail";
import Contact from "./pages/Contact";
import ErrorPage from "./components/ErrorPage";
import Layout from "./components/layout/Layout";
import About from "./pages/About";
import BlogPage from "./pages/BlogPage";
import ContentfulBlogPostDetail from "./pages/ContentfulBlogPostDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import { Navigate } from "react-router-dom";
import { ProductPreview } from "./pages/preview/ProductPreview";
import { HelpDeskArticlePreview } from "./pages/preview/HelpDeskArticlePreview";
import KnowledgeBase from "./pages/KnowledgeBase";
import KnowledgeBaseArticle from "./pages/KnowledgeBaseArticle";
import KnowledgeBaseSinglePage from "./pages/KnowledgeBaseSinglePage";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerSupportTicket from "./pages/CustomerSupportTicket";
import CustomerProtectedRoute from "./components/auth/CustomerProtectedRoute";

/**
 * Router Configuration
 * 
 * CRITICAL LAYOUT ARCHITECTURE NOTES:
 * - The Layout component is configured at the root level as the parent route
 * - ALL child route components inherit this layout automatically
 * - Child components should NEVER wrap themselves with <Layout />
 * - This prevents double navigation/footer rendering
 * 
 * REGRESSION PREVENTION:
 * - If you see double navigation or footers, check if page components
 *   are incorrectly wrapping content with <Layout />
 * - Page components should return their content directly
 * - Layout is provided by this router configuration
 */

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
      {
        path: "/privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms",
        element: <TermsOfService />,
      },
      // Preview routes for Contentful drafts
      {
        path: "/preview/products/:slug",
        element: <ProductPreview />,
      },
      {
        path: "/preview/help-desk-articles/:slug",
        element: <HelpDeskArticlePreview />,
      },
      // Customer login route (not protected)
      {
        path: "/customer-login",
        element: <CustomerLogin />,
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
  // Machines presentation view (no layout - clean for screenshots)
  {
    path: "/machines/presentation",
    element: <MachinesPresentationPage />,
  },
  // Customer portal routes (separate from main layout)
  {
    path: "/knowledge-base",
    element: (
      <CustomerProtectedRoute>
        <KnowledgeBase />
      </CustomerProtectedRoute>
    ),
  },
  {
    path: "/knowledge-base/single-page",
    element: (
      <CustomerProtectedRoute>
        <KnowledgeBaseSinglePage />
      </CustomerProtectedRoute>
    ),
  },
  {
    path: "/knowledge-base/:slug",
    element: (
      <CustomerProtectedRoute>
        <KnowledgeBaseArticle />
      </CustomerProtectedRoute>
    ),
  },
  {
    path: "/support-ticket",
    element: (
      <CustomerProtectedRoute>
        <CustomerSupportTicket />
      </CustomerProtectedRoute>
    ),
  },
]);
