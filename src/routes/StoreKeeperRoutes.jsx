import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoutes";
import StorekeeperLayout from "../components/layouts/StorekeeperLayout.jsx";

// Storekeeper Pages
import StoreDashboard from "../pages/storekeeper/StorekeeperDashboard";
import StoreStock from "../pages/storekeeper/Stock/StoreStock.jsx";
import StoreReports from "../pages/storekeeper/Reports/StoreReports.jsx";
import Consumables from "../pages/storekeeper/Cosumables/Consumables.jsx";
import AddConsumables from "../pages/storekeeper/Cosumables/AddConsumables.jsx";
import ViewAll from "../pages/storekeeper/Cosumables/ViewAll.jsx";
import PendingApprovals from "../pages/storekeeper/Cosumables/Pendingapprovals.jsx";
import Approved from "../pages/storekeeper/Cosumables/Approved.jsx";
import ProductionLog from "../pages/storekeeper/ProductionLogs.jsx";
import Inventory from "../pages/storekeeper/Inventory.jsx";

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
    <Route path="consumables" element={<Consumables />}>
      <Route index element={<AddConsumables />} />
      <Route path="add" element={<AddConsumables />} />
      <Route path="view" element={<ViewAll />} />
      <Route path="pending" element={<PendingApprovals />} />
      <Route path="approved" element={<Approved />} />
    </Route>
    <Route path="stock" element={<StoreStock />} />
    <Route path="production" element={<ProductionLog />} />
    <Route path="inventory" element={<Inventory />} />
    <Route path="reports" element={<StoreReports />} />
  </Route>
);