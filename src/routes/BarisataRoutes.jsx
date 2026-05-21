import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoutes";
import BaristaLayout from "../components/layouts/BaristaLayout.jsx";

// Barista Pages
import Dashboard from "../pages/Barista/Dashboard";
import BaristaSales from "../pages/Barista/Sales.jsx";
import BaristMenus from "../pages/Barista/Menus.jsx";
import BaristaSettings from "../pages/Barista/Settings.jsx";
import BaristaCustomers from "../pages/Barista/Customers.jsx";
import BaristaReports from "../pages/Barista/Reports.jsx";
import BaristaDayClosing from "../pages/Barista/Day-Closing.jsx";
import LogoutPage from "../pages/LogoutPage.jsx";
import Sells from "../pages/Barista/Sells.jsx";

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
    <Route path="Sell" element={<Sells />} />
    <Route path="sales" element={<BaristaSales />} />
    <Route path="menus" element={<BaristMenus />} />
    <Route path="customers" element={<BaristaCustomers />} />
    <Route path="reports" element={<BaristaReports />} />
    <Route path="day-closing" element={<BaristaDayClosing />} />
    <Route path="management" element={<BaristaSettings />} />
    <Route path="settings" element={<BaristaSettings />} />
    <Route path="logout" element={<LogoutPage />} />
  </Route>
);
