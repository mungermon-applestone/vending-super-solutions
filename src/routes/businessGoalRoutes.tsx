
import { Route } from "react-router-dom";
import BusinessGoalDetail from "../pages/BusinessGoalDetail";

export const businessGoalRoutes = (
  <>
    {/* Support both page implementations and URL patterns for backward compatibility */}
    <Route path="/goals/:slug" element={<BusinessGoalDetail />} />
    <Route path="/business-goals/:slug" element={<BusinessGoalDetail />} />
    <Route path="/business/:slug" element={<BusinessGoalDetail />} /> 
    
    {/* Special case for expand-footprint */}
    <Route path="/business-goals/expand-footprint" element={<BusinessGoalDetail />} />
  </>
);
