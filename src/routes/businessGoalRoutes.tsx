
import { Route } from "react-router-dom";
import BusinessGoalDetailPage from "../pages/BusinessGoalDetailPage";

export const businessGoalRoutes = (
  <>
    {/* Support both page implementations and URL patterns for backward compatibility */}
    <Route path="/goals/:slug" element={<BusinessGoalDetailPage />} />
    <Route path="/business-goals/:slug" element={<BusinessGoalDetailPage />} />
    <Route path="/business/:slug" element={<BusinessGoalDetailPage />} /> 
  </>
);
