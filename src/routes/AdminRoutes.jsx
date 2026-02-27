import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoutes";
import AdminLayout from "../components/layouts/AdminLayout";

// Admin Pages
import Dashboard from "../pages/admin/Dashboard";
import Sales from "../pages/admin/Sales/Sales";
import AdminAllSales from "../pages/admin/Sales/AllSales";
import WeeklySales from "../pages/admin/Sales/WeeklySales";
import ItemSales from "../pages/admin/Sales/ItemSales";
import SalesClaim from "../pages/admin/Sales/SalesClaim";
import Products from "../pages/admin/Products/Products";
import AdminProductList from "../pages/admin/Products/AdminProductList";
import AddProduct from "../pages/admin/Products/AddProduct";
import ProductCategories from "../pages/admin/Products/ProductCategories";
import ProductTransfer from "../pages/admin/Products/ProdcutTransfer";
import Stock from "../pages/admin/Stock/Stock";
import AllStock from "../pages/admin/Stock/AllStock";
import StockIn from "../pages/admin/Stock/StockIn";
import StockOut from "../pages/admin/Stock/StockOut";
import StockAdjustment from "../pages/admin/Stock/Stock.Adjsutment";
import Management from "../pages/admin/Management/Management";
import ManageRoles from "../pages/admin/Management/ManageRoles";
import AdminUserManagement from "../pages/admin/Management/UserManagement";
import SettingsManagement from "../pages/admin/Management/SettingsManagement";
import AdminSettings from "../pages/admin/Settings";
import TaxSettings from "../pages/user/Settings/TaxSettings";
import CurrencySettings from "../pages/user/Settings/CurrencySettings";
import ReceiptFormatSettings from "../pages/user/Settings/ReceiptFormat";
import Report from "../pages/admin/Report";
import ShiftReport from "../pages/admin/ShiftReport";

export const AdminRoutes = (
  <Route
    path="/admin"
    element={
      <ProtectedRoute allowedRole="Admin">
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="sales" element={<Sales />}>
      <Route index element={<AdminAllSales />} />
      <Route path="weekly" element={<WeeklySales />} />
      <Route path="items" element={<ItemSales />} />
      <Route path="claim" element={<SalesClaim />} />
    </Route>
    <Route path="products" element={<Products />}>
      <Route index element={<AdminProductList />} />
      <Route path="add" element={<AddProduct />} />
      <Route path="category" element={<ProductCategories />} />
      <Route path="transfer" element={<ProductTransfer />} />
    </Route>
    <Route path="stock" element={<Stock />}>
      <Route index element={<AllStock />} />
      <Route path="in" element={<StockIn />} />
      <Route path="out" element={<StockOut />} />
      <Route path="adjustment" element={<StockAdjustment />} />
    </Route>
    <Route path="management" element={<Management />}>
      <Route index element={<ManageRoles />} />
      <Route path="roles" element={<ManageRoles />} />
      <Route path="users" element={<AdminUserManagement />} />
      <Route path="settings" element={<SettingsManagement />} />
    </Route>
    <Route path="settings" element={<AdminSettings />}>
      <Route path="tax" element={<TaxSettings />} />
      <Route path="currency" element={<CurrencySettings />} />
      <Route path="receipt" element={<ReceiptFormatSettings />} />
    </Route>
    <Route path="report" element={<Report />} />
    <Route path="day-closing" element={<ShiftReport />} />
  </Route>
);