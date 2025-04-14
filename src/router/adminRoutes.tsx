import { RouteObject } from "react-router-dom";
import Admin from "@/pages/Admin";
import Machines from "@/pages/Machines";
import Machine from "@/pages/Machine";
import ProductTypes from "@/pages/ProductTypes";
import ProductType from "@/pages/ProductType";
import BusinessGoals from "@/pages/BusinessGoals";
import BusinessGoal from "@/pages/BusinessGoal";
import Technologies from "@/pages/Technologies";
import Technology from "@/pages/Technology";
import CaseStudies from "@/pages/CaseStudies";
import CaseStudy from "@/pages/CaseStudy";
import Testimonials from "@/pages/Testimonials";
import Settings from "@/pages/Settings";
import LandingPages from "@/pages/LandingPages";
import LandingPage from "@/pages/LandingPage";

// Import the new ContentfulManagement page
import ContentfulManagement from '@/pages/admin/ContentfulManagement'; 

export const adminRoutes: RouteObject[] = [
  {
    path: "",
    element: <Admin />,
  },
  {
    path: "machines",
    element: <Machines />,
  },
  {
    path: "machines/:machineSlug",
    element: <Machine />,
  },
  {
    path: "product-types",
    element: <ProductTypes />,
  },
  {
    path: "product-types/:productTypeSlug",
    element: <ProductType />,
  },
  {
    path: "business-goals",
    element: <BusinessGoals />,
  },
  {
    path: "business-goals/:businessGoalSlug",
    element: <BusinessGoal />,
  },
  {
    path: "technologies",
    element: <Technologies />,
  },
  {
    path: "technologies/:technologySlug",
    element: <Technology />,
  },
  {
    path: "case-studies",
    element: <CaseStudies />,
  },
  {
    path: "case-studies/:caseStudySlug",
    element: <CaseStudy />,
  },
  {
    path: "testimonials",
    element: <Testimonials />,
  },
  {
    path: "settings",
    element: <Settings />,
  },
  {
    path: "landing-pages",
    element: <LandingPages />,
  },
  {
    path: "landing-pages/:landingPageKey",
    element: <LandingPage />,
  },
  
  // Add the new ContentfulManagement route
  {
    path: "contentful",
    element: <ContentfulManagement />
  },
];
