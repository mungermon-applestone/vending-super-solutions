
import { Route } from "react-router-dom";
import BusinessGoalDetail from "../pages/BusinessGoalDetail";
import BusinessGoalDetailPage from "../pages/BusinessGoalDetailPage";

export const businessGoalRoutes = (
  <>
    {/* Support both page implementations for backward compatibility */}
    <Route path="/goals/:slug" element={<BusinessGoalDetail />} />
    <Route path="/business-goals/:slug" element={<BusinessGoalDetailPage />} />
  </>
);

