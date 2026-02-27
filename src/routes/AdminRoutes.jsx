import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoutes";
import AdminLayout from "../components/layouts/AdminLayout";

// Admin Pages
import Dashboard from "../Pages/admin/Dashboard";
import Sales from "../Pages/admin/Sales/Sales";
import AdminAllSales from "../Pages/admin/Sales/AllSales";
import WeeklySales from "../Pages/admin/Sales/WeeklySales";
import ItemSales from "../Pages/admin/Sales/ItemSales";
import SalesClaim from "../Pages/admin/Sales/SalesClaim";
import Products from "../Pages/admin/Products/Products";
import AdminProductList from "../Pages/admin/Products/AdminProductList";
import AddProduct from "../Pages/admin/Products/AddProduct";
import ProductCategories from "../Pages/admin/Products/ProductCategories";
import ProductTransfer from "../Pages/admin/Products/ProdcutTransfer";
import Stock from "../Pages/admin/Stock/Stock";
import AllStock from "../Pages/admin/Stock/AllStock";
import StockIn from "../Pages/admin/Stock/StockIn";
import StockOut from "../Pages/admin/Stock/StockOut";
import StockAdjustment from "../Pages/admin/Stock/Stock.Adjsutment";
import Management from "../Pages/admin/Management/Management";
import ManageRoles from "../Pages/admin/Management/ManageRoles";
import AdminUserManagement from "../Pages/admin/Management/UserManagement";
import SettingsManagement from "../Pages/admin/Management/SettingsManagement";
import AdminSettings from "../Pages/admin/Settings";
import TaxSettings from "../Pages/user/Settings/TaxSettings";
import CurrencySettings from "../Pages/user/Settings/CurrencySettings";
import ReceiptFormatSettings from "../Pages/user/Settings/ReceiptFormat";
import Report from "../Pages/admin/Report";
import ShiftReport from "../Pages/admin/ShiftReport";

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