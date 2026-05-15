import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoutes";
import BaristaLayout from "../components/layouts/BaristaLayout.jsx";

// Barista Pages
import Dashboard from "../pages/Barista/Dashboard";

export const BaristaRoutes = (
  <Route
    path="/barista"
    element={
      <ProtectedRoute allowedRole="Barista">
        <BaristaLayout />
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<Dashboard />} />
  </Route>
);
