import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoutes";
import StorekeeperLayout from "../components/layouts/StorekeeperLayout.jsx";

// Storekeeper Pages
import StoreDashboard from "../pages/storekeeper/StoreDashboard";
import StoreStock from "../pages/storekeeper/Stock/StoreStock.jsx";
import StoreReports from "../pages/storekeeper/Reports/StoreReports.jsx";

export const StorekeeperRoutes = (
  <Route
    path="/storekeeper"
    element={
      <ProtectedRoute allowedRole="Storekeeper">
        <StorekeeperLayout />
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<StoreDashboard />} />
    <Route path="stock" element={<StoreStock />} />
    <Route path="reports" element={<StoreReports />} />
  </Route>
);