import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import Login from './Pages/Login';
import AdminLayout from './components/layouts/AdminLayout';
import UserLayout from './components/layouts/userLayout';
import ProtectedRoute from './components/ProtectedRoutes';

// admin Imports
import Dashboard from './Pages/admin/Dashboard';
import AdminAllSales from './Pages/admin/AllSales';
import Report from './Pages/admin/Report';
import AllStock from './Pages/admin/AllStock';
import Management from './Pages/admin/Management/Management';
import AdminSettings from './Pages/admin/Settings';
import SettingsManagement from './Pages/admin/Management/SettingsManagement';
import ProdcutTransfer from './Pages/admin/ProdcutTransfer'
import AdminUserManagement from './Pages/admin/Management/UserManagement'
import AdminDayClosingPage from './Pages/admin/AdminDayClosingPage';
import Stock from './Pages/admin/Stock/Stock';
import AdminProductList from './Pages/admin/AdminProductList';


// User Pages
import NewSales from './Pages/user/NewSale';
import UserDashboard from './Pages/user/UserDashboard';
import UserSales from './Pages/user/UserSales';
import UserReport from './Pages/user/UserReports';
import UserManagement from './Pages/user/Management';
import UserCustomers from './Pages/user/UserCustomers';
import UserSettings from './Pages/user/UserSettings';
import TaxSettings from './Pages/user/TaxSettings';
import CurrencySettings from './Pages/user/CurrencySettings';
import ReceiptFormatSettings from './Pages/user/ReceiptFormat';
import SalesStake from './Pages/user/SaleStake';
import ProductList from './Pages/user/ProductList';
import DailySales from './Pages/user/DailySales';
import AddCustomer from './Pages/user/AddCustomer';
import LoyaltyPoints from './Pages/user/LoyaltyPoints';
import SearchCustomer from './Pages/user/SearchCustomer';
import AllSales from './Pages/user/AllSales';
import Returns from './Pages/user/Returns';
import StockIn from './Pages/admin/Stock/StockIn';
import StockOut from './Pages/admin/Stock/StockOut';
import RemovedStock from './Pages/admin/RemovedStock';
import AddProduct from './Pages/admin/AddProduct';
import Products from './Pages/admin/Products';
import ProductCategories from './Pages/admin/ProductCategories';
import ProductTransfer from './Pages/admin/ProdcutTransfer';
import Expenses from './Pages/user/Expenses';
import TransactionHistory from './Pages/user/TransactionHistory';
import DayClosing from './Pages/user/DayClosing';
import Settings from './Pages/user/Settings';
import ManageRoles from './Pages/admin/Management/ManageRoles';




function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="sales" element={<AdminAllSales />} />
          <Route path="products" element={<Products />}>
            <Route index element={<AdminProductList />} />
            <Route path='add' element ={<AddProduct/>}/>
            <Route path='transfer' element={<ProductTransfer />} />
            <Route path='list' element={<AdminProductList />} />
            <Route path='category' element={<ProductCategories />}/>

          </Route>
          <Route path="stock" element={<Stock />}>
            <Route index element={< AllStock/>}/>
            <Route path='in' element={<StockIn/>}/>
            <Route path='out' element={<StockOut/>} />
            <Route path='removed' element={<RemovedStock/>} />
          </Route>

           {/* SETTINGS */}
          <Route path="settings" element={<AdminSettings />}>
              <Route path="tax" element={<TaxSettings />} />
              <Route path="currency" element={<CurrencySettings />} />
              <Route path="receipt" element={<ReceiptFormatSettings />} />
          </Route>
          
          <Route path="management" element={<Management />}>
          
          <Route  index element={<ManageRoles/>} />
          <Route path='roles' element={<ManageRoles/>} />
          <Route path='users' element={<AdminUserManagement/>} />
          <Route path='settings' element={<SettingsManagement/>} />


          </Route>
          
          <Route path="report" element={<Report />} />
          <Route path="day-closing" element={<AdminDayClosingPage />} />
        </Route>

        {/* User Routes */}
        <Route path="/user"
        element={
        <ProtectedRoute allowedRole="Cashier">
          <UserLayout />
        </ProtectedRoute>
        }>

  <Route path="dashboard" element={<UserDashboard />} />

  {/* SALES */}
  <Route path="sales" element={<UserSales/>}>
  <Route index element={<NewSales />} />
    <Route path="new" element={<NewSales />} />
    <Route path="history" element={<AllSales />} />
    <Route path="returns" element={<Returns />} />
    <Route path='all' element={<AllSales/>}/>
    <Route path="Sales" element={< SalesStake/>} />
  </Route>

  <Route path="products" element={<ProductList />} />
  <Route path="stock" element={<AllStock />} />

  {/* REPORTS */}
  <Route path="reports" element={<UserReport />}>
    <Route index element={<DailySales />} />
    <Route path="daily-sales" element={<DailySales />} />
    <Route path="transactions" element={<TransactionHistory />} />
    <Route path="expenses" element={<Expenses />} />
  </Route>

  {/* SETTINGS */}
  <Route path="settings" element={<UserSettings />}>
    <Route index element={<TaxSettings />} />
    <Route path="tax" element={<TaxSettings />} />
    <Route path="currency" element={<CurrencySettings />} />
    <Route path="receipt" element={<ReceiptFormatSettings />} />
  </Route>

  {/* CUSTOMERS */}
  <Route path="customers" element={<UserCustomers />}>
    <Route path="add" element={<AddCustomer />} />
    <Route path="search" element={<SearchCustomer />} />
    <Route path="loyalty" element={<LoyaltyPoints />} />
  </Route>
  <Route path="expenses" element={<Expenses />} />
<Route path="day-closing" element={<DayClosing />} />
  <Route path="management" element={<UserManagement />} />
</Route>


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
