
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/components/RootLayout";

// Pages
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import BlogList from "@/pages/BlogList"; 
import BlogPostDetail from "@/pages/BlogPostDetail";
import Contact from "@/pages/Contact";
import BusinessGoalDetailPage from "@/pages/BusinessGoalDetailPage";
import BusinessGoalsPage from "@/pages/BusinessGoalsPage";
import AdminPage from "@/pages/AdminPage";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";

// Import business goal routes
import businessGoalRoutes from "./routes/businessGoalRoutes";

// Create and export the router
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/blog",
        element: <BlogList />,
      },
      {
        path: "/blog/:slug",
        element: <BlogPostDetail />,
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
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/admin",
        element: <AdminPage />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms-of-service",
        element: <TermsOfService />,
      },
      // Include business goal routes
      ...businessGoalRoutes,
    ],
  },
]);

export default router;
