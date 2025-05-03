
import { Route } from "react-router-dom";
import BusinessGoalDetail from "../pages/BusinessGoalDetail";

export const businessGoalRoutes = (
  <>
    <Route path="/goals/:slug" element={<BusinessGoalDetail />} />
  </>
);
