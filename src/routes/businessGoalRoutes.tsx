
import { Route } from "react-router-dom";
import BusinessGoalDetail from "../pages/BusinessGoalDetail";

// Create a dedicated component for expand-footprint to ensure it's always prioritized
const ExpandFootprintPage = () => {
  return <BusinessGoalDetail forcedSlug="expand-footprint" />;
};

export const businessGoalRoutes = (
  <>
    {/* Special case for expand-footprint - explicitly defined with its own component */}
    <Route path="/business-goals/expand-footprint" element={<ExpandFootprintPage />} />
    
    {/* Support legacy URL formats for backward compatibility */}
    <Route path="/goals/expand-footprint" element={<ExpandFootprintPage />} />
    <Route path="/business/expand-footprint" element={<ExpandFootprintPage />} />
    
    {/* Standard routes for all other business goals */}
    <Route path="/business-goals/:slug" element={<BusinessGoalDetail />} />
    <Route path="/goals/:slug" element={<BusinessGoalDetail />} />
    <Route path="/business/:slug" element={<BusinessGoalDetail />} />
  </>
);
