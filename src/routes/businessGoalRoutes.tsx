
import React from "react";
import BusinessGoalDetailPage from "@/pages/BusinessGoalDetailPage";

// Export an array of route objects for React Router v6
export const businessGoalRoutes = [
  {
    path: "/goals/:slug",
    element: <BusinessGoalDetailPage />
  },
  {
    path: "/business/:slug",
    element: <BusinessGoalDetailPage />
  }
];

export default businessGoalRoutes;
