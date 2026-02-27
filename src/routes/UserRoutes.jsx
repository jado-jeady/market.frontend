import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoutes";
import UserLayout from "../components/layouts/UserLayout";

// User Pages
import UserDashboard from "../Pages/user/UserDashboard";
import UserSales from "../pages/user/Sales/UserSales";
import NewSales from "../pages/user/Sales/NewSale";
import AllSales from "../pages/user/Sales/AllSales";
import Returns from "../pages/user/Returns";
import SalesStake from "../pages/user/Sales/SaleStake";
import ProductList from "../pages/user/Products/ProductList";
import LowStockAlerts from "../pages/user/Stock/LowStockAlerts";
import UserReport from "../pages/user/Reports/UserReports";
import DailySales from "../pages/user/Sales/DailySales";
import TransactionHistory from "../pages/user/Reports/TransactionHistory";
import Expenses from "../pages/user/Expenses";
import DayClosing from "../pages/user/DayClosing";
import CloseShift from "../components/Shifts/CloseShift";
import UserSettings from "../pages/user/Settings/UserSettings";
import TaxSettings from "../pages/user/Settings/TaxSettings";
import CurrencySettings from "../pages/user/Settings/CurrencySettings";
import ReceiptFormatSettings from "../pages/user/Settings/ReceiptFormat";
import UserCustomers from "../pages/user/UserCustomers";
import AddCustomer from "../pages/user/AddCustomer";
import SearchCustomer from "../pages/user/SearchCustomer";
import LoyaltyPoints from "../pages/user/LoyaltyPoints";
import UserManagement from "../pages/user/Settings/Management";

export const UserRoutes = (
  <Route
    path="/user"
    element={
      <ProtectedRoute allowedRole="Cashier">
        <UserLayout />
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<UserDashboard />} />
    <Route path="sales" element={<UserSales />}>
      <Route index element={<NewSales />} />
      <Route path="new" element={<NewSales />} />
      <Route path="history" element={<AllSales />} />
      <Route path="returns" element={<Returns />} />
      <Route path="all" element={<AllSales />} />
      <Route path="stake" element={<SalesStake />} />
    </Route>
    <Route path="products" element={<ProductList />} />
    <Route path="stock" element={<LowStockAlerts />} />
    <Route path="reports" element={<UserReport />}>
      <Route index element={<DailySales />} />
      <Route path="daily-sales" element={<DailySales />} />
      <Route path="transactions" element={<TransactionHistory />} />
      <Route path="expenses" element={<Expenses />} />
    </Route>
    <Route path="settings" element={<UserSettings />}>
      <Route path="tax" element={<TaxSettings />} />
      <Route path="currency" element={<CurrencySettings />} />
      <Route path="receipt" element={<ReceiptFormatSettings />} />
    </Route>
    <Route path="customers" element={<UserCustomers />}>
      <Route index element={<LoyaltyPoints />} />
      <Route path="add" element={<AddCustomer />} />
      <Route path="search" element={<SearchCustomer />} />
      <Route path="loyalty" element={<LoyaltyPoints />} />
    </Route>
    <Route path="expenses" element={<Expenses />} />
    <Route path="day-closing" element={<DayClosing />} />
    <Route path="close-shift" element={<CloseShift />} />
    <Route path="open-shift" element={<CloseShift />} />
    <Route path="management" element={<UserManagement />} />
  </Route>
);