
import { RouteObject } from "react-router-dom";
import BusinessGoalDetail from "../pages/BusinessGoalDetail";

// Create a dedicated component for expand-footprint to ensure it's always prioritized
const ExpandFootprintPage = () => {
  return <BusinessGoalDetail forcedSlug="expand-footprint" />;
};

// Export an array of RouteObjects instead of JSX
export const businessGoalRoutes: RouteObject[] = [
  // Special case for expand-footprint - explicitly defined with its own component
  {
    path: "/business-goals/expand-footprint",
    element: <ExpandFootprintPage />
  },
  
  // Support legacy URL formats for backward compatibility
  {
    path: "/goals/expand-footprint",
    element: <ExpandFootprintPage />
  },
  {
    path: "/business/expand-footprint",
    element: <ExpandFootprintPage />
  },
  
  // Standard routes for all other business goals
  {
    path: "/business-goals/:slug",
    element: <BusinessGoalDetail />
  },
  {
    path: "/goals/:slug",
    element: <BusinessGoalDetail />
  },
  {
    path: "/business/:slug",
    element: <BusinessGoalDetail />
  }
];
