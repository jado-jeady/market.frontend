import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

import AdminLayout from './components/layouts/AdminLayout';
import UserLayout from './components/layouts/userLayout';

import Dashboard from './pages/admin/Dashboard';
import Sales from './pages/admin/Sales';
import Stock from './pages/admin/Stock';
import Report from './pages/admin/Report';
import Management from './pages/admin/Management';

// User Pages
import NewSales from './Pages/user/NewSale';
import UserDashboard from './Pages/user/UserDashboard';
import UserSales from './Pages/user/UserSales';
import UserStock from './Pages/user/AllStock';
import UserReport from './Pages/user/UserReports';
import UserManagement from './Pages/user/Management';
import UserCustomers from './Pages/user/UserCustomers';
import UserSettings from './Pages/user/UserSettings';
import TaxSettings from './Pages/user/TaxSettings';
import CurrencySettings from './Pages/user/CurrencySettings';
import ReceiptFormatSettings from './Pages/user/ReceiptFormat';

import ProtectedRoute from './components/ProtectedRoutes';
import ProductList from './Pages/user/ProductList';
import AllStock from './Pages/user/AllStock';
import DailySales from './Pages/user/DailySales';
import AddCustomer from './Pages/user/AddCustomer';
import LoyaltyPoints from './Pages/user/LoyaltyPoints';
import SearchCustomer from './Pages/user/SearchCustomer';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="sales" element={<Sales />} />
          <Route path="products" element={<ProductList />} />
          <Route path="stock" element={<Stock />} />
          <Route path="report" element={<Report />} />
          <Route path="management" element={<Management />} />
        </Route>

        {/* User Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRole="user">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="sales/*" element={<NewSales />} />
          <Route path="sales/new" element={<NewSales />} />
          <Route path="sales/history" element={<UserSales />} />
          <Route path="products" element={<ProductList />} />
          <Route path="stock" element={<AllStock />} />
          <Route path="stock" element={<UserStock />} />
          <Route path="reports/*" element={<UserReport />} />
          <Route path="reports/daily-sales" element={<DailySales />} />
          <Route path="settings/*" element={<UserSettings />} />
          <Route path="settings/tax" element={<TaxSettings />} />
          <Route path="settings/currency" element={<CurrencySettings />} />
          <Route path="settings/receipt" element={<ReceiptFormatSettings />} />


          <Route path="customers/*" element={<UserCustomers />} />
          <Route path="customers/add" element={<AddCustomer />} />
          <Route path="customers/search" element={<SearchCustomer />} />
          <Route path="customers/loyalty" element={<LoyaltyPoints />} />

          <Route path="management" element={<UserManagement />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
