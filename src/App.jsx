import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import Login from './Pages/Login';
import AdminLayout from './components/layouts/AdminLayout';
import UserLayout from './components/layouts/UserLayout';
import ProtectedRoute from './components/ProtectedRoutes';

// admin Imports
import Dashboard from './Pages/admin/Dashboard';
import AdminAllSales from './Pages/admin/Sales/AllSales';
import Report from './Pages/admin/Report';
import AllStock from './Pages/admin/Stock/AllStock';
import Management from './Pages/admin/Management/Management';
import AdminSettings from './Pages/admin/Settings';
import SettingsManagement from './Pages/admin/Management/SettingsManagement';
import ProdcutTransfer from './Pages/admin/Products/ProdcutTransfer'
import AdminUserManagement from './Pages/admin/Management/UserManagement'
import AdminDayClosingPage from './Pages/admin/AdminDayClosingPage';
import Stock from './Pages/admin/Stock/Stock';
import StockIn from './Pages/admin/Stock/StockIn';
import StockOut from './Pages/admin/Stock/StockOut';
import StockAdjustment from './Pages/admin/Stock/Stock.Adjsutment';
import AdminProductList from './Pages/admin/Products/AdminProductList';
import AddProduct from './Pages/admin/Products/AddProduct';
import Products from './Pages/admin/Products/Products';
import ProductCategories from './Pages/admin/Products/ProductCategories';
import ProductTransfer from './Pages/admin/Products/ProdcutTransfer';
import ManageRoles from './Pages/admin/Management/ManageRoles';
import Sales from './Pages/admin/Sales/Sales';
import ShiftReport from './Pages/admin/ShiftReport';
import WeeklySales from './Pages/admin/Sales/WeeklySales'

// User Pages
import NewSales from './Pages/user/Sales/NewSale';
import UserDashboard from './Pages/user/UserDashboard';
import UserSales from './Pages/user/Sales/UserSales';
import UserReport from './Pages/user/Reports/UserReports';
import UserManagement from './Pages/user/Settings/Management';
import UserCustomers from './Pages/user/UserCustomers';
import UserSettings from './Pages/user/Settings/UserSettings';
import TaxSettings from './Pages/user/Settings/TaxSettings';
import CurrencySettings from './Pages/user/Settings/CurrencySettings';
import ReceiptFormatSettings from './Pages/user/Settings/ReceiptFormat';
import SalesStake from './Pages/user/Sales/SaleStake';
import ProductList from './Pages/user/Products/ProductList';
import DailySales from './Pages/user/Sales/DailySales';
import AddCustomer from './Pages/user/AddCustomer';
import LoyaltyPoints from './Pages/user/LoyaltyPoints';
import SearchCustomer from './Pages/user/SearchCustomer';
import AllSales from './Pages/user/Sales/AllSales';
import Returns from './Pages/user/Returns';
import Expenses from './Pages/user/Expenses';
import TransactionHistory from './Pages/user/Reports/TransactionHistory';
import DayClosing from './Pages/user/DayClosing';
import Settings from './Pages/user/Settings/Settings';
import CloseShift from './components/Shifts/CloseShift';
import LowStockAlerts from './Pages/user/Stock/LowStockAlerts'; 




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
          <Route path="sales" element={<Sales/>}> 
              
              <Route index element={<AdminAllSales />}/>
              <Route path='daily' element={<DailySales />}/>
              <Route path='all' element={<AdminAllSales />}/>
              <Route path='weekly' element={<WeeklySales/>}/>
          
          </Route>
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
            <Route path='adjustment' element={<StockAdjustment/>} />
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
          <Route path="day-closing" element={<ShiftReport />} />
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
  <Route path="stock" element={<LowStockAlerts />} />

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
    <Route index element={<LoyaltyPoints/>}/>
    <Route path="add" element={<AddCustomer />} />
    <Route path="search" element={<SearchCustomer />} />
    <Route path="loyalty" element={<LoyaltyPoints />} />
  </Route>
  <Route path="expenses" element={<Expenses />} />
<Route path="day-closing" element={<DayClosing />} />
<Route path='close-shift' element={<CloseShift/>}/>
<Route path='open-shift' element={<CloseShift/>}/>

  <Route path="management" element={<UserManagement />} />
</Route>


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
