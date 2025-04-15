import { RouteObject } from "react-router-dom";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminMachines from "@/pages/admin/AdminMachines";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminBusinessGoals from "@/pages/admin/AdminBusinessGoals";
import AdminTechnology from "@/pages/admin/AdminTechnology";
import AdminCaseStudies from "@/pages/admin/AdminCaseStudies";
import AdminLandingPages from "@/pages/admin/AdminLandingPages";
import AdminSettings from "@/pages/admin/AdminSettings";
import ContentfulManagement from '@/pages/admin/ContentfulManagement';

export const adminRoutes: RouteObject[] = [
  {
    path: "",
    element: <AdminDashboard />,
  },
  {
    path: "machines",
    element: <AdminMachines />,
  },
  {
    path: "machines/:machineSlug",
    element: <AdminMachines />, // Using same component with a parameter
  },
  {
    path: "product-types",
    element: <AdminProducts />, // Using the admin products page for product types
  },
  {
    path: "product-types/:productTypeSlug",
    element: <AdminProducts />, // Using same component with a parameter
  },
  {
    path: "business-goals",
    element: <AdminBusinessGoals />,
  },
  {
    path: "business-goals/:businessGoalSlug",
    element: <AdminBusinessGoals />, // Using same component with a parameter
  },
  {
    path: "technologies",
    element: <AdminTechnology />,
  },
  {
    path: "technologies/:technologySlug",
    element: <AdminTechnology />, // Using same component with a parameter
  },
  {
    path: "case-studies",
    element: <AdminCaseStudies />,
  },
  {
    path: "case-studies/:caseStudySlug",
    element: <AdminCaseStudies />, // Using same component with a parameter
  },
  {
    path: "testimonials",
    element: <AdminDashboard />, // Using dashboard as fallback since Testimonials page isn't available
  },
  {
    path: "settings",
    element: <AdminSettings />,
  },
  {
    path: "landing-pages",
    element: <AdminLandingPages />,
  },
  {
    path: "landing-pages/:landingPageKey",
    element: <AdminLandingPages />, // Using same component with a parameter
  },
  
  {
    path: "contentful",
    element: <ContentfulManagement />
  },
];
